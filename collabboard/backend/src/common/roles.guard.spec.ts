import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';

const makeContext = (user: object | undefined): ExecutionContext =>
  ({
    getHandler: () => ({}),
    getClass: () => ({}),
    switchToHttp: () => ({ getRequest: () => ({ user }) }),
  }) as unknown as ExecutionContext;

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: jest.Mocked<Reflector>;

  beforeEach(() => {
    reflector = { getAllAndOverride: jest.fn() } as unknown as jest.Mocked<Reflector>;
    guard = new RolesGuard(reflector);
  });

  it('permite el acceso cuando no hay roles requeridos en la ruta', () => {
    reflector.getAllAndOverride.mockReturnValue(undefined);

    expect(guard.canActivate(makeContext({ id: 'u1', role: 'MEMBER' }))).toBe(true);
  });

  it('permite el acceso cuando el usuario tiene el rol requerido', () => {
    reflector.getAllAndOverride.mockReturnValue(['ADMIN']);

    expect(guard.canActivate(makeContext({ id: 'u1', role: 'ADMIN' }))).toBe(true);
  });

  it('deniega el acceso cuando el usuario no tiene el rol requerido', () => {
    reflector.getAllAndOverride.mockReturnValue(['ADMIN']);

    expect(guard.canActivate(makeContext({ id: 'u1', role: 'MEMBER' }))).toBe(false);
  });
});
