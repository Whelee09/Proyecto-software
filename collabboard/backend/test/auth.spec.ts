import { AuthService } from '../src/auth/auth.service';

describe('AuthService', () => {
  const prisma: any = {
    user: {
      findUniqueOrThrow: jest.fn(() =>
        Promise.resolve({ id: 'u1', name: 'Test', email: 'test@mail.com', password: null, role: 'MEMBER', supabaseId: 'sb-1', avatarUrl: null, createdAt: new Date(), updatedAt: new Date() }),
      ),
    },
  };
  const service = new AuthService(prisma);

  it('me returns user without password', async () => {
    const result = await service.me('u1');
    expect(result).not.toHaveProperty('password');
    expect(result.email).toBe('test@mail.com');
  });
});
