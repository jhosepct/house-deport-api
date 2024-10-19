import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto, LoginWithUsernameDto } from "./dto/login-auth.dto";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { User } from "../user/user.entity";
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,

        private jwtService: JwtService
    ) { }

    async login(userObject: LoginDto, res: Response): Promise<HttpException> {
        const userFound =  await this.userRepository.findOneBy({ email: userObject.email });
        if (!userFound) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

        const isMatch = await bcrypt.compare(userObject.password, userFound.password);
        if (!isMatch) throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);

        const payload = { id: userFound.id, email: userFound.email, role: userFound.role }
        const token = this.jwtService.sign(payload);

        res.cookie('user_token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 365 * 24 * 60 * 60 * 1000,
            path: '/',
        });
        throw new HttpException(userFound.ToJSON(), HttpStatus.OK)
    }

    async loginWithUsername(userObject: LoginWithUsernameDto, res: Response): Promise<HttpException> {
        const userFound =  await this.userRepository.findOneBy({ username: userObject.username });
        if (!userFound) throw new HttpException('UserName not found', HttpStatus.NOT_FOUND);

        const isMatch = await bcrypt.compare(userObject.password, userFound.password);
        if (!isMatch) throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);

        const payload = { id: userFound.id, email: userFound.email, role: userFound.role }
        const token = this.jwtService.sign(payload);

        res.cookie('user_token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 365 * 24 * 60 * 60 * 1000,
            path: '/',
        });
        throw new HttpException(userFound.ToJSON(), HttpStatus.OK)
    }

    async logout(res: Response) {
        res.clearCookie('user_token');
        throw new HttpException('Logout success', HttpStatus.OK);
    }
}
