import { PrismaClient, GlobalRole, TeamRole, TaskPriority, TaskStatus, EventType } from '@prisma/client';
import { hashPassword } from '../src/common/password';

const prisma = new PrismaClient();

async function main() {
  await prisma.message.deleteMany();
  await prisma.channel.deleteMany();
  await prisma.file.deleteMany();
  await prisma.taskComment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.event.deleteMany();
  await prisma.project.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.team.deleteMany();
  await prisma.user.deleteMany();

  const password = await hashPassword('Admin123*');
  const admin = await prisma.user.create({ data: { name: 'Admin CollabBoard', email: 'admin@collabboard.com', password, role: GlobalRole.ADMIN } });
  const ana = await prisma.user.create({ data: { name: 'Ana Torres', email: 'ana@collabboard.com', password: await hashPassword('Member123*') } });
  const luis = await prisma.user.create({ data: { name: 'Luis Rojas', email: 'luis@collabboard.com', password: await hashPassword('Member123*') } });
  const maria = await prisma.user.create({ data: { name: 'Maria Gomez', email: 'maria@collabboard.com', password: await hashPassword('Member123*') } });

  const product = await prisma.team.create({ data: { name: 'Producto', description: 'Equipo de producto y desarrollo', ownerId: admin.id } });
  const ops = await prisma.team.create({ data: { name: 'Operaciones', description: 'Equipo de coordinacion operativa', ownerId: ana.id } });
  await prisma.teamMember.createMany({
    data: [
      { teamId: product.id, userId: admin.id, role: TeamRole.OWNER },
      { teamId: product.id, userId: ana.id, role: TeamRole.MANAGER },
      { teamId: product.id, userId: luis.id, role: TeamRole.MEMBER },
      { teamId: ops.id, userId: ana.id, role: TeamRole.OWNER },
      { teamId: ops.id, userId: maria.id, role: TeamRole.MEMBER },
    ],
  });

  const web = await prisma.project.create({ data: { teamId: product.id, name: 'Portal Web', description: 'Nueva experiencia de clientes' } });
  const mobile = await prisma.project.create({ data: { teamId: product.id, name: 'App Movil', description: 'MVP mobile', status: 'PAUSED' } });
  const onboarding = await prisma.project.create({ data: { teamId: ops.id, name: 'Onboarding', description: 'Proceso de ingreso de clientes' } });

  await prisma.task.createMany({
    data: [
      { projectId: web.id, title: 'Disenar tablero Kanban', status: TaskStatus.IN_PROGRESS, priority: TaskPriority.HIGH, labels: ['frontend'], createdById: admin.id, assignedToId: ana.id, dueDate: new Date(Date.now() + 86400000 * 3) },
      { projectId: web.id, title: 'Configurar autenticacion JWT', status: TaskStatus.COMPLETED, priority: TaskPriority.URGENT, labels: ['backend', 'security'], createdById: admin.id, assignedToId: luis.id },
      { projectId: mobile.id, title: 'Definir alcance MVP', status: TaskStatus.PENDING, priority: TaskPriority.MEDIUM, labels: ['planning'], createdById: ana.id },
      { projectId: onboarding.id, title: 'Mapa del proceso actual', status: TaskStatus.PENDING, priority: TaskPriority.LOW, labels: ['ops'], createdById: ana.id, assignedToId: maria.id },
    ],
  });

  await prisma.event.createMany({
    data: [
      { teamId: product.id, projectId: web.id, createdById: admin.id, title: 'Sprint planning', description: 'Planeacion semanal', startDate: new Date(Date.now() + 86400000), endDate: new Date(Date.now() + 86400000 + 3600000), type: EventType.MEETING },
      { teamId: product.id, projectId: web.id, createdById: ana.id, title: 'Entrega prototipo', startDate: new Date(Date.now() + 86400000 * 5), endDate: new Date(Date.now() + 86400000 * 5), type: EventType.DEADLINE },
      { teamId: ops.id, projectId: onboarding.id, createdById: ana.id, title: 'Revision de checklist', startDate: new Date(Date.now() + 86400000 * 2), endDate: new Date(Date.now() + 86400000 * 2 + 3600000), type: EventType.REMINDER },
    ],
  });

  const productChannel = await prisma.channel.create({ data: { teamId: product.id, name: 'General Producto', type: 'TEAM' } });
  const webChannel = await prisma.channel.create({ data: { teamId: product.id, projectId: web.id, name: 'Portal Web', type: 'PROJECT' } });
  await prisma.channel.create({ data: { teamId: ops.id, projectId: onboarding.id, name: 'Onboarding', type: 'PROJECT' } });

  await prisma.message.createMany({
    data: [
      { channelId: productChannel.id, userId: admin.id, content: 'Bienvenidos al equipo Producto.' },
      { channelId: productChannel.id, userId: ana.id, content: 'Hoy revisamos prioridades del sprint.' },
      { channelId: webChannel.id, userId: luis.id, content: 'El endpoint de auth ya esta listo para probar.' },
    ],
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

