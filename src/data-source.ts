// src/data-source.ts
import { DataSource } from 'typeorm';

// Alias the existing User entity (for quiz takers)
import { User as QuizTakerUser } from './quiz/entities/user.entity';

// Import and alias the NEW User entity (for dashboard users)
import { User as DashboardUser } from './auth/entities/user.entity';

import { Question } from './quiz/entities/question.entity';
import { Option } from './quiz/entities/option.entity';
import { StudentResponse } from './quiz/entities/student-response.entity';
import { QuizSubmission } from './quiz/entities/quiz-submission.entity'; // Assuming QuizSubmission is the correct name

// IMPORTANT: This needs to load environment variables for the CLI
// If you are running this locally, you might need 'dotenv' package
// If you are using ts-node and tsconfig-paths, it might be fine.
import * as dotenv from 'dotenv';
dotenv.config(); // Load .env file manually for TypeORM CLI

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL, // <--- USE YOUR DATABASE_URL
  synchronize: false, // Keep this as false for migration-based workflow
  logging: true,
  entities: [
    QuizTakerUser, // Your existing User entity (for quiz takers)
    DashboardUser, // Your new User entity (for dashboard users)
    Question,
    Option,
    StudentResponse,
    QuizSubmission,
  ],
  migrations: ['src/migrations/*.ts'], // Make sure this path is correct
  subscribers: [],
  // Add SSL if connecting to Render.com like your app.module.ts
  ssl: {
    rejectUnauthorized: false,
  },
});
