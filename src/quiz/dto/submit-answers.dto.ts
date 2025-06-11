// src/quiz/dto/submit-answers.dto.ts
import { IsInt, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer'; // You might need this if you're transforming nested DTOs
import { ValidateNested } from 'class-validator'; // You might need this for nested DTOs

export class AnswerDto {
  @IsInt()
  @IsNotEmpty()
  questionId: number;

  @IsInt() // Validate it's an integer
  @IsNotEmpty() // Validate it's not empty
  selectedOptionId: number; // <--- THIS IS THE CRITICAL CHANGE. IT MUST BE selectedOptionId
  // It MUST NOT be selectedOptionIndex
}

export class SubmitAnswersDto {
  // Add these decorators if you haven't already and use class-validator/transformer
  // They help validate the array of nested DTOs
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[];
}
