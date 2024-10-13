import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn, OneToMany, JoinColumn
} from "typeorm";
import { Category } from '../category/category.entity';
import { Size } from '../category/size.entity';
import { ProductWarehouse } from "../product-warehouse/producto-warehouse.entity";

@Entity()
export class Product {
  @Column({ name: 'p_id' })
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'p_name' })
  name: string;

  @Column({ name: 'p_code' })
  code: string;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'ca_id' })
  category: Category;

  @ManyToOne(() => Size, (size) => size.products)
  @JoinColumn({ name: 'si_id' })
  size: Size;

  @Column({ name: 'p_stock_inventory', type: 'integer' })
  stockInventory: number;

  @Column({ name: 'p_stock_store', type: 'integer' })
  stockStore: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() =>ProductWarehouse, (productWarehouse) => productWarehouse.product)
  productWarehouses: ProductWarehouse[];
}
