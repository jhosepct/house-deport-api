import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Category } from '../category/category.entity';
import { Size } from '../size/size.entity';
import { ProductWarehouse } from '../product-warehouse/producto-warehouse.entity';
import { Production } from '../production/production.entity';

@Entity()
export class Product {
  @Column({ name: 'p_id' })
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'p_name' })
  name: string;

  @Column({ name: 'p_code' })
  code: string;

  @Column({ name: 'p_price', type: 'decimal' })
  price: number;

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

  @OneToMany(
    () => ProductWarehouse,
    (productWarehouse) => productWarehouse.product,
  )
  productWarehouses: ProductWarehouse[];
  @OneToMany(() => Production, (production) => production.product)
  productions: Production[];

  ToJSON() {
    return {
      id: this.id,
      name: this.name,
      code: this.code,
      price: this.price,
      category: this.category ? this.category.ToBasicJSON() : null,
      size: this.size ? this.size.ToJSON() : null,
      productWarehouse: this.productWarehouses
        ? this.productWarehouses.map((productWarehouse) =>
            productWarehouse.ToBasicJSON(),
          )
        : [],
      stockInventory: this.stockInventory,
      stockStore: this.stockStore,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }

  ToBasicJSON() {
    return {
      id: this.id,
      name: this.name,
      code: this.code,
      price: this.price,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}
