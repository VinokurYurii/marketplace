import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../common/base-entity'

export enum UserRole {
  admin = 'admin',
  parent = 'parent',
  businessOwner = 'businessOwner'
}

@Entity()
export class User extends BaseEntity {
  @Column('simple-enum', { enum: UserRole, default: UserRole.parent })
  role: UserRole;

  @Column({nullable: false, unique: true})
  email: string;

  @Column({nullable: false})
  firstName: string;

  @Column({nullable: false})
  lastName: string;

  @Column({nullable: false, unique: true})
  phone: string;

  @Column({nullable: false})
  birthDay: Date;

  @Column({nullable: false, default: ''})
  password: string;

  @Index()
  @Column()
  mailConfirmationHashString: string;

  @Column({nullable: false, default: false})
  mailConfirmed: boolean;
}
