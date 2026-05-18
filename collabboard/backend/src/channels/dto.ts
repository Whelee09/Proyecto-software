import { ChannelType } from '@prisma/client';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateChannelDto {
  @IsString() teamId!: string;
  @IsOptional() @IsString() projectId?: string;
  @IsString() @MinLength(2) name!: string;
  @IsEnum(ChannelType) type!: ChannelType;
}

