import { Module } from '@nestjs/common';
import { ProjectsModule } from '../projects/projects.module';
import { TeamsModule } from '../teams/teams.module';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({ imports: [ProjectsModule, TeamsModule], controllers: [EventsController], providers: [EventsService] })
export class EventsModule {}

