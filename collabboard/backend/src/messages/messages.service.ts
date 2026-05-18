import { Injectable } from '@nestjs/common';
import { AuthUser } from '../common/current-user.decorator';
import { ChannelsService } from '../channels/channels.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { SendMessageDto } from './dto';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService, private readonly channels: ChannelsService, private readonly notifications: NotificationsService) {}
  include = { user: { select: { id: true, name: true, avatarUrl: true } } };
  async byChannel(channelId: string, user: AuthUser) {
    await this.channels.ensureChannelMember(channelId, user);
    return this.prisma.message.findMany({ where: { channelId }, include: this.include, orderBy: { createdAt: 'asc' }, take: 100 });
  }
  async send(dto: SendMessageDto, user: AuthUser) {
    const channel = await this.channels.ensureChannelMember(dto.channelId, user);
    const message = await this.prisma.message.create({
      data: { channelId: dto.channelId, userId: user.id, content: dto.content },
      include: this.include,
    });
    const members = await this.prisma.teamMember.findMany({
      where: { teamId: channel.teamId, userId: { not: user.id } },
      select: { userId: true },
    });
    await this.notifications.createMany(
      members.map((member) => ({
        userId: member.userId,
        type: 'MESSAGE',
        title: `Nuevo mensaje en ${channel.name}`,
        body: `${message.user.name}: ${message.content.slice(0, 90)}`,
        teamId: channel.teamId,
        projectId: channel.projectId ?? undefined,
        channelId: channel.id,
        messageId: message.id,
      })),
    );
    return message;
  }
}
