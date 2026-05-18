import { TaskPriority, TaskStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateTaskDto {
  @IsString() projectId!: string;
  @IsString() @MinLength(2) title!: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsEnum(TaskPriority) priority?: TaskPriority;
  @IsOptional() @IsArray() @IsString({ each: true }) labels?: string[];
  @IsOptional() @Type(() => Date) @IsDate() dueDate?: Date;
  @IsOptional() @IsString() assignedToId?: string;
}

export class UpdateTaskDto {
  @IsOptional() @IsString() @MinLength(2) title?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsEnum(TaskStatus) status?: TaskStatus;
  @IsOptional() @IsEnum(TaskPriority) priority?: TaskPriority;
  @IsOptional() @IsArray() @IsString({ each: true }) labels?: string[];
  @IsOptional() @Type(() => Date) @IsDate() dueDate?: Date;
  @IsOptional() @IsString() assignedToId?: string;
}

export class CreateCommentDto {
  @IsString() @MinLength(1) content!: string;
}

