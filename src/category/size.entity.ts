import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne, OneToMany, JoinColumn
} from "typeorm";
import { Category } from './category.entity';
import { Product } from "../product/product.entity";

@Entity()
export class Size {
  @Column({ name: 'si_id' })
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Category, (category) => category.sizes)
  @JoinColumn({ name: 'ca_id' })
  category: Category;

  @Column({ name: 'si_name' })
  name: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Product, (product) => product.size)
  products: Product[];
}
