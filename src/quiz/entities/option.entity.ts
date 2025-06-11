// src/quiz/entities/option.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm'; // Import OneToMany
import { Question } from './question.entity';
import { StudentResponse } from './student-response.entity'; // Import StudentResponse entity

@Entity()
export class Option {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column()
  correspondence: string; // 'A', 'D', 'N', 'C'

  @ManyToOne(() => Question, (question) => question.options, {
    onDelete: 'CASCADE',
  })
  question: Question;

  // NEW: Add the OneToMany relationship to StudentResponse
  @OneToMany(
    () => StudentResponse,
    (studentResponse) => studentResponse.selectedOption,
  )
  studentResponses: StudentResponse[]; // This is the property the error was complaining about
}
