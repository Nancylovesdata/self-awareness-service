// src/quiz/quiz.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { Question } from './entities/question.entity';
import { Option } from './entities/option.entity';
import { StudentResponse } from './entities/student-response.entity';
// import { User } from './entities/user.entity'; // This line should be commented out or removed
import { QuizSubmission } from './entities/quiz-submission.entity'; // <-- Ensure this is imported

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Question,
      Option,
      StudentResponse,
   
      QuizSubmission, // <-- ENSURE THIS LINE IS PRESENT AND UNCOMMENTED!
    ]),
  ],
  controllers: [QuizController],
  providers: [QuizService],
  exports: [QuizService],
})
export class QuizModule {}