import { Module } from '@nestjs/common';
import { NotificationsModule } from '../notifications/notifications.module';
import { TeamsModule } from '../teams/teams.module';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

@Module({ imports: [TeamsModule, NotificationsModule], controllers: [ProjectsController], providers: [ProjectsService], exports: [ProjectsService] })
export class ProjectsModule {}
