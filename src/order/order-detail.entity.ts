import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne, JoinColumn
} from "typeorm";
import { Order } from './order.entity';
import { Product } from '../product/product.entity';
import { ProductWarehouse } from '../product-warehouse/producto-warehouse.entity';

@Entity()
export class OrderDetail {
  @Column({ name: 'od_id' })
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.orderDetails)
  @JoinColumn({ name: 'or_id' })
  order: Order;

  @ManyToOne(() => Product, (product) => product.productWarehouses)
  @JoinColumn({ name: 'p_id' })
  product: Product;

  @Column({ name: 'od_quantity', type: 'integer' })
  quantity: number;

  @Column({ name: 'od_unit_price', type: 'double precision' })
  unitPrice: number;

  @Column({ name: 'od_total', type: 'double precision' })
  total: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  ToJSON() {
    return {
      id: this.id,
      product: this.product ? this.product.ToBasicJSON() : null,
      quantity: this.quantity,
      unitPrice: this.unitPrice,
      total: this.total / 100,
    };
  }
}
