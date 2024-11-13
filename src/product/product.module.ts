import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Category } from '../category/category.entity';
import { Size } from '../size/size.entity';
import { Warehouse } from "../warehouse/warehouse.entity";
import { ProductWarehouse } from "../product-warehouse/producto-warehouse.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, Size, Warehouse, ProductWarehouse])],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
