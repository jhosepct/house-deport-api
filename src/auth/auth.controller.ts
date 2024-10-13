import { Body, Controller, Delete, Get, Post, Res } from '@nestjs/common';
import { LoginDto } from './dto/login-auth.dto';
import { AuthService } from './auth.service';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

// @ApiTags('auth')
@Controller()
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @ApiOperation({ summary: 'Iniciar sesión' })
    @ApiResponse({ status: 200, description: 'El usuario ha iniciado sesión exitosamente' })
    async login(@Body() userObject: LoginDto, @Res({ passthrough: true }) res: Response) {
        return this.authService.login(userObject, res);
    }

    @Delete('logout')
    @ApiOperation({ summary: 'Cerrar sesión' })
    @ApiResponse({ status: 200, description: 'El usuario ha cerrado sesión exitosamente' })
    async logout(@Res({ passthrough: true }) res: Response) {
        return this.authService.logout(res);
    }
}
