import { Entity, Column, Index } from 'typeorm';
import { Exclude } from 'class-transformer';

import { BaseEntity } from '../../common/entities/base-entity'

export enum UserRole {
  admin = 'admin',
  parent = 'parent',
  businessOwner = 'businessOwner',
}

@Entity()
export class User extends BaseEntity {
  static readonly userRoles = {
    publicCreateAllowed: [UserRole.parent, UserRole.businessOwner],
    all: Object.values(UserRole)
  };

  @Column('simple-enum', { enum: UserRole, default: UserRole.parent })
  role: UserRole;

  @Index()
  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phone: string;

  @Column()
  @Exclude()
  password: string;

  @Index()
  @Column()
  mailConfirmationHashString: string;

  @Column({ default: false })
  mailConfirmed: boolean;
}
