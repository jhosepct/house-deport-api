import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn, OneToMany, JoinColumn
} from "typeorm";
import { Warehouse } from '../warehouse/warehouse.entity';
import { Product } from '../product/product.entity';
import { OrderDetail } from "../order/order-detail.entity";

@Entity()
export class ProductWarehouse {
  @Column({ name: 'pw_id' })
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'w_id' })
  warehouseId: number;

  @Column({ name: 'p_id' })
  productId: number;

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

  ToJSON() {
    return {
      id: this.id,
      warehouse: this.warehouse ? this.warehouse.ToJSON() : null,
      product: this.product ? this.product.ToJSON() : null,
      row: this.row,
      column: this.column,
      quantity: this.quantity,
    };
  }

  ToBasicJSON() {
    return {
      id: this.id,
      row: this.row,
      column: this.column,
      quantity: this.quantity,
      name: this.warehouse ? this.warehouse.name : null,
      status: this.warehouse ? this.warehouse.status : null,
      warehouseId: this.warehouse ? this.warehouse.id : null,
      color: this.warehouse ? this.warehouse.color : null,
    };
  }
}
