import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn, OneToMany
} from "typeorm";
import { ProductWarehouse } from "../product-warehouse/producto-warehouse.entity";

@Entity()
export class Warehouse {
  @Column({ name: 'w_id' })
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'w_name' })
  name: string;

  @Column({ name: 'w_description', nullable: true })
  description: string;

  @Column({name: 'w_color', nullable: true})
  color: string;

  @Column({ name: 'w_row_max', type: 'integer', default: 0 })
  rowMax: number;

  @Column({ name: 'w_column_max', type: 'integer', default: 0 })
  columnMax: number;

  @Column({ name: 'w_spaces', type: 'integer', default: 0 })
  spaces: number;

  @Column({ name: 'w_spaces_used', type: 'integer', default: 0 })
  spacesUsed: number;

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

  ToJSON() {
    return {
      id: this.id,
      name: this.name,
      rowMax: this.rowMax,
      columnMax: this.columnMax,
      status: this.status,
      description: this.description,
      color: this.color,
      spaces: this.spaces,
      spacesUsed: this.spacesUsed,
      products: this.productWarehouses.map((productWarehouse) => ({
        ...productWarehouse.product.ToBasicJSON(),
        row: productWarehouse.row,
        column: productWarehouse.column,
        quantity: productWarehouse.quantity,
      })),
    };
  }

  ToBasicJSON() {
    return {
      id: this.id,
      name: this.name,
      rowMax: this.rowMax,
      columnMax: this.columnMax,
      status: this.status,
    };
  }
}
