import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { WarehouseService } from './warehouse.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WarehouseDto } from '../utils/dto/warehouse.dto';
import { CreateWarehouseDto } from "./dto/CreateWarehouseDto";
import { Error404 } from "../utils/dto/response.dto";

@Controller('warehouse')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products in warehouse' })
  @ApiResponse({ status: 200, type: [WarehouseDto] })
  findAll(): Promise<WarehouseDto[]> {
    return this.warehouseService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by id' })
  @ApiResponse({ status: 200, type: WarehouseDto })
  findOne(@Param('id') id: number): Promise<WarehouseDto> {
    return this.warehouseService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, type: WarehouseDto })
  @ApiResponse({ status: 404, description: 'Error: Not Found', type: Error404 })
  create(@Body() warehouseData: CreateWarehouseDto): Promise<WarehouseDto> {
    return this.warehouseService.create(warehouseData);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({ status: 200, description: 'Product updated', type: WarehouseDto })
  update(
    @Param('id') id: number,
    @Body() updateData: Partial<WarehouseDto>,
  ): Promise<WarehouseDto> {
    return this.warehouseService.update(id, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({ status: 200, description: 'Product deleted' })
  delete(@Param('id') id: number): Promise<void> {
    return this.warehouseService.delete(id);
  }

}
