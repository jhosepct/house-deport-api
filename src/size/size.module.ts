import { Module } from '@nestjs/common';
import { SizeService } from './size.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { SizeController } from "./size.controller";
import { Size } from "./size.entity";
import { Category } from "../category/category.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Size,Category])],
  providers: [SizeService],
  controllers: [SizeController]
})
export class SizeModule {}
