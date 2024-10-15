import { Body, Controller, Delete, Get, HttpException, Post, Res } from "@nestjs/common";
import { LoginDto } from './dto/login-auth.dto';
import { AuthService } from './auth.service';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Error400, Error401, Error404, ResponseLogout } from "../utils/dto/response.dto";
import { UserDto } from "../utils/dto/user.dto";

@ApiTags('Auth')
@Controller()
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @ApiOperation({ summary: 'Iniciar sesión' })
    @ApiResponse({ status: 200, type: UserDto })
    @ApiResponse({ status: 400, description: 'Error: Bad Request', type: Error400 })
    @ApiResponse({ status: 401, description: 'Error: Unauthorized', type: Error401 })
    @ApiResponse({ status: 404, description: 'Error: Not Found', type: Error404 })
    async login(@Body() userObject: LoginDto, @Res({ passthrough: true }) res: Response): Promise<HttpException>  {
        return this.authService.login(userObject, res);
    }

    @Delete('logout')
    @ApiOperation({ summary: 'Cerrar sesión' })
    @ApiResponse({ status: 200, type: ResponseLogout })
    async logout(@Res({ passthrough: true }) res: Response){
        return this.authService.logout(res);
    }
}
