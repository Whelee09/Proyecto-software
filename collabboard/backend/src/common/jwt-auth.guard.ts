import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUser } from './current-user.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly supabase: SupabaseClient;

  constructor(
    config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.supabase = createClient(
      config.getOrThrow<string>('SUPABASE_URL'),
      config.getOrThrow<string>('SUPABASE_KEY'),
      { auth: { autoRefreshToken: false, persistSession: false } },
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{ headers: { authorization?: string }; user: AuthUser }>();
    const token = request.headers.authorization?.replace('Bearer ', '');
    if (!token) throw new UnauthorizedException();

    const { data: { user: sbUser }, error } = await this.supabase.auth.getUser(token);
    if (error || !sbUser) throw new UnauthorizedException();

    let user = await this.prisma.user.findUnique({ where: { supabaseId: sbUser.id } });
    if (!user) {
      const existing = await this.prisma.user.findUnique({ where: { email: sbUser.email! } });
      if (existing) {
        user = await this.prisma.user.update({ where: { id: existing.id }, data: { supabaseId: sbUser.id } });
      } else {
        const meta = sbUser.user_metadata as { name?: string; full_name?: string } | undefined;
        const name = meta?.full_name ?? meta?.name ?? sbUser.email!.split('@')[0];
        user = await this.prisma.user.create({ data: { supabaseId: sbUser.id, email: sbUser.email!, name } });
      }
    }

    request.user = { id: user.id, email: user.email, role: user.role };
    return true;
  }
}
