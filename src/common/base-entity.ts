import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { Allow } from 'class-validator';

export abstract class BaseEntity {
  @Expose()
  @Allow({ always: true })
  @PrimaryGeneratedColumn() id: number;

  @Index()
  @CreateDateColumn()
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn()
  deletedAt: Date;
}
