import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProductionService } from './production.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../utils/decorador/roles.decorador';
import { Role } from '../utils/enum/roles.enum';
import { CreateProductionDto } from './dto/CreateProduction.Dto';
import { UpdateProductionDto } from './dto/UpdateProduction.dto';

@ApiTags('productions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('productions')
export class ProductionController {
  constructor(private readonly productionService: ProductionService) {}

  @Post()
  @Roles(Role.Admin, Role.Production)
  @ApiOperation({ summary: 'Create a new production' })
  @ApiResponse({
    status: 201,
    description: 'The production has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() createProductionDto: CreateProductionDto) {
    return this.productionService.create(createProductionDto);
  }

  @Get()
  @Roles(Role.Admin, Role.Production)
  @ApiOperation({ summary: 'Get all productions' })
  @ApiResponse({ status: 200, description: 'Return all productions.' })
  findAll() {
    return this.productionService.findAll();
  }

  @Get(':id')
  @Roles(Role.Admin, Role.Production)
  @ApiOperation({ summary: 'Get a production by id' })
  @ApiResponse({ status: 200, description: 'Return the production.' })
  @ApiResponse({ status: 404, description: 'Production not found.' })
  findOne(@Param('id') id: string) {
    return this.productionService.findOne(+id);
  }
}
