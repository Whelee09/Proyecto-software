import { ProjectStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  teamId!: string;
  @IsString()
  @MinLength(2)
  name!: string;
  @IsOptional()
  @IsString()
  description?: string;
}
export class UpdateProjectDto {
  @IsOptional() @IsString() @MinLength(2) name?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsEnum(ProjectStatus) status?: ProjectStatus;
}

