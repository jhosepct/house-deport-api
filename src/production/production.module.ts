import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductionService } from './production.service';
import { ProductionController } from './production.controller';
import { Production } from './production.entity';
import { User } from '../user/user.entity';
import { Product } from '../product/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Production, User, Product])],
  controllers: [ProductionController],
  providers: [ProductionService],
})
export class ProductionModule {}

