// src/quiz/entities/question.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Option } from './option.entity';
import { StudentResponse } from './student-response.entity'; // <-- Import StudentResponse here

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  // Existing relationship with Options
  @OneToMany(() => Option, (option) => option.question, { cascade: true })
  options: Option[];

  // Add this new relationship to StudentResponse
  @OneToMany(
    () => StudentResponse,
    (studentResponse) => studentResponse.question,
  )
  studentResponses: StudentResponse[]; // <-- Add this property
}
