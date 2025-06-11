// src/app.module.ts (CORRECT STATE)
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuizModule } from './quiz/quiz.module';
import { User } from './quiz/entities/user.entity';
import { AuthModule } from './auth/auth.module'; // This is correct
import { Question } from './quiz/entities/question.entity';
import { StudentResponse } from './quiz/entities/student-response.entity';
import { Option } from './quiz/entities/option.entity';
import * as path from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, Question, Option, StudentResponse],
      synchronize: true,
      migrations: [path.join(__dirname, 'migrations', '**', '*.ts')],
      migrationsRun: false,
    }),
    QuizModule,
    AuthModule, // This is how AuthModule is brought into the app
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
