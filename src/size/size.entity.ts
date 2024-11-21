import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Category } from '../category/category.entity';
import { Product } from '../product/product.entity';
import { CategoryToSize } from '../category/categorySize.entity';

@Entity()
export class Size {
  @Column({ name: 'si_id' })
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'si_name' })
  name: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Product, (product) => product.size)
  products: Product[];

  @OneToMany(() => CategoryToSize, (categorySize) => categorySize.size)
  categorySizes: CategoryToSize[];

  ToJSON() {
    return {
      id: this.id,
      name: this.name,
    };
  }
}
