import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { ConfigType } from '@nestjs/config';
import config from '../../config/configuration';
import { IJwtPayload } from '../dto/jwt-payload.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { User } from '../../user/user.entity';
import { Utils } from '../../utils/utils';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) =>
          JwtStrategy.cookieExtractor(req, this.configService.JWT_SECRET),
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.JWT_SECRET,
    });
  }

  private static cookieExtractor(
    req: Request,
    jwtSecret: string,
  ): string | null {
    if (
      req.cookies &&
      jwtSecret in req.cookies &&
      req.cookies[jwtSecret].length > 0
    ) {
      try {
        const encryptedToken = req.cookies[jwtSecret];
        return Utils.decryptToken(encryptedToken, jwtSecret);
      } catch (error) {
        console.error('Error decrypting token:', error);
        return null;
      }
    }
    return null;
  }

  async validate(payload: IJwtPayload) {
    const response = payload;

    const userFound = await this.userRepository.findOne({
      where: {
        id: response.id,
        email: response.email,
      },
    });
    if (!userFound)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return { userId: payload.id, role: payload.role, email: payload.email };
  }
}
