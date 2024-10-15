// size.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Size } from './size.entity';
import { CreateSizeDto } from './dto/CreateSizeDto.dto';
import { Category } from '../category/category.entity';
import { SizeDto } from '../utils/dto/size.dto';

@Injectable()
export class SizeService {
  constructor(
    @InjectRepository(Size)
    private sizeRepository: Repository<Size>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<SizeDto[]> {
    return (
      await this.sizeRepository.find({ relations: ['category', 'products'] })
    ).map((size) => size.ToJSON());
  }

  async findOne(id: number): Promise<SizeDto> {
    return (
      await this.sizeRepository.findOne({
        where: { id },
        relations: ['category', 'products'],
      })
    ).ToJSON();
  }

  async create(sizeData: CreateSizeDto): Promise<SizeDto> {
    const category = await this.categoryRepository.findOne({
      where: { id: sizeData.categoryId },
    });
    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }
    const size = this.sizeRepository.create();
    size.name = sizeData.name;
    size.category = category;
    return (await this.sizeRepository.save(size)).ToJSON();
  }

  async update(id: number, updateData: Partial<Size>): Promise<SizeDto> {
    return (await this.sizeRepository.save({ ...updateData, id })).ToJSON();
  }

  async delete(id: number): Promise<void> {
    return this.sizeRepository.delete(id).then(() => undefined);
  }
}
