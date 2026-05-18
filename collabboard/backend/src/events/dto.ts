import { EventType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateEventDto {
  @IsString() teamId!: string;
  @IsOptional() @IsString() projectId?: string;
  @IsString() @MinLength(2) title!: string;
  @IsOptional() @IsString() description?: string;
  @Type(() => Date) @IsDate() startDate!: Date;
  @Type(() => Date) @IsDate() endDate!: Date;
  @IsEnum(EventType) type!: EventType;
}
export class UpdateEventDto {
  @IsOptional() @IsString() @MinLength(2) title?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @Type(() => Date) @IsDate() startDate?: Date;
  @IsOptional() @Type(() => Date) @IsDate() endDate?: Date;
  @IsOptional() @IsEnum(EventType) type?: EventType;
}

