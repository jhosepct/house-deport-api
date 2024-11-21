import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Warehouse } from './warehouse.entity';
import { Repository } from 'typeorm';
import { WarehouseDto } from '../utils/dto/warehouse.dto';
import { CreateWarehouseDto } from './dto/CreateWarehouseDto';
import { UpdateWarehouseDto } from './dto/UpdateWarehouseDto';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
  ) {}

  async findAll(): Promise<WarehouseDto[]> {
    return (
      await this.warehouseRepository.find({
        relations: ['productWarehouses.product'],
      })
    ).map((warehouse) => warehouse.ToJSON());
  }

  async findOne(id: number): Promise<WarehouseDto> {
    const warehouse = await this.warehouseRepository.findOne({
      where: { id },
      relations: ['productWarehouses.product'],
    });
    if (!warehouse) throw new HttpException('Warehouse not found', 404);

    return (await this.warehouseRepository.findOne({ where: { id } })).ToJSON();
  }

  async create(warehouseData: CreateWarehouseDto): Promise<WarehouseDto> {
    const newWarehouse = this.warehouseRepository.create(warehouseData);
    newWarehouse.spaces = warehouseData.columnMax * warehouseData.rowMax;
    await this.warehouseRepository.save(newWarehouse);
    return (
      await this.warehouseRepository.findOne({
        where: { id: newWarehouse.id },
        relations: ['productWarehouses.product'],
      })
    ).ToJSON();
  }

  async update(
    id: number,
    updateData: UpdateWarehouseDto,
  ): Promise<WarehouseDto> {
    const warehouse = await this.warehouseRepository.findOne({ where: { id } });
    if (!warehouse) throw new HttpException('Warehouse not found', 404);

    await this.warehouseRepository.save({ ...updateData, id });
    return (
      await this.warehouseRepository.findOne({
        where: { id },
        relations: ['productWarehouses.product'],
      })
    ).ToJSON();
  }

  async delete(id: number): Promise<void> {
    const result = await this.warehouseRepository.delete(id);
    if (result.affected === 0)
      throw new HttpException('Warehouse not found', 404);
  }
}
