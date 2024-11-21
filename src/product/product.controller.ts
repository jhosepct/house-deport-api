// product.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { ProductDto } from '../utils/dto/product.dto';
import { CreateProductDtoDto } from './dto/CreateProductDto.dto';
import { Error404 } from '../utils/dto/response.dto';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, type: [ProductDto] })
  findAll(): Promise<ProductDto[]> {
    return this.productService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by id' })
  @ApiResponse({ status: 200, type: ProductDto })
  findOne(@Param('id') id: number): Promise<ProductDto> {
    return this.productService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, type: ProductDto })
  @ApiResponse({ status: 404, description: 'Error: Not Found', type: Error404 })
  create(@Body() productData: CreateProductDtoDto): Promise<ProductDto> {
    return this.productService.create(productData);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({ status: 200, description: 'Product updated', type: ProductDto })
  update(
    @Param('id') id: number,
    @Body() updateData: Partial<CreateProductDtoDto>,
  ): Promise<ProductDto> {
    return this.productService.update(id, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({ status: 200, description: 'Product deleted' })
  delete(@Param('id') id: number): Promise<void> {
    return this.productService.delete(id);
  }
}
