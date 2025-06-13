/* eslint-disable prettier/prettier */
// src/quiz/quiz.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards, // <--- Already there
  Param,
  NotFoundException,
  Delete, // <--- ADDED: For DELETE requests
  HttpCode, // <--- ADDED: For setting HTTP status codes
  HttpStatus, // <--- ADDED: For using HTTP status enums
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Question } from './entities/question.entity';
import { SubmitAnswersDto } from './dto/submit-answers.dto';
import { QuizResultDto } from './dto/quiz-result.dto'; // Needed for FullQuizSubmissionResponse type

// Define a new type for the full quiz submission response to be explicit
type FullQuizSubmissionResponse = QuizResultDto & {
  submissionId: string;
  submissionDate: string;
  userName: string;
  phoneNumber: string;
  quizTitle: string;
};

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
  ): Promise<{ message: string; data: FullQuizSubmissionResponse }> { // Explicit return type
    return {
      message: 'Quiz submitted successfully!',
      data: await this.quizService.submitAnswers(submitAnswersDto),
    };
  }

  // --- EXISTING ENDPOINT FOR ALL SUBMISSIONS ---
  @UseGuards(JwtAuthGuard) // Protect this endpoint with JWT authentication
  @Get('submissions') // This is the endpoint for getting ALL submissions
  async findAllQuizSubmissions(): Promise<FullQuizSubmissionResponse[]> { // Explicit return type
    // 'req' is used here to ensure JwtAuthGuard runs
    // You could optionally add RolesGuard here if only specific roles (e.g., admin)
    // should be able to see all submissions. For now, any authenticated user can.
    return this.quizService.findAllQuizSubmissions();
  }
  // --- END EXISTING ENDPOINT ---

  @Get('submissions/:id')
  async getQuizSubmissionById(@Param('id') submissionId: string): Promise<{ message: string; data: FullQuizSubmissionResponse }> { // Explicit return type
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

  /**
   * NEW: DELETE endpoint to delete a single quiz submission by ID.
   * Path: DELETE /quiz/submissions/:id
   * Protected with JwtAuthGuard.
   */
  @UseGuards(JwtAuthGuard) // Only authenticated users can delete a single submission
  @Delete('submissions/:id')
  @HttpCode(HttpStatus.NO_CONTENT) // Respond with 204 No Content on successful deletion
  async deleteSubmission(@Param('id') submissionId: string): Promise<void> {
    await this.quizService.deleteSubmissionById(submissionId);
    // NestJS will automatically send a 204 No Content response if nothing is returned.
  }


  /**
   * EXISTING: DELETE endpoint to delete all quiz submissions.
   * Path: DELETE /quiz/submissions/all
   * IMPORTANT: Be careful with this endpoint in production environments!
   * Protected with JwtAuthGuard. Consider adding RolesGuard for admin-only access.
   */
  @UseGuards(JwtAuthGuard) // Only authenticated users can delete all submissions
  @Delete('submissions/all')
  @HttpCode(HttpStatus.OK) // Respond with 200 OK and a message
  async deleteAllSubmissions(): Promise<{ message: string; deletedCount: number }> {
    const result = await this.quizService.deleteAllSubmissions();
    return result; // Return the message and count from the service
  }
}