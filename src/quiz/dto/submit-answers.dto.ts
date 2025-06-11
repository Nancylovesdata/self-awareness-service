// src/quiz/dto/submit-answers.dto.ts

import {
  IsArray,
  IsNumber,
  IsString,
  ValidateNested,
  IsOptional,
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
  userName: string; // Changed from fullName to userName

  @IsString()
  phoneNumber: string; // Added phoneNumber
}
