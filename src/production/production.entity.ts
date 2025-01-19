import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Product } from '../product/product.entity';

@Entity()
export class Production {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ['pending', 'completed', 'canceled'],
    default: 'pending',
  })
  status: string;

  @ManyToOne(() => User, (user) => user.orderedProductions)
  @JoinColumn({ name: 'user_order_id' })
  user_order: User;

  @Column()
  quantity: number;

  @ManyToOne(() => Product, (product) => product.productions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' }) // Asegúrate de usar el nombre correcto de la columna
  product: Product;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  ToJSON() {
    return {
      id: this.id,
      status: this.status,
      user_order: this.user_order ? this.user_order.ToJSON() : null,
      quantity: this.quantity,
      product: this.product ? this.product.ToJSON() : null,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}
