// product.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDtoDto } from './dto/CreateProductDto.dto';
import { ProductDto } from '../utils/dto/product.dto';
import { Category } from '../category/category.entity';
import { Size } from '../size/size.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Size) private sizeRepository: Repository<Size>,
  ) {}

  async findAll(): Promise<ProductDto[]> {
    return (await this.productRepository.find({ relations: ['category', 'size'] })).map((product) => product.ToJSON());
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
    const newProduct = this.productRepository.create(productData);
    newProduct.category = category;
    newProduct.size = size;
    return (await this.productRepository.save(newProduct)).ToJSON();
  }

  async update(id: number, updateData: Partial<Product>): Promise<ProductDto> {
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
