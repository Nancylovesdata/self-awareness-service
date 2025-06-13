// src/quiz/entities/quiz-submission.entity.ts

import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  BeforeInsert,
  ValueTransformer, // <--- ADD THIS IMPORT
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

// Define the JSON transformer
const jsonTransformer: ValueTransformer = {
  from: (value: string | null) => {
    // When reading from the database (text column)
    if (value === null || value === undefined) {
      return null;
    }
    try {
      return JSON.parse(value);
    } catch (e) {
      console.error("Failed to parse JSON from DB for 'scores':", value, e);
      // Depending on your error handling preference, you might return null,
      // an empty object, or re-throw the error. Returning null is safer for now.
      return null;
    }
  },
  to: (value: any) => {
    // When writing to the database (text column)
    if (value === null || value === undefined) {
      return null;
    }
    try {
      return JSON.stringify(value);
    } catch (e) {
      console.error("Failed to stringify JSON for DB for 'scores':", value, e);
      // Similar error handling as above
      return null;
    }
  },
};

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

  // Apply the transformer here:
  @Column({ type: 'text', transformer: jsonTransformer }) // <--- CHANGE IS HERE
  scores: { A: number; D: number; N: number; C: number }; // <--- Keep this as the object type now

  @Column()
  publicSpeakingPersonalityType: string;

  @Column()
  publicSpeakingPersonalityMeaning: string;

  @Column()
  quizTitle: string;

  @BeforeInsert()
  generateSubmissionId() {
    if (!this.submissionId) {
      this.submissionId = uuidv4();
    }
  }
}
