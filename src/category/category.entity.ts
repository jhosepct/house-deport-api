import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Size } from '../size/size.entity';
import { Product } from '../product/product.entity';

@Entity()
export class Category {
  @Column({ name: 'c_id' })
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'c_name' })
  name: string;

  @OneToMany(() => Size, (size) => size.category)
  sizes: Size[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  ToJSON() {
    return {
      id: this.id,
      name: this.name,
      sizes: this.sizes ? this.sizes.map((size) => size.ToJSON()) : null,
    };
  }

  ToBasicJSON() {
    return {
      id: this.id,
      name: this.name,
    };
  }
}
