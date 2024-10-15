import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { ClientService } from './client.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ClientDto } from "../utils/dto/client.dto";
import { CreateClientDto } from "./dto/CreateClientDto";
import { UpdateClientDto } from "./dto/UpdateCientDto";
import { Error404, Error409 } from "../utils/dto/response.dto";

@ApiTags('Client')
@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo cliente' })
  @ApiResponse({
    status: 201,
    type: ClientDto,
  })
  @ApiResponse({ status: 409, description: 'Error: Conflict', type: Error409 })
  createClient(@Body() newClient: CreateClientDto): Promise<ClientDto> {
    return this.clientService.createClient(newClient);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los clientes' })
  @ApiResponse({
    status: 200,
    type: [ClientDto],
  })
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
  updateClient(@Param('id') id: number, @Body() client: UpdateClientDto): Promise<ClientDto> {
    return this.clientService.updateClient(id, client);
  }
}
