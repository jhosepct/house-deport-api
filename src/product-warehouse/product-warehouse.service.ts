import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductWarehouse } from './producto-warehouse.entity';
import { Repository } from 'typeorm';
import { Product } from '../product/product.entity';
import { Warehouse } from '../warehouse/warehouse.entity';
import { CreateProductWarehouseDto } from './dto/CreateProductWarehouseDto';
import { UpdateProductWarehouseDto } from './dto/UpdateProductWarehouse.dto';

@Injectable()
export class ProductWarehouseService {
  constructor(
    @InjectRepository(ProductWarehouse)
    private productWarehouseRepository: Repository<ProductWarehouse>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
  ) {}

  async findAll(): Promise<ProductWarehouse[]> {
    return this.productWarehouseRepository.find({
      relations: ['product', 'warehouse'],
    });
  }

  async findOne(id: number): Promise<ProductWarehouse> {
    const productWarehouse = await this.productWarehouseRepository.findOne({
      where: { id },
      relations: ['product', 'warehouse'],
    });

    if (!productWarehouse) {
      throw new HttpException('Product Warehouse not found', 404);
    }

    return productWarehouse;
  }

  async create(
    createDto: CreateProductWarehouseDto,
  ): Promise<ProductWarehouse> {
    const product = await this.productRepository.findOne({
      where: { id: createDto.productId },
    });
    if (!product) {
      throw new HttpException('Product not found', 404);
    }

    const warehouse = await this.warehouseRepository.findOne({
      where: { id: createDto.warehouseId },
    });
    if (!warehouse) {
      throw new HttpException('Warehouse not found', 404);
    }

    const newProductWarehouse = this.productWarehouseRepository.create({
      product,
      warehouse,
      row: createDto.row,
      column: createDto.column,
      quantity: createDto.quantity,
    });

    return this.productWarehouseRepository.save(newProductWarehouse);
  }

  async update(
    id: number,
    updateDto: UpdateProductWarehouseDto,
  ): Promise<ProductWarehouse> {
    const productWarehouse = await this.findOne(id);

    if (updateDto.warehouseId) {
      const warehouse = await this.warehouseRepository.findOne({
        where: { id: updateDto.warehouseId },
      });
      if (!warehouse) {
        throw new HttpException('Warehouse not found', 404);
      }
      productWarehouse.warehouse = warehouse;
    }

    Object.assign(productWarehouse, {
      row: updateDto.row ?? productWarehouse.row,
      column: updateDto.column ?? productWarehouse.column,
      quantity: updateDto.quantity ?? productWarehouse.quantity,
    });

    return this.productWarehouseRepository.save(productWarehouse);
  }

  async delete(id: number): Promise<void> {
    const productWarehouse = await this.productWarehouseRepository.findOne({
      where: { id },
      relations: ['product'],
    });

    if (!productWarehouse) {
      throw new HttpException('Product Warehouse not found', 404);
    }

    productWarehouse.product.stockInventory += productWarehouse.quantity;
    await this.productRepository.save(productWarehouse.product);

    await this.productWarehouseRepository.remove(productWarehouse);
  }
}
