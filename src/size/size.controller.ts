// size.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SizeService } from './size.service';
import { Size } from './size.entity';
import { CreateSizeDto } from "./dto/CreateSizeDto.dto";
import { SizeDto } from "../utils/dto/size.dto";

@ApiTags('Sizes')
@Controller('sizes')
export class SizeController {
  constructor(private readonly sizeService: SizeService) {}

  @Get()
  @ApiOperation({ summary: 'Get all sizes' })
  @ApiResponse({ status: 200, description: 'List of sizes', type: [SizeDto] })
  findAll(): Promise<SizeDto[]> {
    return this.sizeService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a size by id' })
  @ApiResponse({ status: 200, description: 'Size found', type: SizeDto })
  findOne(@Param('id') id: number): Promise<SizeDto> {
    return this.sizeService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new size' })
  @ApiResponse({ status: 201, type: SizeDto })
  create(@Body() sizeData: CreateSizeDto): Promise<SizeDto> {
    return this.sizeService.create(sizeData);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a size' })
  @ApiResponse({ status: 200, description: 'Size updated', type: SizeDto })
  update(@Param('id') id: number, @Body() updateData: Partial<Size>): Promise<SizeDto> {
    return this.sizeService.update(id, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a size' })
  @ApiResponse({ status: 200, description: 'Size deleted' })
  delete(@Param('id') id: number): Promise<void> {
    return this.sizeService.delete(id);
  }
}
