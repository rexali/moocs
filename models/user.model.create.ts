import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createUser() {
  const user = prisma.user.create({
    data: {
      name: 'Manumin',
      email: 'al1rexal578@prisma.io',
    },
  }).catch(e => {
    throw e;
  }).finally(async () => {
    await prisma.$disconnect()
  });

  return user;
}

export {
  createUser
}
