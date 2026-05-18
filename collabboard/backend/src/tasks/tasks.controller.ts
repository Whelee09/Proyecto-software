import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUser, CurrentUser } from '../common/current-user.decorator';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { CreateCommentDto, CreateTaskDto, UpdateTaskDto } from './dto';
import { TasksService } from './tasks.service';

@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasks: TasksService) {}
  @Post() create(@Body() dto: CreateTaskDto, @CurrentUser() user: AuthUser) { return this.tasks.create(dto, user); }
  @Get('project/:projectId') byProject(@Param('projectId') projectId: string, @CurrentUser() user: AuthUser) { return this.tasks.byProject(projectId, user); }
  @Get(':id') findOne(@Param('id') id: string, @CurrentUser() user: AuthUser) { return this.tasks.findOne(id, user); }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateTaskDto, @CurrentUser() user: AuthUser) { return this.tasks.update(id, dto, user); }
  @Delete(':id') remove(@Param('id') id: string, @CurrentUser() user: AuthUser) { return this.tasks.remove(id, user); }
  @Post(':id/comments') addComment(@Param('id') id: string, @Body() dto: CreateCommentDto, @CurrentUser() user: AuthUser) { return this.tasks.addComment(id, dto, user); }
  @Get(':id/comments') comments(@Param('id') id: string, @CurrentUser() user: AuthUser) { return this.tasks.comments(id, user); }
}

