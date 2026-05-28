import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaClient, GlobalRole } from '@prisma/client';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.enableCors({
    origin: config.get<string>('FRONTEND_URL') ?? 'http://localhost:3000',
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('CollabBoard API')
    .setDescription('API para colaboracion de equipos, proyectos, tareas, calendario, chat y archivos.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, swaggerConfig));

  const port = process.env.PORT || config.get<number>('PORT') || 4000;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);

  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    const prisma = new PrismaClient();
    try {
      const user = await prisma.user.findUnique({ where: { email: adminEmail } });
      if (!user) {
        console.warn(`[promote-admin] No existe usuario con email "${adminEmail}". Debe registrarse primero.`);
      } else if (user.role !== GlobalRole.ADMIN) {
        await prisma.user.update({ where: { email: adminEmail }, data: { role: GlobalRole.ADMIN } });
        console.log(`[promote-admin] "${adminEmail}" promovido a ADMIN.`);
      }
    } finally {
      await prisma.$disconnect();
    }
  }
}

bootstrap();

