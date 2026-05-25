import { Controller, Delete, Get, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { Response } from 'express';
import { AuthUser, CurrentUser } from '../common/current-user.decorator';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { FilesService } from './files.service';

@ApiTags('files')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('files')
export class FilesController {
  constructor(private readonly files: FilesService) {}
  @Post('upload/:projectId')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }))
  upload(@Param('projectId') projectId: string, @UploadedFile() file: Express.Multer.File, @CurrentUser() user: AuthUser) { return this.files.save(projectId, file, user); }
  @Get('project/:projectId') byProject(@Param('projectId') projectId: string, @CurrentUser() user: AuthUser) { return this.files.byProject(projectId, user); }
  @Get('download/:id') async download(@Param('id') id: string, @CurrentUser() user: AuthUser, @Res() res: Response) {
    const { url } = await this.files.getDownloadUrl(id, user);
    return res.redirect(url);
  }
  @Delete(':id') remove(@Param('id') id: string, @CurrentUser() user: AuthUser) { return this.files.remove(id, user); }
}

