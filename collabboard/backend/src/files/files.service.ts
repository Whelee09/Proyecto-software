import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
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
  private supabase: SupabaseClient;
  private readonly bucket = 'collabboard-files'; // Cambia esto por el nombre de tu bucket en Supabase

  constructor(private readonly prisma: PrismaService, private readonly projects: ProjectsService, private readonly config: ConfigService) {
    const supabaseUrl = this.config.get<string>('SUPABASE_URL');
    const supabaseKey = this.config.get<string>('SUPABASE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      console.warn('SUPABASE_URL or SUPABASE_KEY is missing. File uploads to Supabase will fail.');
    }
    
    this.supabase = createClient(supabaseUrl || '', supabaseKey || '');
  }

  async save(projectId: string, file: Express.Multer.File, user: AuthUser) {
    await this.projects.ensureProjectMember(projectId, user);
    const maxSize = Number(this.config.get('MAX_FILE_SIZE_MB') ?? 10) * 1024 * 1024;
    const ext = file.originalname.slice(file.originalname.lastIndexOf('.')).toLowerCase();
    if (file.size > maxSize) throw new BadRequestException('File exceeds 10MB');
    if (!ALLOWED_MIME.has(file.mimetype) || !ALLOWED_EXT.has(ext)) throw new BadRequestException('File type not allowed');
    
    const storedName = `${randomUUID()}${ext}`;
    const filePath = `${projectId}/${storedName}`;

    const { data, error } = await this.supabase.storage
      .from(this.bucket)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      throw new InternalServerErrorException('Failed to upload file to storage');
    }

    return this.prisma.file.create({ 
      data: { 
        projectId, 
        uploadedById: user.id, 
        originalName: file.originalname, 
        storedName, 
        path: filePath, 
        mimeType: file.mimetype, 
        size: file.size 
      } 
    });
  }
  
  async byProject(projectId: string, user: AuthUser) {
    await this.projects.ensureProjectMember(projectId, user);
    return this.prisma.file.findMany({ where: { projectId }, include: { uploadedBy: { select: { id: true, name: true } } }, orderBy: { createdAt: 'desc' } });
  }
  
  async getDownloadUrl(id: string, user: AuthUser) {
    const file = await this.prisma.file.findUniqueOrThrow({ where: { id } });
    await this.projects.ensureProjectMember(file.projectId, user);
    
    const { data, error } = await this.supabase.storage
      .from(this.bucket)
      .createSignedUrl(file.path, 60); // URL válida por 60 segundos

    if (error) {
       console.error('Supabase download error:', error);
       throw new InternalServerErrorException('Failed to generate download url');
    }

    return { url: data.signedUrl, originalName: file.originalName };
  }
  
  async remove(id: string, user: AuthUser) {
    const file = await this.prisma.file.findUniqueOrThrow({ where: { id } });
    await this.projects.ensureProjectMember(file.projectId, user);
    
    const { error } = await this.supabase.storage
      .from(this.bucket)
      .remove([file.path]);

    if (error) {
       console.error('Supabase delete error:', error);
       // Continuamos eliminando de la base de datos de todos modos
    }

    await this.prisma.file.delete({ where: { id } });
    return { deleted: true };
  }
}

