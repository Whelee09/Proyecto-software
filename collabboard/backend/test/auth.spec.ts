import { AuthService } from '../src/auth/auth.service';

describe('AuthService', () => {
  const prisma: any = { user: { findUnique: jest.fn(), create: jest.fn() } };
  const jwt: any = { sign: jest.fn(() => 'token') };
  const service = new AuthService(prisma, jwt);

  it('register creates a user and returns a token', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({ id: 'u1', name: 'Test', email: 'test@mail.com', password: 'hash', role: 'MEMBER' });
    const result = await service.register({ name: 'Test', email: 'test@mail.com', password: 'Password123*' });
    expect(result.accessToken).toBe('token');
    expect(result.user).not.toHaveProperty('password');
  });

  it('login rejects invalid credentials', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    await expect(service.login({ email: 'missing@mail.com', password: 'x' })).rejects.toThrow('Invalid credentials');
  });
});

