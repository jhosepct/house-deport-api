import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { ProductWarehouseService } from "./product-warehouse.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateProductWarehouseDto } from "./dto/CreateProductWarehouseDto";
import { Error404 } from "../utils/dto/response.dto";
import { ProductWarehouse } from "./producto-warehouse.entity";
import { UpdateProductWarehouseDto } from "./dto/UpdateProductWarehouse.dto";


@ApiTags('Product Warehouse')
@Controller('product-warehouse')
export class ProductWarehouseController {
  constructor(private readonly productWarehouseService: ProductWarehouseService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products in warehouse' })
  @ApiResponse({ status: 200, type: [ProductWarehouse] })
  async findAll(): Promise<ProductWarehouse[]> {
    return this.productWarehouseService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product warehouse by id' })
  @ApiResponse({ status: 200, type: ProductWarehouse })
  @ApiResponse({ status: 404, description: 'Product Warehouse not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ProductWarehouse> {
    return this.productWarehouseService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product warehouse entry' })
  @ApiResponse({ status: 201, type: ProductWarehouse })
  @ApiResponse({ status: 404, description: 'Product or Warehouse not found' })
  async create(@Body() createDto: CreateProductWarehouseDto): Promise<ProductWarehouse> {
    return this.productWarehouseService.create(createDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a product warehouse entry' })
  @ApiResponse({ status: 200, type: ProductWarehouse })
  @ApiResponse({ status: 404, description: 'Product Warehouse not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateProductWarehouseDto,
  ): Promise<ProductWarehouse> {
    return this.productWarehouseService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product warehouse entry' })
  @ApiResponse({ status: 200, description: 'Successfully deleted' })
  @ApiResponse({ status: 404, description: 'Product Warehouse not found' })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.productWarehouseService.delete(id);
  }
}