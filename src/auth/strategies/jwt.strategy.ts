import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { ConfigType } from '@nestjs/config';
import config from '../../config/configuration'
import { IJwtPayload } from '../dto/jwt-payload.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { User } from "../../user/user.entity";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.cookieExtractor,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.JWT_SECRET,
    });
  }

  private static cookieExtractor(req: Request): string | null {
    if (req.cookies && 'user_token' in req.cookies && req.cookies['user_token'].length > 0) return req.cookies['user_token'];
    return null;
    // return req?.cookies?.Authentication;
  }

  async validate(payload: IJwtPayload) {
    const response = payload;

    const userFound = await this.userRepository.findOne({
      where: {
        id: response.id,
        email: response.email,
      }
    });
    if (!userFound) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return { userId: payload.id, role: payload.role, email: payload.email };
  }
}