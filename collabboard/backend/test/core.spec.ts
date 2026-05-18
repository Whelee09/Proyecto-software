import { DashboardService } from '../src/dashboard/dashboard.service';
import { TeamsService } from '../src/teams/teams.service';
import { TasksService } from '../src/tasks/tasks.service';

describe('Core services', () => {
  it('creates teams with owner membership', async () => {
    const prisma: any = { team: { create: jest.fn((args) => args) } };
    const service = new TeamsService(prisma, {} as any);
    const result: any = await service.create({ name: 'Equipo' }, { id: 'u1', email: 'a@b.com', role: 'MEMBER' });
    expect(result.data.members.create.role).toBe('OWNER');
  });

  it('creates tasks with current user as creator', async () => {
    const prisma: any = { task: { create: jest.fn((args) => args) } };
    const projects: any = { ensureProjectMember: jest.fn(() => ({ teamId: 't1' })) };
    const service = new TasksService(prisma, projects);
    const result: any = await service.create({ projectId: 'p1', title: 'Task' }, { id: 'u1', email: 'a@b.com', role: 'MEMBER' });
    expect(result.data.createdById).toBe('u1');
  });

  it('dashboard summary returns real counters', async () => {
    const prisma: any = {
      team: { findMany: jest.fn(() => [{ id: 't1' }]), count: jest.fn(() => 1) },
      project: { findMany: jest.fn(() => [{ id: 'p1' }]), count: jest.fn(() => 2) },
      task: { count: jest.fn(() => 3) },
      user: { count: jest.fn(() => 4) },
      teamMember: { count: jest.fn(() => 4) },
      event: { findMany: jest.fn(() => []) },
      file: { findMany: jest.fn(() => []) },
      message: { findMany: jest.fn(() => []) },
    };
    const service = new DashboardService(prisma);
    const result = await service.summary({ id: 'admin', email: 'admin@mail.com', role: 'ADMIN' });
    expect(result.teamCount).toBe(1);
    expect(result.activeProjects).toBe(2);
  });
});
