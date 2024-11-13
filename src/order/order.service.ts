import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderDto } from '../utils/dto/order.dto';
import { CreateOrderDto } from './dto/CreateOrderDto.dto';
import { Client } from '../client/client.entity';
import { Product } from '../product/product.entity';
import { User } from '../user/user.entity';
import { OrderDetail } from './order-detail.entity';
import { ProductWarehouse } from "../product-warehouse/producto-warehouse.entity";

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(User)
    private uerRepository: Repository<Order>,
    @InjectRepository(OrderDetail)
    private orderDetailRepository: Repository<OrderDetail>,
    @InjectRepository(ProductWarehouse)
    private productWarehouseRepository: Repository<ProductWarehouse>,
  ) {}

  async findAll(): Promise<OrderDto[]> {
    return (
      await this.orderRepository.find({ relations: ['client', 'user'] })
    ).map((order) => order.ToJSON());
  }

  async findOne(id: number): Promise<OrderDto> {
    return (
      await this.orderRepository.findOne({
        where: { id },
        relations: ['client', 'user'],
      })
    ).ToJSON();
  }

  async create(orderData: CreateOrderDto): Promise<OrderDto> {
    const user = await this.uerRepository.findOne({
      where: { id: orderData.userId },
    });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const client = await this.clientRepository.findOne({
      where: { id: orderData.clientId },
    });
    if (!client)
      throw new HttpException('Client not found', HttpStatus.NOT_FOUND);

    const products = await this.productRepository.find({
      where: {
        id: In(orderData.products.map((product) => product.id)),
      },
    });

    if (products.length !== orderData.products.length)
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);

    const productWarehouses = await this.productWarehouseRepository.find({
      where: {
        id: In(orderData.products.map((product) => product.productWarehouseId)),
      },
    });

    if (productWarehouses.length !== orderData.products.length)
      throw new HttpException('Product Warehouse not found', HttpStatus.NOT_FOUND);

    const newOrder = this.orderRepository.create({
      client,
      user,
    });

    let order = await this.orderRepository.save(newOrder);

    // Create order details
    const orderDetails = orderData.products.map((product) => {
      const productFound = products.find((p) => p.id === product.id);
      return {
        order: order,
        product: productFound,
        quantity: product.quantity,
        unitPrice: productFound.price,
        total: productFound.price * product.quantity * 100, // 100 is for the percentage
      };
    });

    await this.orderDetailRepository.save(orderDetails);

    const productWarehouseUpdate = productWarehouses.map((productWarehouse) => {
      const product = orderData.products.find((p) => p.productWarehouseId === productWarehouse.id);
      productWarehouse.quantity -= product.quantity;
      return productWarehouse;
    });

    await this.productWarehouseRepository.save(productWarehouseUpdate);

    // Update products
    const productsUpdate = products.map((product) => {
      const productOrder = orderData.products.find((p) => p.id === product.id);
      product.stockStore -= productOrder.quantity;
      return product;
    });

    await this.productRepository.save(productsUpdate);

    // Update the total of the order
    const total = orderDetails.reduce(
      (acc, orderDetail) => acc + orderDetail.total,
      0,
    );

    order.total = total;
    order.subtotal = 0.82 * total;
    order.numFac = orderData.numFac;
    order.tax = 0.18 * total;
    order.status = 'completed';
    order.date = new Date();

    const returnOrder = await this.orderRepository.save(order);

    return returnOrder.ToJSON();
  }

  async update(id: number, updateData: CreateOrderDto): Promise<OrderDto> {
    return (await this.orderRepository.save({ ...updateData, id })).ToJSON();
  }

  async delete(id: number): Promise<void> {
    return this.orderRepository.delete(id).then(() => undefined);
  }
}
