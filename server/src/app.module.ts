import { Module } from '@nestjs/common';
import { OrderModule } from './app/orders/order.module';
import { UserModule } from './app/users/user.module';
import { ProductModule } from './app/products/product.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => ({
        store: redisStore,
        socket: { host: 'localhost', port: 6379 },
        ttl: 30,
      }),
    }),
    OrderModule,
    UserModule,
    ProductModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
