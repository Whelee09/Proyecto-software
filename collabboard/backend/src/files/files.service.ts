import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { AuthUser } from '../common/current-user.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectsService } from '../projects/projects.service';

const ALLOWED_MIME = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/zip',
  'application/x-zip-compressed',
]);
const ALLOWED_EXT = new Set(['.pdf', '.jpg', '.jpeg', '.png', '.webp', '.doc', '.docx', '.xls', '.xlsx', '.zip']);

@Injectable()
export class FilesService {
  constructor(private readonly prisma: PrismaService, private readonly projects: ProjectsService, private readonly config: ConfigService) {}

  async save(projectId: string, file: Express.Multer.File, user: AuthUser) {
    await this.projects.ensureProjectMember(projectId, user);
    const maxSize = Number(this.config.get('MAX_FILE_SIZE_MB') ?? 10) * 1024 * 1024;
    const ext = file.originalname.slice(file.originalname.lastIndexOf('.')).toLowerCase();
    if (file.size > maxSize) throw new BadRequestException('File exceeds 10MB');
    if (!ALLOWED_MIME.has(file.mimetype) || !ALLOWED_EXT.has(ext)) throw new BadRequestException('File type not allowed');
    const root = this.config.get<string>('UPLOAD_DIR') ?? './uploads';
    const dir = join(root, projectId);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    const storedName = `${randomUUID()}${ext}`;
    const target = join(dir, storedName);
    // Multer writes the temp file first; controller storage keeps it in memory for this MVP.
    await import('fs/promises').then((fs) => fs.writeFile(target, file.buffer));
    return this.prisma.file.create({ data: { projectId, uploadedById: user.id, originalName: file.originalname, storedName, path: target, mimeType: file.mimetype, size: file.size } });
  }
  async byProject(projectId: string, user: AuthUser) {
    await this.projects.ensureProjectMember(projectId, user);
    return this.prisma.file.findMany({ where: { projectId }, include: { uploadedBy: { select: { id: true, name: true } } }, orderBy: { createdAt: 'desc' } });
  }
  async getDownload(id: string, user: AuthUser) {
    const file = await this.prisma.file.findUniqueOrThrow({ where: { id } });
    await this.projects.ensureProjectMember(file.projectId, user);
    return file;
  }
  async remove(id: string, user: AuthUser) {
    const file = await this.getDownload(id, user);
    await import('fs/promises').then((fs) => fs.unlink(file.path).catch(() => undefined));
    await this.prisma.file.delete({ where: { id } });
    return { deleted: true };
  }
}

