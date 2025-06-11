// src/quiz/quiz.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { Question } from './entities/question.entity';
import { Option } from './entities/option.entity';
import { StudentResponse } from './entities/student-response.entity';
import { User } from './entities/user.entity'; // <-- NEW: Import User entity

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Question,
      Option,
      StudentResponse,
      User, // <-- NEW: Add User entity here
    ]),
  ],
  controllers: [QuizController],
  providers: [QuizService],
  // exports: [TypeOrmModule], // You generally don't need to export TypeOrmModule itself unless another module directly imports this module and needs to use TypeOrmModule from it.
})
export class QuizModule {}
