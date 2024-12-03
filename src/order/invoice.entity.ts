import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Invoice {
  @Column({ name: 'in_id' })
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'in_num_fac', unique: true, nullable: true })
  numFac: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  ToJSON() {
    return {
      id: this.id,
      numFac: this.numFac,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}
