// src/auth/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('dashboard_users') // You can name the table 'users' or 'dashboard_users'
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true }) // Username should be unique
  username: string;

  @Column()
  password: string; // This will store the HASHED password

  @Column({ default: 'user' }) // You can add a 'role' column (e.g., 'admin', 'user')
  role: string;
}
