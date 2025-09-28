import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  const user1 = await prisma.user.create({
    data: {
      email: 'bhaskar@cygen.com',
      name: 'Bhaskar Khoraja',
    },
  });

  const product1 = await prisma.product.create({
    data: {
      name: 'Orange',
      description: 'Orange from Asia',
      price: 10.0,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'Capsicum',
      description: 'Authentic Capsicum',
      price: 5.0,
    },
  });

  const order = await prisma.order.create({
    data: {
      userId: user1.id,
      orderItems: {
        create: [
          {
            productId: product1.id,
            quantity: 1,
          },
          {
            productId: product2.id,
            quantity: 2,
          },
        ],
      },
    },
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
