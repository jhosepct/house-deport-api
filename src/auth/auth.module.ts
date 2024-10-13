import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { ConfigType } from '@nestjs/config';
import config from '../config/configuration'
import { JwtStrategy } from './strategies/jwt.strategy';
import { User } from "../user/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User]),
  JwtModule.registerAsync({
    inject: [config.KEY],
    useFactory: (configService: ConfigType<typeof config>) => {
      return {
        secret: configService.JWT_SECRET,
        signOptions: { expiresIn: '24h' },
      }
    }
  }),],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy]
})
export class AuthModule { }
