import { Module } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Warehouse } from "./warehouse.entity";
import { WarehouseController } from "./warehouse.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Warehouse])],
  providers: [WarehouseService],
  controllers: [WarehouseController]
})
export class WarehouseModule {}
