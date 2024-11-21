import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Category } from "./category.entity";
import { Size } from "../size/size.entity";

@Entity()
export class CategoryToSize {
  @Column({ name: 'cs_id' })
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Category, (category) => category.categorySizes)
  @JoinColumn({ name: 'ca_id' })
  category: Category;

  @ManyToOne(() => Size, (size) => size.categorySizes)
  @JoinColumn({ name: 'si_id' })
  size: Size;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  ToJSON() {
    return {
      id: this.id,
      category: this.category.ToBasicJSON(),
      size: this.size.ToJSON(),
    };
  }
}