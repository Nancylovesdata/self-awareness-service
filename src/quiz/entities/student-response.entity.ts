// src/quiz/entities/student-response.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Question } from '@app/quiz/entities/question.entity';
import { User } from '@app/quiz/entities/user.entity'; // <-- IMPORT USER ENTITY HERE

@Entity()
export class StudentResponse {
  @PrimaryGeneratedColumn()
  id: number;

  // You can keep studentId for legacy/non-logged-in users if needed,
  // but if all responses MUST be linked to a User, this can be removed or made nullable.
  // For now, let's keep it to support both.
  @Column({ nullable: true })
  studentId: string;

  @ManyToOne(() => Question)
  @JoinColumn({ name: 'questionId' })
  question: Question;

  @Column()
  selectedOptionCorrespondence: string;

  @Column({ type: 'datetime', default: 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  // --- ADD THESE LINES FOR THE USER RELATIONSHIP ---
  @ManyToOne(() => User, (user) => user.studentResponses, {
    nullable: true, // A response might not always be linked to a registered user if you allow guest submissions
    onDelete: 'SET NULL', // Optional: What happens if a user is deleted? (SET NULL, CASCADE, RESTRICT)
  })
  @JoinColumn({ name: 'userId' }) // This creates the foreign key column 'userId' in StudentResponse table
  user: User; // The actual property that holds the User object

  @Column({ nullable: true }) // The foreign key column itself
  userId: number;
  // --- END ADDITIONS ---
}
