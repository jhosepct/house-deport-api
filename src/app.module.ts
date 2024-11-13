import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from './config/configuration';
import { environments } from './config/environments';
import { ProductController } from './product/product.controller';
import { ProductModule } from './product/product.module';
import { ClientController } from './client/client.controller';
import { ClientService } from './client/client.service';
import { ClientModule } from './client/client.module';
import { OrderController } from './order/order.controller';
import { OrderService } from './order/order.service';
import { OrderModule } from './order/order.module';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { ProductWarehouseController } from './product-warehouse/product-warehouse.controller';
import { ProductWarehouseService } from './product-warehouse/product-warehouse.service';
import { ProductWarehouseModule } from './product-warehouse/product-warehouse.module';
import { CategoryService } from './category/category.service';
import { CategoryController } from './category/category.controller';
import { CategoryModule } from './category/category.module';
import * as Joi from 'joi';
import { User } from './user/user.entity';
import { Client } from './client/client.entity';
import { Order } from './order/order.entity';
import { OrderDetail } from './order/order-detail.entity';
import { HistoryProduct } from './product/history-producto.entity';
import { Product } from './product/product.entity';
import { Category } from './category/category.entity';
import { Size } from './size/size.entity';
import { ProductWarehouse } from './product-warehouse/producto-warehouse.entity';
import { Warehouse } from './warehouse/warehouse.entity';
import { AuthModule } from './auth/auth.module';
import { SizeController } from './size/size.controller';
import { SizeModule } from './size/size.module';
import { WarehouseController } from './warehouse/warehouse.controller';
import { WarehouseModule } from './warehouse/warehouse.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: environments[process.env.NODE_ENV] || '.env',
      load: [config],
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => ({
        type: 'postgres',
        url: configService.DATABASE_URL_LOCAL,
        dropSchema: true,
        entities: [
          User,
          Client,
          Order,
          OrderDetail,
          HistoryProduct,
          Product,
          Category,
          Size,
          ProductWarehouse,
          Warehouse,
        ],
        synchronize: true,
        logging: true,
      }),
    }),
    AuthModule,
    ProductModule,
    ClientModule,
    OrderModule,
    UserModule,
    SizeModule,
    ProductWarehouseModule,
    CategoryModule,
    SizeModule,
    WarehouseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
