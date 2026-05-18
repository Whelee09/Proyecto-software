import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUser, CurrentUser } from '../common/current-user.decorator';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { CreateProjectDto, UpdateProjectDto } from './dto';
import { ProjectsService } from './projects.service';

@ApiTags('projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projects: ProjectsService) {}
  @Post() create(@Body() dto: CreateProjectDto, @CurrentUser() user: AuthUser) { return this.projects.create(dto, user); }
  @Get('team/:teamId') byTeam(@Param('teamId') teamId: string, @CurrentUser() user: AuthUser) { return this.projects.byTeam(teamId, user); }
  @Get(':id') findOne(@Param('id') id: string, @CurrentUser() user: AuthUser) { return this.projects.findOne(id, user); }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateProjectDto, @CurrentUser() user: AuthUser) { return this.projects.update(id, dto, user); }
  @Delete(':id') remove(@Param('id') id: string, @CurrentUser() user: AuthUser) { return this.projects.remove(id, user); }
}

