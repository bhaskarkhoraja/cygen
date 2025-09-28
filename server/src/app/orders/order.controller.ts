import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { UserService } from '../users/user.service';

function isValidUUID(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(uuid);
}

@Controller()
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly userService: UserService,
  ) {}

  @Get('/orders')
  async getOrders(
    @Query('userId') userId?: string,
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '5',
    @Query('search') search = '',
  ) {
    if (!userId) {
      return { status: false, error: 'User id is required' };
    }

    if (!isValidUUID(userId)) {
      return { status: false, error: 'User id is invalid' };
    }

    const isUserValid = await this.userService.validateUserId(userId);

    if (!isUserValid) {
      return { status: false, error: 'User id is invalid' };
    }

    const result = await this.orderService.getOrders(
      userId,
      parseInt(page),
      parseInt(pageSize),
      search,
    );

    return {
      status: true,
      data: result.data,
      pagination: {
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
        nextPage:
          result.page * result.pageSize < result.total ? result.page + 1 : null,
        prevPage: result.page > 1 ? result.page - 1 : null,
      },
    };
  }

  @Post('/orders')
  async createOrder(
    @Body()
    body: {
      userId: string;
      data: { productId: string; quantity: number }[];
    },
  ) {
    const { userId, data: products } = body;

    if (!userId) {
      return { status: false, error: 'user id is required' };
    }

    products.forEach((product) => {
      if (!product.productId) {
        return { status: false, error: 'product id is required' };
      }

      if (!isValidUUID(product.productId)) {
        return { status: false, error: 'Product id is invalid' };
      }
    });

    if (!isValidUUID(userId)) {
      return { status: false, error: 'User id is invalid' };
    }

    return this.orderService.createOrder({ userId, products });
  }
}
