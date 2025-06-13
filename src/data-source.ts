// src/data-source.ts

// connecting to the database via psql CLI:
// psql postgresql://mrdei_self_awareness_service_user:pDF23AKLd08RXBbSWkOMbOygASTbE5Mm@dpg-d14dbsp5pdvs73f2ibmg-a.frankfurt-postgres.render.com/mrdei_self_awareness_service
import { DataSource } from 'typeorm';
import { User as QuizTakerUser } from './quiz/entities/user.entity';
import { User as DashboardUser } from './auth/entities/user.entity';

import { Question } from './quiz/entities/question.entity';
import { Option } from './quiz/entities/option.entity';
import { StudentResponse } from './quiz/entities/student-response.entity';
import { QuizSubmission } from './quiz/entities/quiz-submission.entity';
import * as dotenv from 'dotenv';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: true,
  entities: [
    QuizTakerUser,
    DashboardUser,
    Question,
    Option,
    StudentResponse,
    QuizSubmission,
  ],
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
  // Add SSL if connecting to Render.com like your app.module.ts
  ssl: {
    rejectUnauthorized: false,
  },
});
