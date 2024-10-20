import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { Order } from './order.entity';
import { CreateOrderDto } from "./dto/CreateOrderDto.dto";
import { OrderDto } from "../utils/dto/order.dto";

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({ status: 200, description: 'List of orders', type: [OrderDto] })
  findAll(): Promise<OrderDto[]> {
    return this.orderService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an order by id' })
  @ApiResponse({ status: 200, description: 'Order found', type: OrderDto })
  findOne(@Param('id') id: number): Promise<OrderDto> {
    return this.orderService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created', type: CreateOrderDto })
  create(@Body() orderData: CreateOrderDto): Promise<OrderDto> {
    return this.orderService.create(orderData);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an order' })
  @ApiResponse({ status: 200, description: 'Order updated', type: OrderDto })
  update(@Param('id') id: number, @Body() updateData: CreateOrderDto): Promise<OrderDto> {
    return this.orderService.update(id, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an order' })
  @ApiResponse({ status: 200, description: 'Order deleted' })
  delete(@Param('id') id: number): Promise<void> {
    return this.orderService.delete(id);
  }
}
