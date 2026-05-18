import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthUser } from '../common/current-user.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { TeamsService } from '../teams/teams.service';
import { CreateChannelDto } from './dto';

@Injectable()
export class ChannelsService {
  constructor(private readonly prisma: PrismaService, private readonly teams: TeamsService) {}
  async create(dto: CreateChannelDto, user: AuthUser) {
    await this.teams.ensureManager(dto.teamId, user);
    if (dto.type === 'PROJECT' && !dto.projectId) throw new BadRequestException('projectId required for project channels');
    return this.prisma.channel.create({ data: dto });
  }
  async byTeam(teamId: string, user: AuthUser) {
    await this.teams.ensureMember(teamId, user);
    return this.prisma.channel.findMany({ where: { teamId }, orderBy: { createdAt: 'desc' } });
  }
  async byProject(projectId: string, user: AuthUser) {
    const project = await this.prisma.project.findUniqueOrThrow({ where: { id: projectId } });
    await this.teams.ensureMember(project.teamId, user);
    return this.prisma.channel.findMany({ where: { projectId }, orderBy: { createdAt: 'desc' } });
  }
  async ensureChannelMember(channelId: string, user: AuthUser) {
    const channel = await this.prisma.channel.findUniqueOrThrow({ where: { id: channelId } });
    await this.teams.ensureMember(channel.teamId, user);
    return channel;
  }
}

