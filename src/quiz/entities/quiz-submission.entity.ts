/* eslint-disable prettier/prettier */
// src/quiz/entities/quiz-submission.entity.ts

import {
  Entity,
  PrimaryColumn, // Keep PrimaryColumn
  Column,
  CreateDateColumn,
  BeforeInsert, // Keep BeforeInsert
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid'; // Keep uuidv4 import

@Entity('quiz_submissions')
export class QuizSubmission {
  @PrimaryColumn({ type: 'uuid' })
  submissionId: string;

  @Column()
  userName: string;

  @Column()
  phoneNumber: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  submissionDate: Date;

  @Column({ type: 'text' }) // Changed 'jsonb' to 'text' for SQLite compatibility
  scores: { A: number; D: number; N: number; C: number };

  @Column()
  publicSpeakingPersonalityType: string;

  @Column()
  publicSpeakingPersonalityMeaning: string;

  @Column() // <--- ADD THIS LINE: quizTitle column
  quizTitle: string; // <--- ADD THIS LINE: quizTitle property

  @BeforeInsert()
  generateSubmissionId() {
    if (!this.submissionId) {
      this.submissionId = uuidv4();
    }
  }
}
