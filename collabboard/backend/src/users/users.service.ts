import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUser } from '../common/current-user.decorator';
import { UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private select = { id: true, name: true, email: true, avatarUrl: true, role: true, createdAt: true, updatedAt: true };

  findAll() {
    return this.prisma.user.findMany({ select: this.select, orderBy: { createdAt: 'desc' } });
  }

  findOne(id: string) {
    return this.prisma.user.findUniqueOrThrow({ where: { id }, select: this.select });
  }

  async update(id: string, dto: UpdateUserDto, current: AuthUser) {
    if (current.role !== 'ADMIN' && current.id !== id) throw new ForbiddenException('Cannot update this user');
    return this.prisma.user.update({ where: { id }, data: dto, select: this.select });
  }

  async remove(id: string) {
    await this.prisma.user.delete({ where: { id } });
    return { deleted: true };
  }
}

