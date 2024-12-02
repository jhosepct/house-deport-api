import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from "@nestjs/common";
import { WarehouseService } from './warehouse.service';
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { WarehouseDto } from '../utils/dto/warehouse.dto';
import { CreateWarehouseDto } from "./dto/CreateWarehouseDto";
import { Error404 } from "../utils/dto/response.dto";
import { UpdateWarehouseDto } from "./dto/UpdateWarehouseDto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../utils/decorador/roles.decorador";
import { Role } from "../utils/enum/roles.enum";

@ApiTags('Warehouse')
@Controller('warehouse')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products in warehouse' })
  @ApiResponse({ status: 200, type: [WarehouseDto] })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.All)
  findAll(): Promise<WarehouseDto[]> {
    return this.warehouseService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by id' })
  @ApiResponse({ status: 200, type: WarehouseDto })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.All)
  findOne(@Param('id') id: number): Promise<WarehouseDto> {
    return this.warehouseService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, type: WarehouseDto })
  @ApiResponse({ status: 404, description: 'Error: Not Found', type: Error404 })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin || Role.Warehouse)
  create(@Body() warehouseData: CreateWarehouseDto): Promise<WarehouseDto> {
    return this.warehouseService.create(warehouseData);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({ status: 200, description: 'Product updated', type: WarehouseDto })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin|| Role.Warehouse)
  update(
    @Param('id') id: number,
    @Body() updateData: UpdateWarehouseDto,
  ): Promise<WarehouseDto> {
    return this.warehouseService.update(id, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({ status: 200, description: 'Product deleted' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  delete(@Param('id') id: number): Promise<void> {
    return this.warehouseService.delete(id);
  }

}
