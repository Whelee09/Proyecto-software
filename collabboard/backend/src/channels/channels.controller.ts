import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUser, CurrentUser } from '../common/current-user.decorator';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto';

@ApiTags('channels')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('channels')
export class ChannelsController {
  constructor(private readonly channels: ChannelsService) {}
  @Post() create(@Body() dto: CreateChannelDto, @CurrentUser() user: AuthUser) { return this.channels.create(dto, user); }
  @Get('team/:teamId') byTeam(@Param('teamId') teamId: string, @CurrentUser() user: AuthUser) { return this.channels.byTeam(teamId, user); }
  @Get('project/:projectId') byProject(@Param('projectId') projectId: string, @CurrentUser() user: AuthUser) { return this.channels.byProject(projectId, user); }
}

