// src/quiz/entities/option.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Question } from './question.entity'; // Import the Question entity

@Entity()
export class Option {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string; // e.g., "Always"

  @Column()
  correspondence: string; // e.g., "A", "D", "N", "C"

  @ManyToOne(() => Question, (question) => question.options) // Many options to one question
  question: Question;

  @Column() // To store the foreign key (questionId)
  questionId: number;
}
