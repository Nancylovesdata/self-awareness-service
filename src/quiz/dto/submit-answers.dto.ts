// src/quiz/dto/submit-answers.dto.ts
import {
  IsArray,
  IsNumber,
  IsString,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AnswerDto {
  @IsNumber()
  questionId: number;

  @IsNumber()
  selectedOptionId: number;
}

export class SubmitAnswersDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[];

  @IsString()
  userName: string;

  @IsString()
  phoneNumber: string;

  // Added quiz title
  @IsNotEmpty()
  @IsString()
  quizTitle: string;
}
