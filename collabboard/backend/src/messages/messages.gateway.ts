import { UsePipes, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthUser } from '../common/current-user.decorator';
import { ChannelsService } from '../channels/channels.service';
import { SendMessageDto } from './dto';
import { MessagesService } from './messages.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class MessagesGateway implements OnGatewayConnection {
  @WebSocketServer() server!: Server;
  constructor(private readonly jwt: JwtService, private readonly config: ConfigService, private readonly channels: ChannelsService, private readonly messages: MessagesService) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.auth?.token ?? String(client.handshake.headers.authorization ?? '').replace('Bearer ', '');
    try {
      const payload = await this.jwt.verifyAsync<{ sub: string; email: string; role: 'ADMIN' | 'MEMBER' }>(token, { secret: this.config.get<string>('JWT_SECRET') ?? 'dev-secret' });
      client.data.user = { id: payload.sub, email: payload.email, role: payload.role } satisfies AuthUser;
    } catch {
      client.disconnect(true);
    }
  }

  @SubscribeMessage('join_channel')
  async join(@MessageBody('channelId') channelId: string, @ConnectedSocket() client: Socket) {
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
    const message = await this.messages.send(dto, client.data.user);
    this.server.to(dto.channelId).emit('new_message', message);
    return message;
  }
}

