// src/quiz/quiz.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { Question } from './entities/question.entity';
import { StudentResponse } from './entities/student-response.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Question, StudentResponse])], // Register entities with this module
  providers: [QuizService], // Register the service
  controllers: [QuizController], // Register the controller
})
export class QuizModule {}
