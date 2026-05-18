import { Injectable } from '@nestjs/common';
import { AuthUser } from '../common/current-user.decorator';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { TeamsService } from '../teams/teams.service';
import { CreateProjectDto, UpdateProjectDto } from './dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService, private readonly teams: TeamsService, private readonly notifications: NotificationsService) {}
  include = { team: true, tasks: true, channels: true };

  async create(dto: CreateProjectDto, user: AuthUser) {
    await this.teams.ensureManager(dto.teamId, user);
    const project = await this.prisma.project.create({
      data: { ...dto, channels: { create: { name: 'Proyecto', type: 'PROJECT', teamId: dto.teamId } } },
      include: this.include,
    });
    const members = await this.prisma.teamMember.findMany({
      where: { teamId: dto.teamId, userId: { not: user.id } },
      select: { userId: true },
    });
    await this.notifications.createMany(
      members.map((member) => ({
        userId: member.userId,
        type: 'PROJECT_CREATED',
        title: 'Nuevo proyecto disponible',
        body: `Te agregaron al proyecto ${project.name} por pertenecer al equipo ${project.team.name}.`,
        teamId: dto.teamId,
        projectId: project.id,
      })),
    );
    return project;
  }
  async byTeam(teamId: string, user: AuthUser) {
    await this.teams.ensureMember(teamId, user);
    return this.prisma.project.findMany({ where: { teamId }, include: this.include, orderBy: { createdAt: 'desc' } });
  }
  async findOne(id: string, user: AuthUser) {
    const project = await this.prisma.project.findUniqueOrThrow({ where: { id }, include: this.include });
    await this.teams.ensureMember(project.teamId, user);
    return project;
  }
  async update(id: string, dto: UpdateProjectDto, user: AuthUser) {
    const project = await this.prisma.project.findUniqueOrThrow({ where: { id } });
    await this.teams.ensureManager(project.teamId, user);
    return this.prisma.project.update({ where: { id }, data: dto, include: this.include });
  }
  async remove(id: string, user: AuthUser) {
    const project = await this.prisma.project.findUniqueOrThrow({ where: { id } });
    await this.teams.ensureManager(project.teamId, user);
    await this.prisma.project.delete({ where: { id } });
    return { deleted: true };
  }
  async ensureProjectMember(projectId: string, user: AuthUser) {
    const project = await this.prisma.project.findUniqueOrThrow({ where: { id: projectId } });
    await this.teams.ensureMember(project.teamId, user);
    return project;
  }
}
