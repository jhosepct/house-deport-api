// product.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  findAll(): Promise<Product[]> {
    return this.productRepository.find({ relations: ['category', 'size'] });
  }

  findOne(id: number): Promise<Product> {
    return this.productRepository.findOne({ where: { id }, relations: ['category', 'size'] });
  }

  create(productData: Partial<Product>): Promise<Product> {
    const newProduct = this.productRepository.create(productData);
    return this.productRepository.save(newProduct);
  }

  update(id: number, updateData: Partial<Product>): Promise<Product> {
    return this.productRepository.save({ ...updateData, id });
  }

  delete(id: number): Promise<void> {
    return this.productRepository.delete(id).then(() => undefined);
  }
}
