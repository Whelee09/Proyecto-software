import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { GlobalRole, TeamRole } from '@prisma/client';
import { AuthUser } from '../common/current-user.decorator';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { AddMemberDto, CreateTeamDto, UpdateTeamDto } from './dto';

@Injectable()
export class TeamsService {
  constructor(private readonly prisma: PrismaService, private readonly notifications: NotificationsService) {}

  include = {
    owner: { select: { id: true, name: true, email: true } },
    members: { include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } } },
    channels: true,
  };

  async create(dto: CreateTeamDto, user: AuthUser) {
    return this.prisma.team.create({
      data: {
        ...dto,
        ownerId: user.id,
        members: { create: { userId: user.id, role: TeamRole.OWNER } },
        channels: { create: { name: 'General', type: 'TEAM' } },
      },
      include: this.include,
    });
  }

  findAll(user: AuthUser) {
    if (user.role === GlobalRole.ADMIN) return this.prisma.team.findMany({ include: this.include, orderBy: { createdAt: 'desc' } });
    return this.prisma.team.findMany({ where: { members: { some: { userId: user.id } } }, include: this.include, orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string, user: AuthUser) {
    await this.ensureMember(id, user);
    return this.prisma.team.findUniqueOrThrow({ where: { id }, include: this.include });
  }

  async update(id: string, dto: UpdateTeamDto, user: AuthUser) {
    await this.ensureManager(id, user);
    return this.prisma.team.update({ where: { id }, data: dto, include: this.include });
  }

  async remove(id: string, user: AuthUser) {
    await this.ensureManager(id, user);
    await this.prisma.team.delete({ where: { id } });
    return { deleted: true };
  }

  async addMember(teamId: string, dto: AddMemberDto, user: AuthUser) {
    await this.ensureManager(teamId, user);
    const member = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } });
    if (!member) throw new NotFoundException('User not found');
    const created = await this.prisma.teamMember.upsert({
      where: { userId_teamId: { userId: member.id, teamId } },
      update: { role: dto.role },
      create: { userId: member.id, teamId, role: dto.role },
      include: {
        user: { select: { id: true, name: true, email: true, avatarUrl: true } },
        team: { select: { id: true, name: true } },
      },
    });
    if (member.id !== user.id) {
      await this.notifications.create({
        userId: member.id,
        type: 'TEAM_MEMBER_ADDED',
        title: 'Te agregaron a un equipo',
        body: `Ahora haces parte de ${created.team.name}. Veras sus proyectos y eventos.`,
        teamId,
      });
    }
    return created;
  }

  async removeMember(teamId: string, userId: string, user: AuthUser) {
    await this.ensureManager(teamId, user);
    await this.prisma.teamMember.delete({ where: { userId_teamId: { userId, teamId } } });
    return { deleted: true };
  }

  async ensureMember(teamId: string, user: AuthUser) {
    if (user.role === GlobalRole.ADMIN) return;
    const member = await this.prisma.teamMember.findUnique({ where: { userId_teamId: { userId: user.id, teamId } } });
    if (!member) throw new ForbiddenException('You are not a member of this team');
  }

  async ensureManager(teamId: string, user: AuthUser) {
    if (user.role === GlobalRole.ADMIN) return;
    const member = await this.prisma.teamMember.findUnique({ where: { userId_teamId: { userId: user.id, teamId } } });
    if (!member || (member.role !== TeamRole.OWNER && member.role !== TeamRole.MANAGER)) throw new ForbiddenException('Manager role required');
  }
}
