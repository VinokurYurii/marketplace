import { Entity, Column, Index } from 'typeorm';
import { Exclude } from 'class-transformer';

import { BaseEntity } from '../../common/entities/base-entity'

export enum UserRole {
  admin = 'admin',
  parent = 'parent',
  businessOwner = 'businessOwner',
}

export enum AuthType {
  web = 'web',
  google = 'google',
  facebook = 'facebook'
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

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  @Exclude()
  password: string;

  @Index()
  @Column({ nullable: true })
  mailConfirmationHashString: string;

  @Index()
  @Column({ nullable: true })
  googleId: string;

  @Column({ default: false })
  emailConfirmed: boolean;

  @Column('simple-enum', { enum: AuthType })
  authType: AuthType;
}
