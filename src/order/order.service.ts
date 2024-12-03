import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Repository } from 'typeorm';
import * as PDFDocument from 'pdfkit';
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
      await this.orderRepository.find({ relations: ['client', 'user','orderDetails', 'orderDetails.product', 'invoice'] })
    ).map((order) => order.ToJSON());
  }

  async findOne(id: number): Promise<OrderDto> {
    return (
      await this.orderRepository.findOne({
        where: { id },
        relations: ['client', 'user','orderDetails', 'orderDetails.product', 'invoice'],
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
      const doc = new PDFDocument({ size: 'A4', margin: 40 });

      const buffers: Buffer[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });
      doc.on('error', reject);

    /*  // Configuración inicial del PDF
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename=nota-venta.pdf');
      doc.pipe(res);*/

      // Encabezado de la empresa
      doc
        .text('HOUSE DEPORT', 110, 45)
        .fontSize(10)
        .text('House Deport “Creaciones Emily”', 50, 70)
        .text('RUC: 10713129416 ', 50, 85)
        .text('Jirón Arequipa #953 San Jerónimo de Tunán', 50, 100)
        .text('Tel: 987 654 321', 50, 115)
        .text('Correo: housedeport@gmail.com', 50, 130);

      // Información del cliente
      doc
        .fontSize(12)
        .text(`NOTA DE VENTA`, 300, 50, { align: 'right' })
        .text(`N° ${order.numFac}`, 300, 70, { align: 'right' })
        .moveDown()
        .text(`Cliente: ${order.client.firstName} ${order.client.lastName}`, 50, 180)
        .text(`DNI: ${order.client.numberDocument}`, 50, 195)
        .text(`Dirección: ${order.client.address}`, 50, 210);

      // Fecha y hora
      const date = new Date(order.date);
      doc
        .text(`Fecha: ${date.toLocaleDateString()}`, 50, 230)
        .text(`Hora: ${date.toLocaleTimeString()}`, 50, 245);

      // Tabla de productos
      doc
        .moveDown()
        .text('Cant  U.M   COD            PRECIO  TOTAL', 50, 270)
        .moveTo(50, 285)
        .lineTo(550, 285)
        .stroke();

      let y = 290;
      order.details.forEach((detail) => {
        doc
          .fontSize(10)
          .text(`${detail.quantity}    Unidad    ${detail.product.code}    ${detail.unitPrice.toFixed(2)}    ${detail.total.toFixed(2)}`, 50, y);
        y += 15;
      });

      // Totales
      doc
        .fontSize(12)
        .text(`SUBTOTAL: S/ ${order.subtotal.toFixed(2)}`, 400, y + 20)
        .text(`TOTAL: S/ ${order.total.toFixed(2)}`, 400, y + 35);

      // Pie de página
      doc
        .fontSize(10)
        .text('Forma de Pago: Contado', 50, y + 70)
        .text('Condición de Venta: Contado', 50, y + 85)
        .moveTo(50, y + 110)
        .lineTo(550, y + 110)
        .stroke()
        .text('Representación impresa de la nota de venta electrónica.', 50, y + 120);

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
