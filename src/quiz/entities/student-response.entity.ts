/* eslint-disable prettier/prettier */
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
import { QuizSubmission } from './quiz-submission.entity'; // <--- ADDED: Import QuizSubmission

@Entity('student_response')
export class StudentResponse {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.studentResponses, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'integer', nullable: true })
  userId: number;

  @ManyToOne(() => Question, (question) => question.studentResponses)
  @JoinColumn({ name: 'questionId' })
  question: Question;

  @ManyToOne(() => Option, (option) => option.studentResponses)
  @JoinColumn({ name: 'selectedOptionId' })
  selectedOption: Option;

  @Column()
  selectedOptionCorrespondence: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  // --- NEW: Many-to-One relationship to QuizSubmission ---
  // Each StudentResponse belongs to one QuizSubmission.
  // 'quizSubmission => quizSubmission.studentResponses' links to the 'studentResponses' property in QuizSubmission.
  @ManyToOne(() => QuizSubmission, (quizSubmission) => quizSubmission.studentResponses, {
    nullable: false, // A student response must belong to a quiz submission
    onDelete: 'CASCADE', // Also include CASCADE here for safety and clarity
  })
  @JoinColumn({ name: 'submissionId' }) // This specifies the foreign key column name in the 'student_response' table
  quizSubmission: QuizSubmission; // The relation property

  // This column explicitly stores the foreign key value.
  // Its type should match the primary key type of QuizSubmission (UUID).
  @Column({ type: 'uuid' })
  submissionId: string; // The actual foreign key column
}