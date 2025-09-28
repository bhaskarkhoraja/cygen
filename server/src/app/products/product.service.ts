import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async validateProductId(productId: string): Promise<boolean> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });
    return !!product;
  }

  async getProducts() {
    const products = await this.prisma.product.findMany();
    return {
      status: true,
      data: products,
    };
  }
}
