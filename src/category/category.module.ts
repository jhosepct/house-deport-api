import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Category } from "./category.entity";
import { CategoryService } from "./category.service";
import { CategoryController } from "./category.controller";
import { Size } from "../size/size.entity";
import { CategoryToSize } from "./categorySize.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Category, Size, CategoryToSize])],
  providers: [CategoryService],
  controllers: [CategoryController]
})
export class CategoryModule {}
