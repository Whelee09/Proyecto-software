import { Injectable } from '@nestjs/common';
import { NotificationType } from '@prisma/client';
import { AuthUser } from '../common/current-user.decorator';
import { PrismaService } from '../prisma/prisma.service';

type CreateNotificationInput = {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  teamId?: string;
  projectId?: string;
  channelId?: string;
  messageId?: string;
  eventId?: string;
};

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  private include = {
    team: { select: { id: true, name: true } },
    project: { select: { id: true, name: true } },
    channel: { select: { id: true, name: true } },
    event: { select: { id: true, title: true, startDate: true } },
  };

  list(user: AuthUser) {
    return this.prisma.notification.findMany({
      where: { userId: user.id },
      include: this.include,
      orderBy: { createdAt: 'desc' },
      take: 30,
    });
  }

  unreadCount(user: AuthUser) {
    return this.prisma.notification.count({ where: { userId: user.id, readAt: null } });
  }

  async markRead(id: string, user: AuthUser) {
    return this.prisma.notification.update({
      where: { id, userId: user.id },
      data: { readAt: new Date() },
      include: this.include,
    });
  }

  async markAllRead(user: AuthUser) {
    await this.prisma.notification.updateMany({
      where: { userId: user.id, readAt: null },
      data: { readAt: new Date() },
    });
    return { ok: true };
  }

  async create(input: CreateNotificationInput) {
    return this.prisma.notification.create({ data: input });
  }

  async createMany(inputs: CreateNotificationInput[]) {
    if (!inputs.length) return { count: 0 };
    return this.prisma.notification.createMany({ data: inputs });
  }

  async createTodayEventNotifications(user: AuthUser) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 1);
    const events = await this.prisma.event.findMany({
      where: {
        startDate: { gte: start, lt: end },
        team: user.role === 'ADMIN' ? undefined : { members: { some: { userId: user.id } } },
      },
      include: { project: true, team: true },
      orderBy: { startDate: 'asc' },
    });

    const existing = await this.prisma.notification.findMany({
      where: { userId: user.id, type: 'EVENT_TODAY', eventId: { in: events.map((event) => event.id) } },
      select: { eventId: true },
    });
    const existingIds = new Set(existing.map((notification) => notification.eventId));
    await this.createMany(
      events
        .filter((event) => !existingIds.has(event.id))
        .map((event) => ({
          userId: user.id,
          type: NotificationType.EVENT_TODAY,
          title: 'Evento de hoy',
          body: `${event.title} · ${event.project?.name ?? event.team.name}`,
          teamId: event.teamId,
          projectId: event.projectId ?? undefined,
          eventId: event.id,
        })),
    );
  }
}

