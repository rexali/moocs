import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient().$extends({

    model: {
        user: {
            async sign_up(email: any, name: any) {
                return prisma.user.create({
                    data: {
                        email: email,
                        name: name
                    }
                }).catch(e => {
                    throw e;
                }).finally(async () => {
                    await prisma.$disconnect()
                });
            }
        }
    }
});

export default prisma.user.sign_up;

