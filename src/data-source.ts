// src/data-source.ts
import { DataSource } from 'typeorm';
import * as path from 'path';
import { User } from '@app/quiz/entities/user.entity';
import { Question } from './quiz/entities/question.entity';
import { Option } from './quiz/entities/option.entity';
import { StudentResponse } from './quiz/entities/student-response.entity';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'db.sqlite', // Match your app.module.ts database path
  entities: [User, Question, Option, StudentResponse],
  migrations: [path.join(__dirname, 'migrations', '**', '*.ts')],
  synchronize: false, // Ensure this is also false
  logging: true, // Optional: to see SQL queries from CLI
});

// This file is only used by the TypeORM CLI commands (migration:generate, migration:run)
// Your NestJS application uses the configuration in app.module.ts
