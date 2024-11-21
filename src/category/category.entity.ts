import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Product } from '../product/product.entity';
import { CategoryToSize } from './categorySize.entity';

@Entity()
export class Category {
  @Column({ name: 'c_id' })
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'c_name' })
  name: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  @OneToMany(() => CategoryToSize, (categorySize) => categorySize.category)
  categorySizes: CategoryToSize[];

  ToJSON() {
    return {
      id: this.id,
      name: this.name,
      sizes: this.categorySizes.map((categorySize) =>
        categorySize.size.ToJSON(),
      ),
    };
  }

  ToBasicJSON() {
    return {
      id: this.id,
      name: this.name,
    };
  }
}
