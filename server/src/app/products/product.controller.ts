import { Controller, Get } from '@nestjs/common';
import { ProductService as ProductService } from './product.service';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/products')
  async getProducts() {
    const result = await this.productService.getProducts();

    return result;
  }
}
