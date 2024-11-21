// category.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body, Patch
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { Category } from './category.entity';
import { CategoryDto } from '../utils/dto/category.dto';
import { CreateCategoryDto } from './dto/CreateCategoryDto.dto';
import { UpdateCategoryDto } from './dto/UpdateCategoryDto.dto';
import { Error400, Error404 } from '../utils/dto/response.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, type: [CategoryDto] })
  findAll(): Promise<CategoryDto[]> {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a category by id' })
  @ApiResponse({ status: 200, type: CategoryDto })
  @ApiResponse({ status: 404, description: 'Error: Not Found', type: Error404 })
  findOne(@Param('id') id: number): Promise<CategoryDto> {
    return this.categoryService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ status: 201, type: CategoryDto })
  @ApiResponse({ status: 404, description: 'Error: Not Found', type: Error404 })
  create(@Body() categoryData: CreateCategoryDto): Promise<CategoryDto> {
    return this.categoryService.create(categoryData);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a category' })
  @ApiResponse({ status: 200, type: CategoryDto })
  @ApiResponse({ status: 404, description: 'Error: Not Found', type: Error404 })
  update(
    @Param('id') id: number,
    @Body() updateData: UpdateCategoryDto,
  ): Promise<CategoryDto> {
    return this.categoryService.update(id, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category' })
  @ApiResponse({ status: 200 })
  delete(@Param('id') id: number): Promise<void> {
    return this.categoryService.delete(id);
  }
}
