// src/quiz/dto/submit-answers.dto.ts (or src/quiz/dto/answer.dto.ts if separate)
import { IsInt, IsNotEmpty } from 'class-validator';
// import { Type } from 'class-transformer'; // Add this if you use Type for nested DTOs

export class AnswerDto {
  @IsInt()
  @IsNotEmpty()
  questionId: number;

  @IsInt()
  @IsNotEmpty()
  selectedOptionId: number; // <--- THIS MUST BE selectedOptionId, NOT selectedOptionIndex
}

export class SubmitAnswersDto {
  // @IsArray() // If you validate it's an array
  // @ValidateNested({ each: true }) // If you validate each nested object
  // @Type(() => AnswerDto) // If you use class-transformer for type conversion
  answers: AnswerDto[];
}
