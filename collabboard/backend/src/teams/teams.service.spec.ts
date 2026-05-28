import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TeamRole, GlobalRole } from '@prisma/client';
import { TeamsService } from './teams.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { AuthUser } from '../common/current-user.decorator';

const adminUser: AuthUser = { id: 'admin1', email: 'admin@test.com', role: 'ADMIN' };
const memberUser: AuthUser = { id: 'user1', email: 'user@test.com', role: 'MEMBER' };

const mockPrisma = {
  team: { create: jest.fn(), findMany: jest.fn(), findUniqueOrThrow: jest.fn(), update: jest.fn(), delete: jest.fn() },
  teamMember: { findUnique: jest.fn(), upsert: jest.fn(), delete: jest.fn() },
  user: { findUnique: jest.fn() },
};

const mockNotifications = { create: jest.fn() };

describe('TeamsService', () => {
  let service: TeamsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TeamsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: NotificationsService, useValue: mockNotifications },
      ],
    }).compile();
    service = module.get(TeamsService);
    jest.clearAllMocks();
  });

  describe('ensureMember', () => {
    it('ADMIN siempre pasa sin consultar la BD', async () => {
      await service.ensureMember('team1', adminUser);

      expect(mockPrisma.teamMember.findUnique).not.toHaveBeenCalled();
    });

    it('lanza ForbiddenException cuando el usuario no es miembro', async () => {
      mockPrisma.teamMember.findUnique.mockResolvedValue(null);

      await expect(service.ensureMember('team1', memberUser)).rejects.toThrow(ForbiddenException);
    });

    it('no lanza error cuando el usuario sí es miembro', async () => {
      mockPrisma.teamMember.findUnique.mockResolvedValue({ userId: 'user1', teamId: 'team1', role: TeamRole.MEMBER });

      await expect(service.ensureMember('team1', memberUser)).resolves.not.toThrow();
    });
  });

  describe('ensureManager', () => {
    it('lanza ForbiddenException para rol MEMBER', async () => {
      mockPrisma.teamMember.findUnique.mockResolvedValue({ userId: 'user1', teamId: 'team1', role: TeamRole.MEMBER });

      await expect(service.ensureManager('team1', memberUser)).rejects.toThrow(ForbiddenException);
    });

    it('no lanza error para rol OWNER', async () => {
      mockPrisma.teamMember.findUnique.mockResolvedValue({ userId: 'user1', teamId: 'team1', role: TeamRole.OWNER });

      await expect(service.ensureManager('team1', memberUser)).resolves.not.toThrow();
    });
  });

  describe('addMember', () => {
    it('lanza NotFoundException cuando el email no existe', async () => {
      mockPrisma.teamMember.findUnique.mockResolvedValue({ userId: 'user1', teamId: 'team1', role: TeamRole.OWNER });
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.addMember('team1', { email: 'ghost@test.com', role: TeamRole.MEMBER }, memberUser),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
