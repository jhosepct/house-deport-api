import { Controller, Get, Post, Body, Param, Delete, Patch, UseGuards } from "@nestjs/common";
import { ClientService } from './client.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ClientDto } from "../utils/dto/client.dto";
import { CreateClientDto } from "./dto/CreateClientDto";
import { UpdateClientDto } from "./dto/UpdateCientDto";
import { Error404, Error409 } from "../utils/dto/response.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../utils/decorador/roles.decorador";
import { Role } from "../utils/enum/roles.enum";

@ApiTags('Client')
@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo cliente' })
  @ApiResponse({
    status: 201,
    type: ClientDto,
  })
  @ApiResponse({ status: 409, description: 'Error: Conflict', type: Error409 })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin || Role.Sales)
  createClient(@Body() newClient: CreateClientDto): Promise<ClientDto> {
    return this.clientService.createClient(newClient);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los clientes' })
  @ApiResponse({
    status: 200,
    type: [ClientDto],
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.All)
  getClients(): Promise<ClientDto[]> {
    return this.clientService.getClients();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un cliente por su ID' })
  @ApiResponse({
    status: 200,
    type: ClientDto,
  })
  @ApiResponse({ status: 404, description: 'Error: Not Found', type: Error404 })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.All)
  getClientById(@Param('id') id: number): Promise<ClientDto> {
    return this.clientService.getClientById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un cliente por su ID' })
  @ApiResponse({
    status: 200,
    type: ClientDto,
  })
  @ApiResponse({ status: 404, description: 'Error: Not Found', type: Error404 })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  deleteClient(@Param('id') id: number): Promise<void> {
    return this.clientService.deleteClient(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un cliente por su ID' })
  @ApiResponse({
    status: 200,
    type: ClientDto,
  })
  @ApiResponse({ status: 404, description: 'Error: Not Found' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin || Role.Sales)
  updateClient(@Param('id') id: number, @Body() client: UpdateClientDto): Promise<ClientDto> {
    return this.clientService.updateClient(id, client);
  }
}
