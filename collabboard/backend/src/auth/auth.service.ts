import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { hashPassword, verifyPassword } from '../common/password';
import { LoginDto, RegisterDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  sanitize(user: { password?: string; [key: string]: unknown }) {
    const { password: _password, ...safe } = user;
    return safe;
  }

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } });
    if (exists) throw new ConflictException('Email already registered');

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email.toLowerCase(),
        password: await hashPassword(dto.password),
        avatarUrl: dto.avatarUrl,
      },
    });
    return this.withToken(user);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } });
    if (!user || !(await verifyPassword(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.withToken(user);
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    return this.sanitize(user);
  }

  private withToken(user: { id: string; email: string; role: 'ADMIN' | 'MEMBER'; password: string; [key: string]: unknown }) {
    const accessToken = this.jwt.sign({ sub: user.id, email: user.email, role: user.role });
    return { accessToken, user: this.sanitize(user) };
  }
}

