// // src/quiz/quiz.controller.ts
// import { Controller, Post, Body } from '@nestjs/common';
// import { QuizService } from './quiz.service';

// @Controller('quiz') // All endpoints in this controller will be prefixed with /quiz
// export class QuizController {
//   constructor(private readonly quizService: QuizService) {}

//   @Post('submit-answers') // This endpoint will be /quiz/submit-answers
//   async submitAnswers(
//     @Body('answers')
//     answers: { questionId: number; selectedOptionIndex: number }[],
//     @Body('studentId') studentId?: string, // Optional: if you have user authentication
//   ) {
//     // Delegate the logic to the QuizService
//     return this.quizService.submitAnswers(answers, studentId);
//   }
// }

// src/quiz/quiz.controller.ts
// src/quiz/quiz.controller.ts
import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common'; // Add UseGuards, Req
import { AuthGuard } from '@nestjs/passport'; // Add AuthGuard
import { QuizService } from './quiz.service';
import { SubmitAnswersDto } from './dto/submit-answers.dto';
import { QuizResultDto } from './dto/quiz-result.dto'; // Assuming you have this DTO

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get('questions')
  async getQuestions() {
    return this.quizService.getQuestions();
  }

  @Post('submit-answers')
  @UseGuards(AuthGuard('jwt')) // <-- Protect this route with JWT authentication
  async submitAnswers(
    @Body() submitAnswersDto: SubmitAnswersDto,
    @Req() req: any, // <-- Inject the request object to access user data
  ): Promise<QuizResultDto> {
    // The JwtStrategy validates the token and attaches `user` to `req`
    // `req.user` will contain `{ userId: number, username: string, fullName: string }`
    const userId = req.user.userId;
    const fullName = req.user.fullName; // Get user's full name

    // Pass the userId and fullName to the service
    return this.quizService.submitAnswers(
      submitAnswersDto.answers,
      userId,
      fullName,
    );
  }
}
