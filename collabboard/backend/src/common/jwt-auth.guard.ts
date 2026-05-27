import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUser } from './current-user.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly supabase?: SupabaseClient;
  private readonly demoAuthEnabled: boolean;

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.demoAuthEnabled = this.config.get<string>('DEMO_AUTH_ENABLED') === 'true';
    if (!this.demoAuthEnabled) {
      this.supabase = createClient(
        this.config.getOrThrow<string>('SUPABASE_URL'),
        this.config.getOrThrow<string>('SUPABASE_KEY'),
        { auth: { autoRefreshToken: false, persistSession: false } },
      );
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{ headers: { authorization?: string }; user: AuthUser }>();
    const token = request.headers.authorization?.replace('Bearer ', '');
    if (!token) throw new UnauthorizedException();

    if (this.demoAuthEnabled) {
      const demoToken = this.config.get<string>('DEMO_AUTH_TOKEN') ?? 'dev-demo-token';
      if (token !== demoToken) throw new UnauthorizedException();
      const demoEmail = this.config.get<string>('DEMO_USER_EMAIL') ?? 'admin@collabboard.com';
      const user = await this.prisma.user.findUnique({ where: { email: demoEmail } });
      if (!user) throw new UnauthorizedException();
      request.user = { id: user.id, email: user.email, role: user.role };
      return true;
    }

    if (!this.supabase) throw new UnauthorizedException();
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
