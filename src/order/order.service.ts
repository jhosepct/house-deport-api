import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Repository } from 'typeorm';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';

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
import { Response } from 'express';
import * as path from 'node:path';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

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
  ) {
  }

  async findAll(): Promise<OrderDto[]> {
    return (
      await this.orderRepository.find({ relations: ['client', 'user', 'orderDetails', 'orderDetails.product', 'invoice'] })
    ).map((order) => order.ToJSON());
  }

  async findOne(id: number): Promise<OrderDto> {
    return (
      await this.orderRepository.findOne({
        where: { id },
        relations: ['client', 'user', 'orderDetails', 'orderDetails.product', 'invoice'],
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
      relations: ['client', 'user', 'orderDetails', 'orderDetails.product', 'invoice'],
    });
    return orderResponse.ToJSON();
  }

  async update(id: number, updateData: CreateOrderDto): Promise<OrderDto> {
    return (await this.orderRepository.save({ ...updateData, id })).ToJSON();
  }

  async delete(id: number): Promise<void> {
    return this.orderRepository.delete(id).then(() => undefined);
  }

  async generateSaleNote(res: Response, orderId: number): Promise<Buffer> {
    const orderRes = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['client', 'user', 'orderDetails', 'orderDetails.product', 'invoice'],
    });

    if (!orderRes) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }

    const order = orderRes.ToJSON();


    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 40,
        bufferPages: true,
      });

      const buffers: Buffer[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });
      doc.on('error', reject);

      // Company Logo Configuration
      const possiblePaths = [
        path.join(process.cwd(), 'public', 'logo.png'),
        path.join(__dirname, '..', '..', 'public', 'logo.png'),
        path.join(__dirname, 'public', 'logo.png')
      ];

      for (const logoPath of possiblePaths) {
        if (fs.existsSync(logoPath)) {
          doc.image(logoPath, 50, 40, {
            width: 100,
            align: 'left',
            valign: 'top',
          });
        }
      }
      //


      // Professional Company Header
      doc
        .font('Helvetica-Bold')
        .fontSize(14)
        .text('HOUSE DEPORT', 180, 50, {
          align: 'left',
          width: 300,
        })
        .font('Helvetica')
        .fontSize(10)
        .text('"Creaciones Emily"', 180, 70, {
          align: 'left',
          width: 300,
        })
        .text('RUC: 10713129416', 180, 85, {
          align: 'left',
          width: 300,
        });

      // Detailed Company Information
      doc
        .fontSize(9)
        .fillColor('#666666')
        .text('Jirón Arequipa #953 San Jerónimo de Tunán', 180, 100)
        .text('Tel: 987 654 321 | Correo: housedeport@gmail.com', 180, 115);

      // Sale Note Header
      doc
        .fillColor('#000000')
        .font('Helvetica-Bold')
        .fontSize(12)
        .text('NOTA DE VENTA', 400, 50, {
          align: 'right',
          width: 150,
        })
        .font('Helvetica')
        .fontSize(10)
        .text(`N° ${order.numFac}`, 400, 70, {
          align: 'right',
          width: 150,
        });

      // Customer Information
      doc
        .font('Helvetica')
        .fontSize(10)
        .text(`Cliente: ${order.client.firstName} ${order.client.lastName}`, 50, 180)
        .text(`DNI: ${order.client.numberDocument}`, 50, 195)
        .text(`Dirección: ${order.client.address}`, 50, 210);

      // Date and Time
      const date = new Date(order.date);
      doc
        .text(`Fecha: ${date.toLocaleDateString()}`, 50, 230)
        .text(`Hora: ${date.toLocaleTimeString()}`, 50, 245);

      // Products Table Header
      doc
        .font('Helvetica-Bold')
        .text('Cant', 50, 270, { width: 50, align: 'left' })
        .text('U.M', 100, 270, { width: 50, align: 'left' })
        .text('COD', 150, 270, { width: 80, align: 'left' })
        .text('PRECIO', 250, 270, { width: 100, align: 'right' })
        .text('TOTAL', 380, 270, { width: 100, align: 'right' });

      // Draw line under header
      doc
        .moveTo(50, 285)
        .lineTo(550, 285)
        .stroke();

      // Products Details
      let y = 300;
      doc.font('Helvetica');
      order.details.forEach((detail) => {
        doc
          .text(`${detail.quantity}`, 50, y, { width: 50, align: 'left' })
          .text('Unidad', 100, y, { width: 50, align: 'left' })
          .text(`${detail.product.code}`, 150, y, { width: 80, align: 'left' })
          .text(`S/ ${detail.unitPrice.toFixed(2)}`, 250, y, { width: 100, align: 'right' })
          .text(`S/ ${detail.total.toFixed(2)}`, 380, y, { width: 100, align: 'right' });
        y += 15;
      });
      // Totales
      doc
        .font('Helvetica-Bold')
        .fontSize(11)
        .text(`SUBTOTAL:`, 300, y + 20, { width: 100, align: 'left' })
        .text(`S/ ${order.subtotal.toFixed(2)}`, 400, y + 20, { width: 80, align: 'right' })
        .text(`TOTAL:`, 300, y + 35, { width: 100, align: 'left' })
        .text(`S/ ${order.total.toFixed(2)}`, 400, y + 35, { width: 80, align: 'right' });


      doc
        .font('Helvetica')
        .fontSize(9)
        .fillColor('#666666')
        .text(`Estado de pago Pago: ${order.status}`, 50, y + 70)
        .moveTo(50, y + 110)
        .lineTo(550, y + 110)
        .stroke()
        .text('Representación impresa de la nota de venta electrónica.', 50, y + 120, {
          align: 'center',
          width: 500,
        });

      // Finaliza el documento
      doc.end();
    });
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
