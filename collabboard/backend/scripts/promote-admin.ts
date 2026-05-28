import { PrismaClient, GlobalRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  if (!email) {
    console.error('Error: define la variable ADMIN_EMAIL');
    process.exit(1);
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error(`Error: no existe ningún usuario con email "${email}"`);
    console.error('El usuario debe haberse registrado primero en la app.');
    process.exit(1);
  }

  if (user.role === GlobalRole.ADMIN) {
    console.log(`"${email}" ya es ADMIN, no se hizo ningún cambio.`);
    return;
  }

  await prisma.user.update({ where: { email }, data: { role: GlobalRole.ADMIN } });
  console.log(`Listo: "${email}" ahora tiene rol ADMIN.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
