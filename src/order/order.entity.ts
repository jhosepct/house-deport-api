import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne, JoinColumn, OneToMany
} from "typeorm";
import { Client } from '../client/client.entity';
import { User } from '../user/user.entity';
import { OrderDetail } from "./order-detail.entity";

@Entity()
export class Order {
  @Column({ name: 'or_id' })
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'or_num_fac', unique: true, nullable: true })
  numFac: string;

  @ManyToOne(() => Client, (client) => client.orders)
  @JoinColumn({ name: 'c_id' })
  client: Client;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'u_id' })
  user: User;

  @Column({ name: 'or_date', type: 'date', nullable: true })
  date: Date;

  @Column({ name: 'or_subtotal', type: 'double precision', default: 0 })
  subtotal: number;

  @Column({ name: 'or_tax', type: 'double precision', default: 0 })
  tax: number;

  @Column({ name: 'or_discount', type: 'double precision', default: 0 })
  discount: number;

  @Column({ name: 'or_total', type: 'double precision', default: 0 })
  total: number;

  @Column({
    name: 'or_status',
    type: 'enum',
    default: 'pending',
    enum: ['pending', 'completed', 'canceled'],
  })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order)
  orderDetails: OrderDetail[];

  ToJSON() {
    return {
      id: this.id,
      numFac: this.numFac,
      client: this.client ? this.client.ToJSON() : null,
      user: this.user ? this.user.ToJSON() : null,
      date: this.date,
      subtotal: this.subtotal,
      total: this.total / 100,
      tax: this.tax / 100,
      status: this.status,
      details: this.orderDetails ? this.orderDetails.map((detail) => detail.ToJSON()) : null,
    };
  }
}
