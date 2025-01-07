import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { LoginDto, LoginWithUsernameDto } from './dto/login-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { User } from '../user/user.entity';
import { RequestJwtPayload } from '../user/dto/jwt-payload.dto';
import { Request } from 'express';
import { UserDto } from '../utils/dto/user.dto';
import config from '../config/configuration';
import { ConfigType } from '@nestjs/config';
import { Utils } from '../utils/utils';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
    private jwtService: JwtService,
  ) {}

  async login(
    userObject: LoginDto | LoginWithUsernameDto,
    res: Response,
  ): Promise<HttpException> {
    let userFound: User = null;
    if ('email' in userObject) {
      userFound = await this.userRepository.findOneBy({
        email: userObject.email,
      });
    } else if ('username' in userObject) {
      userFound = await this.userRepository.findOneBy({
        username: userObject.username,
      });
    }

    if (!userFound)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);


    const isMatch = await bcrypt.compare(
      userObject.password,
      userFound.password,
    );
    if (!isMatch)
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);

    //update last login
    userFound.lastSession = new Date();
    await this.userRepository.save(userFound);

    const payload = {
      id: userFound.id,
      email: userFound.email,
      role: userFound.role,
    };

    const token = this.jwtService.sign(payload);

    const encryptedToken = Utils.encryptToken(
      token,
      this.configService.JWT_SECRET,
    );

    res.cookie(this.configService.JWT_SECRET, encryptedToken, {
      httpOnly: true,
      secure: true, //process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge:  7 * 24 * 60 * 60 * 1000,
      path: '/',
      domain: this.configService.DOMAIN,
    });
    throw new HttpException(userFound.ToJSON(), HttpStatus.OK);
  }

  async logout(res: Response) {
    res.clearCookie(this.configService.JWT_SECRET);
    throw new HttpException('Logout success', HttpStatus.OK);
  }

  async auth(request: Request): Promise<UserDto> {
    const dataUser = request.user as RequestJwtPayload;
    const userFound = await this.userRepository.findOneBy({
      id: dataUser.userId,
    });
    if (!userFound)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return userFound.ToJSON();
  }
}
