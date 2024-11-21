// size.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Size } from './size.entity';
import { CreateSizeDto } from './dto/CreateSizeDto.dto';
import { Category } from '../category/category.entity';
import { SizeDto } from '../utils/dto/size.dto';
import { UpdateSizeDto } from "./dto/UpdateSizeDto.dto";

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
      await this.sizeRepository.find({ relations: ['products'] })
    ).map((size) => size.ToJSON());
  }

  async findOne(id: number): Promise<SizeDto> {
    return (
      await this.sizeRepository.findOne({
        where: { id },
        relations: ['products'],
      })
    ).ToJSON();
  }

  async create(sizeData: CreateSizeDto): Promise<SizeDto> {
    const existingSize = await this.sizeRepository.findOne({
      where: { name: sizeData.name },
    });
    if (existingSize)
      throw new HttpException('Size already exists', HttpStatus.BAD_REQUEST);

    const size = this.sizeRepository.create();
    size.name = sizeData.name;
    return (await this.sizeRepository.save(size)).ToJSON();
  }

  async update(id: number, updateData: UpdateSizeDto): Promise<SizeDto> {
    const size = await this.sizeRepository.findOne({ where: { id } });
    if (!size) throw new HttpException('Size not found', HttpStatus.NOT_FOUND);
    size.name = updateData.name;
    return (await this.sizeRepository.save(size)).ToJSON();
  }

  async delete(id: number): Promise<void> {
    return this.sizeRepository.delete(id).then(() => undefined);
  }
}
