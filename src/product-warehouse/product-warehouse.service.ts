import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductWarehouse } from './producto-warehouse.entity';
import { Repository } from 'typeorm';
import { Product } from '../product/product.entity';
import { Warehouse } from '../warehouse/warehouse.entity';
import { ProductWarehouseDto } from '../utils/dto/ProductWarehouseDto';
import { CreateProductWarehouseDto } from './dto/CreateProductWarehouseDto';

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

  async findAll(): Promise<ProductWarehouseDto[]> {
    return (await this.productWarehouseRepository.find()).map(
      (productWarehouse) => productWarehouse.ToJSON(),
    );
  }

  async findOne(id: number): Promise<ProductWarehouseDto> {
    const productWarehouse = await this.productWarehouseRepository.findOne({
      where: { id },
    });
    if (!productWarehouse)
      throw new HttpException('Product Warehouse not found', 404);
    return (
      await this.productWarehouseRepository.findOne({ where: { id } })
    ).ToJSON();
  }

  async create(
    productWarehouseData: CreateProductWarehouseDto,
  ): Promise<ProductWarehouseDto> {
    const product = await this.productRepository.findOne({
      where: { id: productWarehouseData.productId },
    });
    if (!product) throw new HttpException('Product not found', 404);

    const warehouse = await this.warehouseRepository.findOne({
      where: { id: productWarehouseData.warehouseId },
    });
    if (!warehouse) throw new HttpException('Warehouse not found', 404);

    const productWarehouse = this.productWarehouseRepository.create({
      product,
      warehouse,
      row: productWarehouseData.row,
      column: productWarehouseData.column,
      quantity: productWarehouseData.quantity,
    });

    return (
      await this.productWarehouseRepository.save(productWarehouse)
    ).ToJSON();
  }

  async update(
    id: number,
    updateData: Partial<ProductWarehouseDto>,
  ): Promise<ProductWarehouseDto> {
    const productWarehouse = await this.productWarehouseRepository.findOne({
      where: { id },
    });
    if (!productWarehouse)
      throw new HttpException('Product Warehouse not found', 404);
    return (
      await this.productWarehouseRepository.save({ ...updateData, id })
    ).ToJSON();
  }

  async delete(id: number): Promise<void> {
    const result = await this.productWarehouseRepository.delete(id);
    if (result.affected === 0)
      throw new HttpException('Product Warehouse not found', 404);
  }
}
