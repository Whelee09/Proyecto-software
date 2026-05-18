import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUser, CurrentUser } from '../common/current-user.decorator';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { AddMemberDto, CreateTeamDto, UpdateTeamDto } from './dto';
import { TeamsService } from './teams.service';

@ApiTags('teams')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('teams')
export class TeamsController {
  constructor(private readonly teams: TeamsService) {}
  @Post() create(@Body() dto: CreateTeamDto, @CurrentUser() user: AuthUser) { return this.teams.create(dto, user); }
  @Get() findAll(@CurrentUser() user: AuthUser) { return this.teams.findAll(user); }
  @Get(':id') findOne(@Param('id') id: string, @CurrentUser() user: AuthUser) { return this.teams.findOne(id, user); }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateTeamDto, @CurrentUser() user: AuthUser) { return this.teams.update(id, dto, user); }
  @Delete(':id') remove(@Param('id') id: string, @CurrentUser() user: AuthUser) { return this.teams.remove(id, user); }
  @Post(':id/members') addMember(@Param('id') id: string, @Body() dto: AddMemberDto, @CurrentUser() user: AuthUser) { return this.teams.addMember(id, dto, user); }
  @Delete(':id/members/:userId') removeMember(@Param('id') id: string, @Param('userId') userId: string, @CurrentUser() user: AuthUser) { return this.teams.removeMember(id, userId, user); }
}

