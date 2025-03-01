import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Order } from '../order/order.entity';

@Entity()
export class Client {
  @Column({ name: 'c_id' })
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'c_first_name' })
  firstName: string;

  @Column({ name: 'c_last_name' })
  lastName: string;

  @Column({ name: 'c_phone' })
  phone: string;

  @Column({ name: 'c_email' })
  email: string;

  @Column({ name: 'c_address' })
  address: string;

  @Column({
    name: 'c_number_document',
  })
  numberDocument: string;

  @Column({
    name: 'c_type_document',
    type: 'enum',
    enum: ['DNI', 'RUC', ''],
    default: '',
  })
  typeDocument: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: ['active', 'inactive'],
    default: 'active',
  })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Order, (order) => order.client)
  orders: Order[];

  ToJSON() {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      phone: this.phone,
      email: this.email,
      address: this.address,
      numberDocument: this.numberDocument,
      typeDocument: this.typeDocument,
      status: this.status,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}
