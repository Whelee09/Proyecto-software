import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthUser } from '../common/current-user.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectsService } from '../projects/projects.service';
import { CreateCommentDto, CreateTaskDto, UpdateTaskDto } from './dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService, private readonly projects: ProjectsService) {}
  include = {
    assignedTo: { select: { id: true, name: true, email: true, avatarUrl: true } },
    createdBy: { select: { id: true, name: true, email: true } },
    comments: { include: { user: { select: { id: true, name: true, avatarUrl: true } } }, orderBy: { createdAt: 'asc' as const } },
  };

  async create(dto: CreateTaskDto, user: AuthUser) {
    const project = await this.projects.ensureProjectMember(dto.projectId, user);
    if (dto.assignedToId) await this.ensureAssignee(project.teamId, dto.assignedToId);
    return this.prisma.task.create({ data: { ...dto, createdById: user.id }, include: this.include });
  }

  async byProject(projectId: string, user: AuthUser) {
    await this.projects.ensureProjectMember(projectId, user);
    return this.prisma.task.findMany({ where: { projectId }, include: this.include, orderBy: [{ status: 'asc' }, { updatedAt: 'desc' }] });
  }

  async findOne(id: string, user: AuthUser) {
    const task = await this.prisma.task.findUniqueOrThrow({ where: { id }, include: { project: true, ...this.include } });
    await this.projects.ensureProjectMember(task.projectId, user);
    return task;
  }

  async update(id: string, dto: UpdateTaskDto, user: AuthUser) {
    const task = await this.prisma.task.findUniqueOrThrow({ where: { id }, include: { project: true } });
    await this.projects.ensureProjectMember(task.projectId, user);
    if (dto.assignedToId) await this.ensureAssignee(task.project.teamId, dto.assignedToId);
    return this.prisma.task.update({ where: { id }, data: dto, include: this.include });
  }

  async remove(id: string, user: AuthUser) {
    const task = await this.prisma.task.findUniqueOrThrow({ where: { id } });
    await this.projects.ensureProjectMember(task.projectId, user);
    await this.prisma.task.delete({ where: { id } });
    return { deleted: true };
  }

  async addComment(id: string, dto: CreateCommentDto, user: AuthUser) {
    const task = await this.prisma.task.findUniqueOrThrow({ where: { id } });
    await this.projects.ensureProjectMember(task.projectId, user);
    return this.prisma.taskComment.create({
      data: { taskId: id, userId: user.id, content: dto.content },
      include: { user: { select: { id: true, name: true, avatarUrl: true } } },
    });
  }

  async comments(id: string, user: AuthUser) {
    const task = await this.prisma.task.findUniqueOrThrow({ where: { id } });
    await this.projects.ensureProjectMember(task.projectId, user);
    return this.prisma.taskComment.findMany({ where: { taskId: id }, include: { user: { select: { id: true, name: true, avatarUrl: true } } }, orderBy: { createdAt: 'asc' } });
  }

  private async ensureAssignee(teamId: string, userId: string) {
    const member = await this.prisma.teamMember.findUnique({ where: { userId_teamId: { userId, teamId } } });
    if (!member) throw new BadRequestException('Assigned user must belong to the project team');
  }
}

