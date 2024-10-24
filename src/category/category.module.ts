import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Category } from "./category.entity";
import { CategoryService } from "./category.service";
import { CategoryController } from "./category.controller";
import { Size } from "../size/size.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Category, Size])],
  providers: [CategoryService],
  controllers: [CategoryController]
})
export class CategoryModule {}
