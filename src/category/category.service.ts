// category.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Category } from './category.entity';
import { CategoryDto } from '../utils/dto/category.dto';
import { CreateCategoryDto } from './dto/CreateCategoryDto.dto';
import { UpdateCategoryDto } from './dto/UpdateCategoryDto.dto';
import { Size } from '../size/size.entity';
import { CategoryToSize } from './categorySize.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Size)
    private sizeRepository: Repository<Size>,
    @InjectRepository(CategoryToSize)
    private categorySizeRepository: Repository<CategoryToSize>,
  ) {}

  async findAll(): Promise<CategoryDto[]> {
    return (
      await this.categoryRepository.find({ relations: ['categorySizes.size'] })
    ).map((category) => category.ToJSON());
  }

  async findOne(id: number): Promise<CategoryDto> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }
    return (
      await this.categoryRepository.findOne({
        where: { id },
        relations: ['categorySizes.size'],
      })
    ).ToJSON();
  }

  async create(categoryData: CreateCategoryDto): Promise<CategoryDto> {
    const sizes = await this.sizeRepository.find({
      where: {
        id: In(categoryData.sizes.map((size) => size.sizeId)),
      },
    });

    if (sizes.length !== categoryData.sizes.length) {
      throw new HttpException('Size not found', HttpStatus.NOT_FOUND);
    }

    const newCategory = this.categoryRepository.create({
      name: categoryData.name,
    });

    const category = await this.categoryRepository.save(newCategory);

    const categorySizes = categoryData.sizes.map((sizeData) => {
      const size = sizes.find((w) => w.id === sizeData.sizeId);
      return this.categorySizeRepository.create({
        size,
        category,
      });
    });

    await this.categorySizeRepository.save(categorySizes);

    const result = await this.categoryRepository.findOne({
      where: { id: category.id },
      relations: ['categorySizes.size'],
    });
    console.log(result);
    return result.ToJSON();
  }

  async update(
    id: number,
    updateData: UpdateCategoryDto,
  ): Promise<CategoryDto> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    category.name = updateData.name;

    await this.categoryRepository.save(category);

    if (updateData.sizes) {
      const sizes = await this.sizeRepository.find({
        where: {
          id: In(updateData.sizes.map((size) => size.sizeId)),
        },
      });

      if (sizes.length !== updateData.sizes.length) {
        throw new HttpException('Size not found', HttpStatus.NOT_FOUND);
      }

      const categorySizes = updateData.sizes.map((sizeData) => {
        const size = sizes.find((w) => w.id === sizeData.sizeId);
        return this.categorySizeRepository.create({
          size,
          category,
        });
      });

      await this.categorySizeRepository.save(categorySizes);
    }

    return (
      await this.categoryRepository.findOne({
        where: { id },
        relations: ['categorySizes.size'],
      })
    ).ToJSON();
  }

  async delete(id: number): Promise<void> {
    const result = await this.categoryRepository.delete(id);
    if (result.affected === 0) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }
  }
}
