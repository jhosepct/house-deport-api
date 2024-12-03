import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderDetail } from "./order-detail.entity";
import { Order } from "./order.entity";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { Product } from "../product/product.entity";
import { Client } from "../client/client.entity";
import { User } from "../user/user.entity";
import { ProductWarehouse } from "../product-warehouse/producto-warehouse.entity";
import { Invoice } from "./invoice.entity";

@Module({
  imports: [TypeOrmModule.forFeature([OrderDetail, Order, Product, Client, User, ProductWarehouse, Invoice])],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
