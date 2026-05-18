import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthUser } from '../common/current-user.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectsService } from '../projects/projects.service';
import { TeamsService } from '../teams/teams.service';
import { CreateEventDto, UpdateEventDto } from './dto';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService, private readonly teams: TeamsService, private readonly projects: ProjectsService) {}

  private include = {
    team: { select: { id: true, name: true } },
    project: { select: { id: true, name: true, status: true } },
    createdBy: { select: { id: true, name: true, email: true } },
  };

  async create(dto: CreateEventDto, user: AuthUser) {
    await this.teams.ensureMember(dto.teamId, user);
    if (dto.projectId) {
      const project = await this.projects.ensureProjectMember(dto.projectId, user);
      if (project.teamId !== dto.teamId) throw new BadRequestException('Project does not belong to team');
    }
    return this.prisma.event.create({ data: { ...dto, createdById: user.id }, include: this.include });
  }
  async mine(user: AuthUser) {
    const where = user.role === 'ADMIN'
      ? {}
      : { team: { members: { some: { userId: user.id } } } };
    return this.prisma.event.findMany({
      where,
      include: this.include,
      orderBy: { startDate: 'asc' },
    });
  }
  async byTeam(teamId: string, user: AuthUser) {
    await this.teams.ensureMember(teamId, user);
    return this.prisma.event.findMany({ where: { teamId }, include: this.include, orderBy: { startDate: 'asc' } });
  }
  async byProject(projectId: string, user: AuthUser) {
    await this.projects.ensureProjectMember(projectId, user);
    return this.prisma.event.findMany({ where: { projectId }, include: this.include, orderBy: { startDate: 'asc' } });
  }
  async update(id: string, dto: UpdateEventDto, user: AuthUser) {
    const event = await this.prisma.event.findUniqueOrThrow({ where: { id } });
    await this.teams.ensureMember(event.teamId, user);
    return this.prisma.event.update({ where: { id }, data: dto, include: this.include });
  }
  async remove(id: string, user: AuthUser) {
    const event = await this.prisma.event.findUniqueOrThrow({ where: { id } });
    await this.teams.ensureMember(event.teamId, user);
    await this.prisma.event.delete({ where: { id } });
    return { deleted: true };
  }
}
