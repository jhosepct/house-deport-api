// category.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CategoryDto } from '../utils/dto/category.dto';
import { CreateCategoryDtoDto } from './dto/CreateCategoryDto.dto';
import { UpdateCategoryDtoDto } from './dto/UpdateCategoryDto.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<CategoryDto[]> {
    return (await this.categoryRepository.find({ relations: ['sizes'] })).map(
      (category) => category.ToJSON(),
    );
  }

  async findOne(id: number): Promise<CategoryDto> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }
    return (
      await this.categoryRepository.findOne({
        where: { id },
        relations: ['sizes'],
      })
    ).ToJSON();
  }

  async create(categoryData: CreateCategoryDtoDto): Promise<CategoryDto> {
    const newCategory = this.categoryRepository.create(categoryData);
    return (await this.categoryRepository.save(newCategory)).ToJSON();
  }

  async update(
    id: number,
    updateData: UpdateCategoryDtoDto,
  ): Promise<CategoryDto> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    return (await this.categoryRepository.save({ ...updateData, id })).ToJSON();
  }

  async delete(id: number): Promise<void> {
    return this.categoryRepository.delete(id).then(() => undefined);
  }
}
