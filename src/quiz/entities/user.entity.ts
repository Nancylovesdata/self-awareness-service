// src/auth/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { StudentResponse } from '../../quiz/entities/student-response.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true }) // <-- RENAME username to email
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true }) // <-- REMOVE unique constraint
  phoneNumber: string;

  @OneToMany(() => StudentResponse, (studentResponse) => studentResponse.user)
  studentResponses: StudentResponse[];
}
