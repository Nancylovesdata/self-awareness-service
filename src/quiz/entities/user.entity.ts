// src/auth/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { StudentResponse } from '@app/quiz/entities/student-response.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  fullName: string;

  @Column({ nullable: true }) // Added phone number column, made nullable
  phoneNumber: string;

  @OneToMany(() => StudentResponse, (studentResponse) => studentResponse.user)
  studentResponses: StudentResponse[];
}
