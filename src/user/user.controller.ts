import {
  Body,
  Controller,
  Delete,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  Param,
  Get,
  Request,
  HttpException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../utils/decorador/roles.decorador';
import { Role } from '../utils/enum/roles.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

import { Request as Req } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { UserDto } from '../utils/dto/user.dto';
import {
  Error409,
  Error400,
  DeleteResponse,
  Error404,
} from '../utils/dto/response.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private usersService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({
    status: 201,
    description: 'El usuario ha sido creado exitosamente',
    type: UserDto,
  })
  @ApiResponse({ status: 409, description: 'Error: Conflict', type: Error409 })
  @ApiResponse({
    status: 400,
    description: 'Error: Bad Request',
    type: Error400,
  })
  //@UseGuards(JwtAuthGuard, RolesGuard)
  //@Roles(Role.Admin)
  createUser(@Body() newUser: CreateUserDto): Promise<UserDto> {
    return this.usersService.createUser(newUser);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({
    status: 200,
    type: [UserDto],
  })
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.Admin)
  getUsers(): Promise<UserDto[]> {
    return this.usersService.getUsers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por su ID' })
  @ApiResponse({
    status: 200,
    type: UserDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Error: Not Found',
    type: Error404,
  })
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.Admin)
  getUserById(@Param('id', ParseIntPipe) id: number): Promise<UserDto> {
    return this.usersService.getUserById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un usuario por su ID' })
  @ApiResponse({
    status: 200,
    type: DeleteResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Error: Not Found',
    type: Error404,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  deleteUser(@Param('id', ParseIntPipe) id: number): Promise<HttpException> {
    return this.usersService.deleteUser(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un usuario por su ID' })
  @ApiResponse({
    status: 200,
    description: 'El usuario ha sido actualizado exitosamente',
    type: UserDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Error: Not Found',
    type: Error404,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: UpdateUserDto,
  ): Promise<UserDto> {
    return this.usersService.updateUser(id, user);
  }
}
