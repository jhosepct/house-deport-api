import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn, OneToMany
} from "typeorm";
import { ProductWarehouse } from "./producto-warehouse.entity";

@Entity()
export class Warehouse {
  @Column({ name: 'w_id' })
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'w_name' })
  name: string;

  @Column({ name: 'w_row_max', type: 'integer' })
  rowMax: number;

  @Column({ name: 'w_column_max', type: 'integer' })
  columnMax: number;

  @Column({
    name: 'w_status',
    type: 'enum',
    enum: ['available', 'busy'],
    default: 'available',
  })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => ProductWarehouse, (productWarehouse) => productWarehouse.warehouse)
  productWarehouses: ProductWarehouse[];
}
