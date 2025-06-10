// src/quiz/entities/question.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  // REMOVE nullable: false AND default: []
  // The type should already be 'json'
  @Column({ type: 'json' }) // <-- CHANGE THIS LINE
  options: { text: string; correspondence: string }[];
}
