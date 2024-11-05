import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../product/product.entity';
import { ProductWarehouseService } from './product-warehouse.service';
import { ProductWarehouseController } from './product-warehouse.controller';
import { ProductWarehouse } from './producto-warehouse.entity';
import { Warehouse } from '../warehouse/warehouse.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductWarehouse, Product, Warehouse])],
  providers: [ProductWarehouseService],
  controllers: [ProductWarehouseController],
})
export class ProductWarehouseModule {}
