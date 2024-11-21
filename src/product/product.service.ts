// product.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDtoDto } from './dto/CreateProductDto.dto';
import { ProductDto } from '../utils/dto/product.dto';
import { Category } from '../category/category.entity';
import { Size } from '../size/size.entity';
import { Warehouse } from '../warehouse/warehouse.entity';
import { ProductWarehouse } from '../product-warehouse/producto-warehouse.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Size) private sizeRepository: Repository<Size>,
    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
    @InjectRepository(ProductWarehouse)
    private productWarehouseRepository: Repository<ProductWarehouse>,
  ) {}

  async findAll(): Promise<ProductDto[]> {
    return (
      await this.productRepository.find({
        relations: [
          'category',
          'size',
          'productWarehouses',
          'productWarehouses.warehouse',
        ],
      })
    ).map((product) => product.ToJSON());
  }

  async findOne(id: number): Promise<ProductDto> {
    const product = this.productRepository.findOne({ where: { id } });
    if (!product)
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    return (
      await this.productRepository.findOne({
        where: { id },
        relations: ['category', 'size'],
      })
    ).ToJSON();
  }

  async create(productData: CreateProductDtoDto): Promise<ProductDto> {
    const category = await this.categoryRepository.findOne({
      where: { id: productData.categoryId },
    });
    if (!category)
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    const size = await this.sizeRepository.findOne({
      where: { id: productData.sizeId },
    });
    if (!size) throw new HttpException('Size not found', HttpStatus.NOT_FOUND);

    const warehouses = await this.warehouseRepository.find({
      where: {
        id: In(productData.location.map((location) => location.warehouseId)),
      },
    });

    // [1, 2, 3, 2] => [1, 2, 3]
    const warehouseIds = [
      ...new Set(productData.location.map((location) => location.warehouseId)),
    ];

    if (warehouses.length !== warehouseIds.length) {
      throw new HttpException('Warehouse not found', HttpStatus.NOT_FOUND);
    }

    const newProduct = this.productRepository.create(productData);
    newProduct.category = category;
    newProduct.size = size;
    newProduct.stockStore = productData.location.reduce(
      (acc, location) => acc + location.quantity,
      0,
    );
    const product = await this.productRepository.save(newProduct);

    const productWarehouse = productData.location.map((location) => {
      const warehouse = warehouses.find((w) => w.id === location.warehouseId);
      if (warehouse.spacesUsed >= warehouse.spaces) {
        throw new HttpException('Warehouse is full', HttpStatus.BAD_REQUEST);
      }
      warehouse.spacesUsed++;

      this.warehouseRepository.save(warehouse);

      return this.productWarehouseRepository.create({
        warehouse,
        row: location.row,
        column: location.column,
        quantity: location.quantity,
        product,
      });
    });

    await this.productWarehouseRepository.save(productWarehouse);

    return product.ToJSON();
  }

  async update(
    id: number,
    updateData: Partial<CreateProductDtoDto>,
  ): Promise<ProductDto> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product)
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    return (await this.productRepository.save({ ...updateData, id })).ToJSON();
  }

  async delete(id: number): Promise<void> {
    const result = await this.productRepository.delete(id);

    if (result.affected === 0) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
  }
}
