import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderDto } from '../utils/dto/order.dto';
import { CreateOrderDto } from './dto/CreateOrderDto.dto';
import { Client } from '../client/client.entity';
import { Product } from '../product/product.entity';
import { User } from '../user/user.entity';
import { OrderDetail } from './order-detail.entity';
import { ProductWarehouse } from '../product-warehouse/producto-warehouse.entity';
import { RequestJwtPayload } from '../user/dto/jwt-payload.dto';
import { Invoice } from './invoice.entity';
import { Utils } from '../utils/utils';

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
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
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

  async create(
    orderData: CreateOrderDto,
    payload: RequestJwtPayload,
  ): Promise<OrderDto> {
    const user = await this.uerRepository.findOne({
      where: { id: payload.userId },
    });

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
      throw new HttpException(
        'Product Warehouse not found',
        HttpStatus.NOT_FOUND,
      );

    const newOrder = this.orderRepository.create({
      client,
      user,
      paymentType: orderData.paymentType,
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
      const product = orderData.products.find(
        (p) => p.productWarehouseId === productWarehouse.id,
      );
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

    const invoice = await this.getInvoice();

    const updateOrder: Partial<Order> = {
      total: total,
      subtotal: 0.82 * total,
      invoice: invoice,
      tax: 0.18 * total,
      status: 'completed',
      date: new Date(),
    };

     await this.orderRepository.save({
      ...updateOrder,
      id: order.id,
    });

    const orderResponse = await this.orderRepository.findOne({
      where: { id: order.id },
      relations: ['client', 'user', 'orderDetails', 'orderDetails.product'],
    });
    return orderResponse.ToJSON();
  }

  async update(id: number, updateData: CreateOrderDto): Promise<OrderDto> {
    return (await this.orderRepository.save({ ...updateData, id })).ToJSON();
  }

  async delete(id: number): Promise<void> {
    return this.orderRepository.delete(id).then(() => undefined);
  }

  private async getInvoice(): Promise<Invoice> {
    const lastInvoice = await this.invoiceRepository.findOne({
      where: { numFac: Like(`F%-%`) },
      order: { numFac: 'DESC' },
    });

    let series = 'F001'; // Serie inicial
    let number = 0; // Número inicial

    if (lastInvoice) {
      const [lastSeries, lastNumber] = lastInvoice.numFac.split('-');
      series = lastSeries;
      number = parseInt(lastNumber, 10);

      // Cambiar la serie si el número alcanza el límite
      if (number >= 9999) {
        series = Utils.nextSeries(series); // Incrementa la serie
        number = 0; // Reinicia el número correlativo
      }
    }
    const numFac = Utils.formatInvoice(series, number + 1);
    const invoice = this.invoiceRepository.create({
      numFac,
    });

    return this.invoiceRepository.save(invoice);
  }
}
