import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Production } from './production.entity';
import { User } from '../user/user.entity';
import { Product } from '../product/product.entity';
import { CreateProductionDto } from './dto/CreateProduction.Dto';
import { UpdateProductionDto } from './dto/UpdateProduction.dto';

@Injectable()
export class ProductionService {
  constructor(
    @InjectRepository(Production)
    private productionRepository: Repository<Production>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Production[]> {
    return this.productionRepository.find({
      relations: ['user_order', 'user_receive_order', 'product'],
    });
  }

  async findOne(id: number): Promise<Production> {
    const production = await this.productionRepository.findOne({
      where: { id },
      relations: ['user_order', 'user_receive_order', 'product'],
    });
    if (!production) {
      throw new NotFoundException(`Production with ID ${id} not found`);
    }
    return production;
  }

  async create(createProductionDto: CreateProductionDto): Promise<Production> {
    const { user_orderId, productId, quantity } = createProductionDto;

    const user_order = await this.userRepository.findOne({
      where: { id: user_orderId },
    });

    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!user_order || !product) {
      throw new NotFoundException('User or Product not found');
    }

    const production = this.productionRepository.create({
      user_order,
      product,
      quantity,
      status: 'completed',
    });
    production.product.stockInventory += production.quantity;
    await this.productRepository.save(production.product);
    return this.productionRepository.save(production);
  }
}
