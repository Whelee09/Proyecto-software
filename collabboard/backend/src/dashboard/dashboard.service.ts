import { Injectable } from '@nestjs/common';
import { AuthUser } from '../common/current-user.decorator';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}
  async summary(user: AuthUser) {
    const teamFilter = user.role === 'ADMIN' ? {} : { members: { some: { userId: user.id } } };
    const teams = await this.prisma.team.findMany({ where: teamFilter, select: { id: true } });
    const teamIds = teams.map((team) => team.id);
    const projectWhere = user.role === 'ADMIN' ? {} : { teamId: { in: teamIds } };
    const projectIds = (await this.prisma.project.findMany({ where: projectWhere, select: { id: true } })).map((p) => p.id);
    const now = new Date();
    const [teamCount, activeProjects, pendingTasks, completedTasks, userCount, upcomingEvents, latestFiles, latestMessages] = await Promise.all([
      this.prisma.team.count({ where: teamFilter }),
      this.prisma.project.count({ where: { ...projectWhere, status: 'ACTIVE' } }),
      this.prisma.task.count({ where: { projectId: { in: projectIds }, status: 'PENDING' } }),
      this.prisma.task.count({ where: { projectId: { in: projectIds }, status: 'COMPLETED' } }),
      user.role === 'ADMIN' ? this.prisma.user.count() : this.prisma.teamMember.count({ where: { teamId: { in: teamIds } } }),
      this.prisma.event.findMany({ where: { teamId: { in: teamIds }, startDate: { gte: now } }, take: 6, orderBy: { startDate: 'asc' } }),
      this.prisma.file.findMany({ where: { projectId: { in: projectIds } }, take: 6, orderBy: { createdAt: 'desc' } }),
      this.prisma.message.findMany({ where: { channel: { teamId: { in: teamIds } } }, include: { user: { select: { name: true } }, channel: true }, take: 6, orderBy: { createdAt: 'desc' } }),
    ]);
    return { teamCount, activeProjects, pendingTasks, completedTasks, userCount, upcomingEvents, latestFiles, latestMessages };
  }
}

