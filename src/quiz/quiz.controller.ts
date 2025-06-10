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
import { Controller, Post, Body, Get } from '@nestjs/common'; // Import Get decorator
import { QuizService } from '@app/quiz/quiz.service'; // Using @app alias

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  // NEW ENDPOINT: Fetch all questions
  @Get('questions') // This endpoint will be accessible at /quiz/questions
  async getQuestions() {
    return this.quizService.findAllQuestions();
  }

  @Post('submit-answers')
  async submitAnswers(
    @Body('answers')
    answers: { questionId: number; selectedOptionIndex: number }[],
    @Body('studentId') studentId?: string,
  ) {
    return this.quizService.submitAnswers(answers, studentId);
  }
}
