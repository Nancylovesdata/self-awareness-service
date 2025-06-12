// src/quiz/quiz.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards, // <--- ADDED: Needed for JwtAuthGuard
  Request, // <--- ADDED: Needed to access req.user
  Param,
  NotFoundException,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // <--- ADDED: For protecting routes
import { Question } from './entities/question.entity';
import { SubmitAnswersDto } from './dto/submit-answers.dto';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get('questions')
  async getQuestions(): Promise<Question[]> {
    return this.quizService.getQuestions();
  }

  @Post('submit-answers')
  // NOTE: If you want to associate submissions with authenticated users,
  // you will need to add @UseGuards(JwtAuthGuard) here and pass req.user.userId.
  // Currently, it's public.
  async submitAnswers(
    @Body() submitAnswersDto: SubmitAnswersDto,
    // @Request() req, // If you add JwtAuthGuard, uncomment this and use req.user.userId
  ) {
    // Current userId is null, which will cause issues if QuizSubmission.user is a non-nullable foreign key.
    // Consider adding @UseGuards(JwtAuthGuard) and passing req.user.userId here.
    // For now, removing the problematic userId variable.
    return {
      message: 'Quiz submitted successfully!',
      data: await this.quizService.submitAnswers(submitAnswersDto),
    };
  }

  // --- NEW ENDPOINT ADDED HERE ---
  @UseGuards(JwtAuthGuard) // Protect this endpoint with JWT authentication
  @Get('submissions') // This is the endpoint for getting ALL submissions
  async findAllQuizSubmissions(@Request() req) {
    // 'req' is used here to ensure JwtAuthGuard runs
    // You could optionally add RolesGuard here if only specific roles (e.g., admin)
    // should be able to see all submissions. For now, any authenticated user can.
    return this.quizService.findAllQuizSubmissions();
  }
  // --- END NEW ENDPOINT ---

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
