import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async me(userId: string) {
    const { password: _p, ...user } = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    return user;
  }
}
