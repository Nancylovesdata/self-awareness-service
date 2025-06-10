// src/quiz/quiz.controller.ts
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { SubmitAnswersDto } from './dto/submit-answers.dto';
import { AuthGuard } from '@nestjs/passport'; // Import AuthGuard
import { Request } from 'express'; // Import Request from express

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get('questions') // <-- New endpoint for fetching questions
  async getQuestions() {
    return this.quizService.getQuestions();
  }

  @UseGuards(AuthGuard('jwt')) // Apply AuthGuard to protect this route
  @Post('submit-answers')
  async submitAnswers(
    @Body() submitAnswersDto: SubmitAnswersDto,
    @Req() req: Request, // Inject the request object to access user data
  ) {
    // The user object is attached to the request by JwtStrategy
    const userId = req.user['sub']; // 'sub' typically holds the user ID from the JWT payload
    const fullName = req.user['fullName']; // Assuming 'fullName' is also in your JWT payload

    return this.quizService.submitAnswers(
      submitAnswersDto.answers,
      userId,
      fullName,
    );
  }
}
