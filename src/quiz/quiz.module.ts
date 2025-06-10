// src/quiz/quiz.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { Question } from './entities/question.entity';
import { Option } from './entities/option.entity'; // <-- Add this import
import { StudentResponse } from './entities/student-response.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Question, Option, StudentResponse])], // <-- Add Option here
  controllers: [QuizController],
  providers: [QuizService],
  exports: [TypeOrmModule], // Consider exporting TypeOrmModule if other modules need to use Quiz entities
})
export class QuizModule {}
