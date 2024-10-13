import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne, JoinColumn
} from "typeorm";
import { Client } from '../client/client.entity';
import { User } from '../user/user.entity';

@Entity()
export class Order {
  @Column({ name: 'or_id' })
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'or_num_fac', unique: true })
  numFac: string;

  @ManyToOne(() => Client, (client) => client.orders)
  @JoinColumn({ name: 'c_id' })
  client: Client;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'u_id' })
  user: User;

  @Column({ name: 'or_date', type: 'date' })
  date: Date;

  @Column({ name: 'or_subtotal', type: 'double precision' })
  subtotal: number;

  @Column({ name: 'or_tax', type: 'double precision' })
  tax: number;

  @Column({ name: 'or_discount', type: 'double precision' })
  discount: number;

  @Column({
    name: 'or_status',
    type: 'enum',
    enum: ['pending', 'completed', 'canceled'],
  })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
