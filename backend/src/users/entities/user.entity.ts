import { Exclude } from 'class-transformer';
import { IsEmail } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Account } from '../../accounts/entities/account.entity';
import { Role } from '../enums/role.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'first_name' })
  firstName!: string;

  @Column({ name: 'last_name' })
  lastName!: string;

  @Column({ unique: true })
  username!: string;

  @IsEmail()
  @Column({ unique: true })
  email!: string;

  @Exclude()
  @Column()
  password!: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role!: Role;

  @Exclude()
  @Column({ name: 'hashed_refresh_token', type: 'varchar', nullable: true })
  hashedRefreshToken!: string | null;

  @OneToMany(() => Account, (account) => account.user)
  accounts!: Account[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
