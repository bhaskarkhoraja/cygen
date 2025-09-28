import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaService } from 'src/prisma.service';
import { UserService } from '../users/user.service';
import { ProductService } from '../products/product.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService, PrismaService, UserService, ProductService],
})
export class OrderModule {}
