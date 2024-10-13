import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn, OneToMany
} from "typeorm";
import { Order } from "../order/order.entity";

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

  @Column({ name: 'u_last_login', nullable: true })
  lastLogin: Date;

  @Column({
    name: 'u_rol',
    type: 'enum',
    enum: ['admin', 'user'],
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

  ToJSON() {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      username: this.username,
      role: this.role,
      status: this.status
    }
  }
}
