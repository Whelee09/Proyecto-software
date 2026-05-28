import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectsService } from '../projects/projects.service';
import { AuthUser } from '../common/current-user.decorator';

const user: AuthUser = { id: 'user1', email: 'user@test.com', role: 'MEMBER' };

const mockPrisma = {
  task: { create: jest.fn(), findMany: jest.fn(), findUniqueOrThrow: jest.fn(), update: jest.fn(), delete: jest.fn() },
  teamMember: { findUnique: jest.fn() },
  taskComment: { create: jest.fn(), findMany: jest.fn() },
};

const mockProjects = {
  ensureProjectMember: jest.fn(),
};

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: ProjectsService, useValue: mockProjects },
      ],
    }).compile();
    service = module.get(TasksService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('crea tarea correctamente cuando el asignado pertenece al equipo', async () => {
      mockProjects.ensureProjectMember.mockResolvedValue({ id: 'p1', teamId: 'team1' });
      mockPrisma.teamMember.findUnique.mockResolvedValue({ userId: 'assignee1', teamId: 'team1' });
      mockPrisma.task.create.mockResolvedValue({ id: 't1', title: 'Nueva tarea' });

      const result = await service.create({ projectId: 'p1', title: 'Nueva tarea', assignedToId: 'assignee1' } as any, user);

      expect(result).toMatchObject({ id: 't1' });
    });

    it('lanza BadRequestException cuando el asignado no pertenece al equipo', async () => {
      mockProjects.ensureProjectMember.mockResolvedValue({ id: 'p1', teamId: 'team1' });
      mockPrisma.teamMember.findUnique.mockResolvedValue(null);

      await expect(
        service.create({ projectId: 'p1', title: 'Tarea', assignedToId: 'outsider' } as any, user),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('elimina la tarea cuando el usuario tiene acceso al proyecto', async () => {
      mockPrisma.task.findUniqueOrThrow.mockResolvedValue({ id: 't1', projectId: 'p1' });
      mockProjects.ensureProjectMember.mockResolvedValue({ id: 'p1', teamId: 'team1' });
      mockPrisma.task.delete.mockResolvedValue({ id: 't1' });

      const result = await service.remove('t1', user);

      expect(result).toEqual({ deleted: true });
      expect(mockPrisma.task.delete).toHaveBeenCalledWith({ where: { id: 't1' } });
    });
  });
});
