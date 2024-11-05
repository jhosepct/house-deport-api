import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ProductWarehouseService } from "./product-warehouse.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ProductWarehouseDto } from "../utils/dto/ProductWarehouseDto";
import { CreateProductWarehouseDto } from "./dto/CreateProductWarehouseDto";
import { Error404 } from "../utils/dto/response.dto";

@ApiTags('Product Warehouse')
@Controller('product-warehouse')
export class ProductWarehouseController {
  constructor(private readonly productWarehouseService: ProductWarehouseService) {
  }

  @Get()
  @ApiOperation({ summary: 'Get all products in warehouse' })
  @ApiResponse({ status: 200, type: [ProductWarehouseDto] })
  findAll(): Promise<ProductWarehouseDto[]> {
    return this.productWarehouseService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by id' })
  @ApiResponse({ status: 200, type: ProductWarehouseDto })
  findOne(@Param('id') id: number): Promise<ProductWarehouseDto> {
    return this.productWarehouseService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, type: ProductWarehouseDto })
  @ApiResponse({ status: 404, description: 'Error: Not Found', type: Error404 })
  create(@Body() productWarehouseData: CreateProductWarehouseDto): Promise<ProductWarehouseDto> {
    return this.productWarehouseService.create(productWarehouseData);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({ status: 200, description: 'Product updated', type: ProductWarehouseDto })
  update(@Param('id') id: number, @Body() updateData: Partial<ProductWarehouseDto>): Promise<ProductWarehouseDto> {
    return this.productWarehouseService.update(id, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({ status: 200, description: 'Product deleted' })
  delete(@Param('id') id: number): Promise<void> {
    return this.productWarehouseService.delete(id);
  }

}
