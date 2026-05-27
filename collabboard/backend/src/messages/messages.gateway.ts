import { UsePipes, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthUser } from '../common/current-user.decorator';
import { ChannelsService } from '../channels/channels.service';
import { PrismaService } from '../prisma/prisma.service';
import { SendMessageDto } from './dto';
import { MessagesService } from './messages.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class MessagesGateway implements OnGatewayConnection, OnGatewayInit {
  @WebSocketServer() server!: Server;
  private readonly supabase?: SupabaseClient;
  private readonly demoAuthEnabled: boolean;

  constructor(private readonly config: ConfigService, private readonly channels: ChannelsService, private readonly messages: MessagesService, private readonly prisma: PrismaService) {
    this.demoAuthEnabled = this.config.get<string>('DEMO_AUTH_ENABLED') === 'true';
    if (!this.demoAuthEnabled) {
      this.supabase = createClient(
        this.config.getOrThrow<string>('SUPABASE_URL'),
        this.config.getOrThrow<string>('SUPABASE_KEY'),
        { auth: { autoRefreshToken: false, persistSession: false } },
      );
    }
  }

  afterInit(server: Server) {
    server.use(async (client, next) => {
      const token = this.getToken(client);
      if (!token) return next(new Error('Unauthorized'));
      try {
        client.data.user = await this.authenticateToken(token);
        return next();
      } catch {
        return next(new Error('Unauthorized'));
      }
    });
  }

  handleConnection(client: Socket) {
    if (!client.data.user) client.disconnect(true);
  }

  private getToken(client: Socket) {
    return client.handshake.auth?.token ?? String(client.handshake.headers.authorization ?? '').replace('Bearer ', '');
  }

  private async authenticateToken(token: string): Promise<AuthUser> {
    if (this.demoAuthEnabled) {
      const demoToken = this.config.get<string>('DEMO_AUTH_TOKEN') ?? 'dev-demo-token';
      if (token !== demoToken) throw new Error('Invalid demo token');
      const demoEmail = this.config.get<string>('DEMO_USER_EMAIL') ?? 'admin@collabboard.com';
      const user = await this.prisma.user.findUniqueOrThrow({ where: { email: demoEmail } });
      return { id: user.id, email: user.email, role: user.role };
    }

    if (!this.supabase) throw new Error('Supabase client not configured');
    const { data: { user: sbUser }, error } = await this.supabase.auth.getUser(token);
    if (error || !sbUser?.email) throw new Error('Invalid Supabase token');

    let user = await this.prisma.user.findUnique({ where: { supabaseId: sbUser.id } });
    if (!user) {
      const existing = await this.prisma.user.findUnique({ where: { email: sbUser.email } });
      if (existing) {
        user = await this.prisma.user.update({ where: { id: existing.id }, data: { supabaseId: sbUser.id } });
      } else {
        const meta = sbUser.user_metadata as { name?: string; full_name?: string } | undefined;
        const name = meta?.full_name ?? meta?.name ?? sbUser.email.split('@')[0];
        user = await this.prisma.user.create({ data: { supabaseId: sbUser.id, email: sbUser.email, name } });
      }
    }

    return { id: user.id, email: user.email, role: user.role };
  }

  @SubscribeMessage('join_channel')
  async join(@MessageBody('channelId') channelId: string, @ConnectedSocket() client: Socket) {
    if (!client.data.user) throw new WsException('Unauthorized');
    await this.channels.ensureChannelMember(channelId, client.data.user);
    await client.join(channelId);
    return { ok: true };
  }

  @SubscribeMessage('leave_channel')
  async leave(@MessageBody('channelId') channelId: string, @ConnectedSocket() client: Socket) {
    await client.leave(channelId);
    return { ok: true };
  }

  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @SubscribeMessage('send_message')
  async send(@MessageBody() dto: SendMessageDto, @ConnectedSocket() client: Socket) {
    if (!client.data.user) throw new WsException('Unauthorized');
    const message = await this.messages.send(dto, client.data.user);
    this.server.to(dto.channelId).emit('new_message', message);
    return message;
  }
}

