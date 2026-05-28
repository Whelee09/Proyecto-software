import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrisma = {
  user: { findUniqueOrThrow: jest.fn() },
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AuthService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();
    service = module.get(AuthService);
    jest.clearAllMocks();
  });

  it('retorna usuario sin el campo password', async () => {
    mockPrisma.user.findUniqueOrThrow.mockResolvedValue({
      id: 'u1',
      email: 'test@example.com',
      name: 'Test',
      role: 'MEMBER',
      password: 'hashed-secret',
    });

    const result = await service.me('u1');

    expect(result).not.toHaveProperty('password');
    expect(result).toMatchObject({ id: 'u1', email: 'test@example.com' });
  });

  it('lanza error cuando el usuario no existe', async () => {
    mockPrisma.user.findUniqueOrThrow.mockRejectedValue(new Error('Not found'));

    await expect(service.me('nonexistent')).rejects.toThrow();
  });
});
