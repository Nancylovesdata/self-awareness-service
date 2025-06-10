// src/quiz/dto/quiz-result.dto.ts
// If using class-validator/transformer, add decorators
export class QuizResultDto {
  scores: { A: number; D: number; N: number; C: number };
  publicSpeakingPersonalityType: string;
  publicSpeakingPersonalityMeaning: string;
  userName: string; // <-- Add this property
}
