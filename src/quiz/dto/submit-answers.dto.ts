// src/quiz/dto/submit-answers.dto.ts
import { IsArray, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// DTO for a single answer within the submission
class AnswerDto {
  @IsNumber()
  questionId: number;

  @IsNumber()
  selectedOptionIndex: number;
}

// DTO for the overall quiz submission
export class SubmitAnswersDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[];
}
