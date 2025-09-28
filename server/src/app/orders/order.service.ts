import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserService } from '../users/user.service';
import { ProductService } from '../products/product.service';
import { Cache } from '@nestjs/cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

type Order = ({
  orderItems: ({
    product: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      name: string;
      description: string | null;
      price: number;
    };
  } & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    orderId: string;
    productId: string;
    quantity: number;
  })[];
} & {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
})[];

interface PaginatedOrders {
  data: Order[];
  total: number;
  page: number;
  pageSize: number;
}

@Injectable()
export class OrderService {
  constructor(
    private prismaService: PrismaService,
    private userService: UserService,
    private productService: ProductService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getOrders(
    userId: string,
    page: number,
    pageSize: number,
    search: string,
  ): Promise<PaginatedOrders> {
    const cacheKey = `orders:${userId}:${page}:${pageSize}:${search}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as PaginatedOrders;
    }

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
      total: total,
      page: page,
      pageSize: pageSize,
    };
  }

  async createOrder(data: {
    userId: string;
    products: { productId: string; quantity: number }[];
  }) {
    const { userId, products } = data;

    const userExists = await this.userService.validateUserId(userId);
    if (!userExists) {
      return { status: false, error: 'user id is invalid' };
    }

    for (const product of products) {
      const productExists = await this.productService.validateProductId(
        product.productId,
      );
      if (!productExists) {
        return {
          status: false,
          error: `product id is invalid: ${product.productId}`,
        };
      }
      if (!product.quantity || product.quantity < 1) {
        return {
          status: false,
          error: 'quantity must be 1 or more for every product',
        };
      }
    }

    const order = await this.prismaService.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          orderItems: {
            create: products.map((p) => ({
              productId: p.productId,
              quantity: p.quantity,
            })),
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
