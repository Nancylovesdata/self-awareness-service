// // src/quiz/quiz.service.ts
// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Question } from './entities/question.entity';
// import { StudentResponse } from './entities/student-response.entity';

// @Injectable()
// export class QuizService {
//   // Define the meanings of the letters directly in the service
//   private readonly letterMeanings: { [key: string]: string } = {
//     A: 'Assertor',
//     D: 'Demonstrator',
//     N: 'Narrator',
//     C: 'Contemplator',
//   };

//   constructor(
//     @InjectRepository(Question)
//     private questionRepository: Repository<Question>,
//     @InjectRepository(StudentResponse)
//     private studentResponseRepository: Repository<StudentResponse>,
//   ) {}

//   async submitAnswers(
//     answers: { questionId: number; selectedOptionIndex: number }[],
//     studentId?: string,
//   ) {
//     const scoreCard: { [key: string]: number } = { A: 0, D: 0, N: 0, C: 0 };
//     const newResponses: StudentResponse[] = [];

//     for (const answer of answers) {
//       const question = await this.questionRepository.findOne({
//         where: { id: answer.questionId },
//       });

//       if (!question) {
//         throw new NotFoundException(
//           `Question with ID ${answer.questionId} not found.`,
//         );
//       }

//       const selectedOption = question.options[answer.selectedOptionIndex];
//       if (!selectedOption) {
//         throw new NotFoundException(
//           `Invalid option index ${answer.selectedOptionIndex} for question ${answer.questionId}.`,
//         );
//       }

//       const correspondenceLetter = selectedOption.correspondence;
//       scoreCard[correspondenceLetter]++;

//       const newResponse = this.studentResponseRepository.create({
//         studentId,
//         question,
//         selectedOptionCorrespondence: correspondenceLetter,
//       });
//       newResponses.push(newResponse);
//     }

//     await this.studentResponseRepository.save(newResponses);

//     let dominantLetter: string | null = null;
//     let maxScore = -1;

//     for (const letter in scoreCard) {
//       if (scoreCard[letter] > maxScore) {
//         maxScore = scoreCard[letter];
//         dominantLetter = letter;
//       } else if (scoreCard[letter] === maxScore) {
//         // If there's a tie for the highest score, you can decide how to handle it.
//         // For now, it will return the first letter encountered with the max score.
//         // If you want to return all tied letters, dominantLetter would need to be an array.
//       }
//     }

//     const dominantLetterMeaning = dominantLetter
//       ? this.letterMeanings[dominantLetter]
//       : null;

//     return {
//       scores: scoreCard,
//       publicSpeakingPersonalityType: dominantLetter,
//       publicSpeakingPersonalityMeaning: dominantLetterMeaning, // New field!
//     };
//   }
// }

// src/quiz/quiz.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from '@app/quiz/entities/question.entity'; // Using @app alias
import { StudentResponse } from '@app/quiz/entities/student-response.entity'; // Using @app alias

@Injectable()
export class QuizService {
  private readonly letterMeanings: { [key: string]: string } = {
    A: 'Assertor',
    D: 'Demonstrator',
    N: 'Narrator',
    C: 'Contemplator',
  };

  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(StudentResponse)
    private studentResponseRepository: Repository<StudentResponse>,
  ) {}

  // NEW METHOD: Fetch all questions
  async findAllQuestions(): Promise<Question[]> {
    return this.questionRepository.find(); // This will fetch all questions from the database
  }

  async submitAnswers(
    answers: { questionId: number; selectedOptionIndex: number }[],
    studentId?: string,
  ) {
    const scoreCard: { [key: string]: number } = { A: 0, D: 0, N: 0, C: 0 };
    const newResponses: StudentResponse[] = [];

    for (const answer of answers) {
      const question = await this.questionRepository.findOne({
        where: { id: answer.questionId },
      });

      if (!question) {
        throw new NotFoundException(
          `Question with ID ${answer.questionId} not found.`,
        );
      }

      const selectedOption = question.options[answer.selectedOptionIndex];
      if (!selectedOption) {
        throw new NotFoundException(
          `Invalid option index ${answer.selectedOptionIndex} for question ${answer.questionId}.`,
        );
      }

      const correspondenceLetter = selectedOption.correspondence;
      scoreCard[correspondenceLetter]++;

      const newResponse = this.studentResponseRepository.create({
        studentId,
        question,
        selectedOptionCorrespondence: correspondenceLetter,
      });
      newResponses.push(newResponse);
    }

    await this.studentResponseRepository.save(newResponses);

    let dominantLetter: string | null = null;
    let maxScore = -1;

    for (const letter in scoreCard) {
      if (scoreCard[letter] > maxScore) {
        maxScore = scoreCard[letter];
        dominantLetter = letter;
      } else if (scoreCard[letter] === maxScore) {
        // Handle ties if desired, otherwise the first encountered will be chosen
      }
    }

    const dominantLetterMeaning = dominantLetter
      ? this.letterMeanings[dominantLetter]
      : null;

    return {
      scores: scoreCard,
      publicSpeakingPersonalityType: dominantLetter,
      publicSpeakingPersonalityMeaning: dominantLetterMeaning,
    };
  }
}
