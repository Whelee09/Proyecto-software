import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUser, CurrentUser } from '../common/current-user.decorator';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { CreateEventDto, UpdateEventDto } from './dto';
import { EventsService } from './events.service';

@ApiTags('events')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('events')
export class EventsController {
  constructor(private readonly events: EventsService) {}
  @Post() create(@Body() dto: CreateEventDto, @CurrentUser() user: AuthUser) { return this.events.create(dto, user); }
  @Get('me') mine(@CurrentUser() user: AuthUser) { return this.events.mine(user); }
  @Get('team/:teamId') byTeam(@Param('teamId') teamId: string, @CurrentUser() user: AuthUser) { return this.events.byTeam(teamId, user); }
  @Get('project/:projectId') byProject(@Param('projectId') projectId: string, @CurrentUser() user: AuthUser) { return this.events.byProject(projectId, user); }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateEventDto, @CurrentUser() user: AuthUser) { return this.events.update(id, dto, user); }
  @Delete(':id') remove(@Param('id') id: string, @CurrentUser() user: AuthUser) { return this.events.remove(id, user); }
}
