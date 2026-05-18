import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ProjectsModule } from '../projects/projects.module';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

@Module({ imports: [ProjectsModule, MulterModule.register({ dest: './uploads' })], controllers: [FilesController], providers: [FilesService] })
export class FilesModule {}

