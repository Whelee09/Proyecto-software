import { Module } from '@nestjs/common';
import { TeamsModule } from '../teams/teams.module';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';

@Module({ imports: [TeamsModule], controllers: [ChannelsController], providers: [ChannelsService], exports: [ChannelsService] })
export class ChannelsModule {}

