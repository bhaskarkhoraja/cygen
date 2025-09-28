import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserService } from '../users/user.service';
import { ProductService } from '../products/product.service';

@Injectable()
export class OrderService {
  constructor(
    private prismaService: PrismaService,
    private userService: UserService,
    private productService: ProductService,
  ) {}

  async getOrders(
    userId: string,
    page: number,
    pageSize: number,
    search: string,
  ) {
    const skip = (page - 1) * pageSize;

    const whereCondition = {
      userId: userId,
      orderItems: {
        some: {
          product: {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
      },
    } as const;

    const [orders, total] = await Promise.all([
      this.prismaService.order.findMany({
        where: whereCondition,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          orderItems: {
            include: { product: true },
          },
        },
      }),
      this.prismaService.order.count({
        where: whereCondition,
      }),
    ]);

    return {
      data: orders,
      total,
      page,
      pageSize,
    };
  }

  async createOrder(data: {
    userId: string;
    productId: string;
    quantity: number;
  }) {
    const { userId, productId, quantity } = data;

    const userExists = await this.userService.validateUserId(userId);
    if (!userExists) {
      return { status: false, error: 'user id is invalid' };
    }

    const productExists =
      await this.productService.validateProductId(productId);
    if (!productExists) {
      return { status: false, error: 'product id is invalid' };
    }

    const order = await this.prismaService.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          orderItems: {
            create: {
              productId,
              quantity,
            },
          },
        },
        include: {
          orderItems: { include: { product: true } },
        },
      });
      return newOrder;
    });

    return { status: true, data: order };
  }
}
