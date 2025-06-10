// src/quiz/entities/question.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'; // Add OneToMany
import { Option } from './option.entity'; // Import the Option entity

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @OneToMany(() => Option, (option) => option.question, { cascade: true }) // One question has many options
  // { cascade: true } means if you save a Question, its new Options will also be saved.
  // If you delete a Question, its Options might also be deleted (depending on database ON DELETE CASCADE rules).
  options: Option[]; // This defines the relationship
}
