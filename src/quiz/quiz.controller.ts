// src/quiz/quiz.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  // Removed UseGuards here
  // Removed Request here, as it's not needed without auth for user info
  Param,
  NotFoundException,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // <-- No longer needed
import { Question } from './entities/question.entity';
import { SubmitAnswersDto } from './dto/submit-answers.dto';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get('questions')
  async getQuestions(): Promise<Question[]> {
    return this.quizService.getQuestions();
  }

  @Post('submit-answers') // <-- Removed @UseGuards
  async submitAnswers(
    @Body() submitAnswersDto: SubmitAnswersDto,
    // @Request() req, // <-- Removed this parameter
  ) {
    // If no authentication, we cannot get userId or fullName from req.user
    // The QuizSubmission entity takes userName and phoneNumber directly from DTO.
    // However, StudentResponse still needs a userId, which will require a change below.

    // For now, if no auth, we'll pass null or a placeholder for userId to service.
    // This will lead to an error unless we make changes to StudentResponse's userId.
    const userId = null; // We can't get a user ID from an authenticated user
    // fullName is now directly available as submitAnswersDto.userName

    return {
      message: 'Quiz submitted successfully!',
      data: await this.quizService.submitAnswers(
        submitAnswersDto,
        // userId, // We need to address this in QuizService as it's a non-nullable foreign key
      ),
    };
  }

  @Get('submissions/:id')
  async getQuizSubmissionById(@Param('id') submissionId: string) {
    try {
      const submission =
        await this.quizService.getQuizSubmissionById(submissionId);
      return {
        message: 'Quiz submission found.',
        data: submission,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw error;
    }
  }
}
