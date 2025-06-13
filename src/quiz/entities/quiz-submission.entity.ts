/* eslint-disable prettier/prettier */
// src/quiz/entities/quiz-submission.entity.ts

import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  BeforeInsert,
  OneToMany, // <--- ADDED: Import OneToMany
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { StudentResponse } from './student-response.entity'; // <--- ADDED: Import StudentResponse

@Entity('quiz_submissions') // Changed from 'quiz_submission' to 'quiz_submissions' based on common plural naming or your preference
export class QuizSubmission {
  @PrimaryColumn({ type: 'uuid' })
  submissionId: string;

  @Column()
  userName: string;

  @Column()
  phoneNumber: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  submissionDate: Date;

  // Recommended for JSON-like objects in SQLite for automatic serialization/deserialization
  @Column({ type: 'simple-json' }) // <--- CHANGED: Use 'simple-json' for JSON objects with SQLite
  scores: { A: number; D: number; N: number; C: number };

  @Column()
  publicSpeakingPersonalityType: string;

  @Column()
  publicSpeakingPersonalityMeaning: string;

  @Column()
  quizTitle: string; // Correctly defined as a Column

  // --- NEW: One-to-Many relationship to StudentResponse ---
  // This defines that one QuizSubmission can have many StudentResponses.
  // 'studentResponse => studentResponse.quizSubmission' links to the 'quizSubmission' property in StudentResponse.
  // 'cascade: true' means that if you save a QuizSubmission, its related StudentResponses will also be saved.
  // 'onDelete: 'CASCADE'' means that if a QuizSubmission is deleted, all associated StudentResponses will also be deleted by the database.
  @OneToMany(() => StudentResponse, (studentResponse) => studentResponse.quizSubmission, {
    cascade: ['insert', 'update'], // Cascade inserts/updates when saving QuizSubmission
    onDelete: 'CASCADE', // Database-level cascade delete
    nullable: true, // A submission might not have responses yet if created without them (though less likely in this flow)
  })
  studentResponses: StudentResponse[]; // <--- CHANGED: Correctly typed as an array of StudentResponse entities

  @BeforeInsert()
  generateSubmissionId() {
    if (!this.submissionId) {
      this.submissionId = uuidv4();
    }
  }
}