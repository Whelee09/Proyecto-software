import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUser } from '../common/current-user.decorator';

type SupabaseJwtPayload = {
  sub: string;
  email: string;
  role: string;
  user_metadata?: { name?: string; full_name?: string };
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('SUPABASE_JWT_SECRET') ?? config.get<string>('JWT_SECRET') ?? 'dev-secret',
    });
  }

  async validate(payload: SupabaseJwtPayload): Promise<AuthUser> {
    let user = await this.prisma.user.findUnique({ where: { supabaseId: payload.sub } });

    if (!user) {
      // Link existing email/password user or create new one on first OAuth login
      const existing = await this.prisma.user.findUnique({ where: { email: payload.email } });
      if (existing) {
        user = await this.prisma.user.update({ where: { id: existing.id }, data: { supabaseId: payload.sub } });
      } else {
        const name = payload.user_metadata?.full_name ?? payload.user_metadata?.name ?? payload.email.split('@')[0];
        user = await this.prisma.user.create({
          data: { supabaseId: payload.sub, email: payload.email, name },
        });
      }
    }

    if (!user) throw new UnauthorizedException();
    return { id: user.id, email: user.email, role: user.role };
  }
}
