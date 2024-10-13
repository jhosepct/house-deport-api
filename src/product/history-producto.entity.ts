import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class HistoryProduct {
  @Column({ name: 'hp_id' })
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'p_id' })
  productId: number;

  @Column({ name: 'p_name' })
  name: string;

  @Column({ name: 'p_code' })
  code: string;

  @Column({ name: 'c_id' })
  categoryId: number;

  @Column({ name: 's_id' })
  sizeId: number;

  @Column({ name: 'p_stock_inventory', type: 'integer' })
  stockInventory: number;

  @Column({ name: 'p_stock_store', type: 'integer' })
  stockStore: number;

  @Column({
    name: 'hp_action',
    type: 'enum',
    enum: ['create', 'update', 'delete'],
  })
  action: string;

  @Column({ name: 'hp_changes', type: 'text', nullable: true })
  changes: string;

  @Column({ name: 'u_id', nullable: true })
  userId: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
