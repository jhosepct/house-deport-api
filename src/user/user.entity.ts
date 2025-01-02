import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Order } from '../order/order.entity';
import { Production } from '../production/production.entity';

@Entity()
export class User {
  @Column({ name: 'u_id' })
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'u_first_name' })
  firstName: string;

  @Column({ name: 'u_last_name' })
  lastName: string;

  @Column({ name: 'u_username', unique: true })
  username: string;

  @Column({ name: 'u_email', unique: true })
  email: string;

  @Column({ name: 'u_password' })
  password: string;

  @Column({ name: 'u_last_login', nullable: true, default: null })
  lastSession: Date;

  @Column({ name: 'u_gender', type: 'enum', enum: ['MALE', 'FEMALE'] })
  gender: string;

  @Column({
    name: 'u_rol',
    type: 'enum',
    enum: ['admin', 'warehouse', 'sales', 'user', 'production'],
    default: 'user',
  })
  role: string;

  @Column({
    name: 'u_status',
    type: 'enum',
    enum: ['active', 'inactive'],
    default: 'active',
  })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Production, (production) => production.user_order)
  orderedProductions: Production[];

  @OneToMany(() => Production, (production) => production.user_receive_order)
  receivedProductions: Production[];
  ToJSON() {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      username: this.username,
      gender: this.gender,
      role: this.role,
      lastSession: this.lastSession,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}
