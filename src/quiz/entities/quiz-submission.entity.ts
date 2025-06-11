// src/quiz/entities/quiz-submission.entity.ts

import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  BeforeInsert,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('quiz_submissions')
export class QuizSubmission {
  @PrimaryColumn({ type: 'uuid' })
  submissionId: string;

  @Column()
  userName: string;

  @Column()
  phoneNumber: string;
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) // <-- Changed 'datetime' to 'timestamp'
  submissionDate: Date;
  // --- CHANGE THIS LINE FOR SCORES ---
  @Column({ type: 'text' }) // Changed 'jsonb' to 'text' for SQLite compatibility
  scores: { A: number; D: number; N: number; C: number };
  // --- END CHANGE ---

  @Column()
  publicSpeakingPersonalityType: string;

  @Column()
  publicSpeakingPersonalityMeaning: string;

  @BeforeInsert()
  generateSubmissionId() {
    if (!this.submissionId) {
      this.submissionId = uuidv4();
    }
  }
}
