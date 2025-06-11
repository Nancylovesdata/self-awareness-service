// src/quiz/quiz.controller.ts (CORRECTED)
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { SubmitAnswersDto } from './dto/submit-answers.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // <--- CORRECT IMPORT FOR THE GUARD
import { Request } from 'express';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get('questions')
  async getQuestions() {
    return this.quizService.getQuestions();
  }

  @UseGuards(JwtAuthGuard) // <--- Use your specific guard here
  @Post('submit-answers')
  async submitAnswers(
    @Body() submitAnswersDto: SubmitAnswersDto,
    @Req() req: Request,
  ) {
    // These logs will appear if the guard successfully authenticates the request
    console.log('--- In QuizController submitAnswers method ---');
    console.log('Authenticated User (req.user):', req.user); // This object comes from JwtStrategy's return
    const userId = req.user['id']; // Correctly access the 'id' property
    const fullName = req.user['fullName'];
    console.log('User ID from JWT payload:', userId);
    console.log('Full Name from JWT payload:', fullName);
    console.log('--- End QuizController submitAnswers method ---');

    return this.quizService.submitAnswers(
      submitAnswersDto.answers,
      userId,
      fullName,
    );
  }
}
