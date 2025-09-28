import { Module } from '@nestjs/common';
import { OrderModule } from './app/orders/order.module';
import { UserModule } from './app/users/user.module';
import { ProductModule } from './app/products/product.module';

@Module({
  imports: [OrderModule, UserModule, ProductModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
