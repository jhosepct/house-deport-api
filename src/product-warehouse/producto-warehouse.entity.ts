import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn, OneToMany, JoinColumn
} from "typeorm";
import { Warehouse } from './warehouse.entity';
import { Product } from '../product/product.entity';
import { OrderDetail } from "../order/order-detail.entity";

@Entity()
export class ProductWarehouse {
  @Column({ name: 'pw_id' })
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.productWarehouses)
  @JoinColumn({ name: 'w_id' })
  warehouse: Warehouse;

  @ManyToOne(() => Product, (product) => product.productWarehouses)
  @JoinColumn({ name: 'p_id' })
  product: Product;

  @Column({ name: 'pw_row', type: 'integer' })
  row: number;

  @Column({ name: 'pw_column', type: 'integer' })
  column: number;

  @Column({ name: 'pw_quantity', type: 'integer' })
  quantity: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.productWarehouse)
  orderDetails: OrderDetail[];
}
