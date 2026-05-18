import { TeamRole } from '@prisma/client';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateTeamDto extends CreateTeamDto {
  @IsOptional()
  name!: string;
}

export class AddMemberDto {
  @IsEmail()
  email!: string;

  @IsEnum(TeamRole)
  role!: TeamRole;
}

