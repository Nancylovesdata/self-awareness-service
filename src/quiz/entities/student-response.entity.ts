// src/quiz/entities/student-response.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '@app/quiz/entities/user.entity'; // Path to your User entity
import { Question } from './question.entity';
import { Option } from './option.entity';

@Entity('student_response')
export class StudentResponse {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.studentResponses, { nullable: true }) // <-- ADD { nullable: true }
  @JoinColumn({ name: 'userId' })
  user: User; // Changed from userId: number to user: User

  // The actual foreign key column. It should also be nullable now.
  @Column({ type: 'integer', nullable: true }) // <-- ADD { nullable: true }
  userId: number; // This remains for the column itself

  @ManyToOne(() => Question, (question) => question.studentResponses)
  @JoinColumn({ name: 'questionId' })
  question: Question;

  @ManyToOne(() => Option, (option) => option.studentResponses)
  @JoinColumn({ name: 'selectedOptionId' })
  selectedOption: Option;

  @Column()
  selectedOptionCorrespondence: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) // <-- Changed 'datetime' to 'timestamp'
  timestamp: Date;
}
