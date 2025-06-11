// src/quiz/entities/student-response.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Question } from './question.entity';
import { User } from '@app/quiz/entities/user.entity'; // Import User entity (confirm this path/alias)
import { Option } from './option.entity'; // <-- NEW: Import Option entity here!

@Entity()
export class StudentResponse {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.studentResponses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User; // This will hold the User object

  @Column()
  userId: number; // This column stores the ID of the user

  @ManyToOne(() => Question, (question) => question.studentResponses)
  @JoinColumn({ name: 'questionId' }) // Added for consistency, if you have a questionId column
  question: Question;

  @Column() // Added for consistency, if you have a questionId column
  questionId: number; // The actual foreign key column for Question

  // *** START NEWLY ADDED/CORRECTED SECTION ***
  @ManyToOne(() => Option, (option) => option.studentResponses, {
    onDelete: 'CASCADE', // Optional: if option is deleted, delete this response
  })
  @JoinColumn({ name: 'selectedOptionId' }) // This links the selectedOptionId column to the Option's primary key
  selectedOption: Option; // This will hold the Option object

  @Column() // Keep the column for the foreign key, if you want it explicitly
  selectedOptionId: number; // This column stores the ID of the selected option
  // *** END NEWLY ADDED/CORRECTED SECTION ***

  @Column()
  selectedOptionCorrespondence: string;

  @CreateDateColumn()
  timestamp: Date;
}
