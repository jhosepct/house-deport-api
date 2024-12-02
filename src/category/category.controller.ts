// category.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body, Patch, UseGuards
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { Category } from './category.entity';
import { CategoryDto } from '../utils/dto/category.dto';
import { CreateCategoryDto } from './dto/CreateCategoryDto.dto';
import { UpdateCategoryDto } from './dto/UpdateCategoryDto.dto';
import { Error400, Error404 } from '../utils/dto/response.dto';
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../utils/decorador/roles.decorador";
import { Role } from "../utils/enum/roles.enum";

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, type: [CategoryDto] })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.All)
  findAll(): Promise<CategoryDto[]> {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a category by id' })
  @ApiResponse({ status: 200, type: CategoryDto })
  @ApiResponse({ status: 404, description: 'Error: Not Found', type: Error404 })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.All)
  findOne(@Param('id') id: number): Promise<CategoryDto> {
    return this.categoryService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ status: 201, type: CategoryDto })
  @ApiResponse({ status: 404, description: 'Error: Not Found', type: Error404 })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin || Role.Warehouse)
  create(@Body() categoryData: CreateCategoryDto): Promise<CategoryDto> {
    return this.categoryService.create(categoryData);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a category' })
  @ApiResponse({ status: 200, type: CategoryDto })
  @ApiResponse({ status: 404, description: 'Error: Not Found', type: Error404 })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin || Role.Warehouse)
  update(
    @Param('id') id: number,
    @Body() updateData: UpdateCategoryDto,
  ): Promise<CategoryDto> {
    return this.categoryService.update(id, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category' })
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin || Role.Warehouse)
  delete(@Param('id') id: number): Promise<void> {
    return this.categoryService.delete(id);
  }
}
