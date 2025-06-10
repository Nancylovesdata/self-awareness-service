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
import { Question } from './entities/question.entity';
import { StudentResponse } from './entities/student-response.entity';
import { QuizResultDto } from './dto/quiz-result.dto';
// REMOVE THIS LINE: import { User } from '@app/auth/entities/user.entity'; // <-- REMOVE THIS IMPORT IF NOT USED

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(StudentResponse)
    private studentResponseRepository: Repository<StudentResponse>,
    // REMOVE THIS: @InjectRepository(User) // <-- REMOVE THIS LINE
    // REMOVE THIS: private userRepository: Repository<User>, // <-- REMOVE THIS LINE
  ) {}

  async getQuestions(): Promise<Question[]> {
    return this.questionRepository.find({
      relations: ['options'],
    });
  }

  async submitAnswers(
    answers: { questionId: number; selectedOptionIndex: number }[],
    userId: number,
    fullName: string,
  ): Promise<QuizResultDto> {
    const scores: { [key: string]: number } = { A: 0, D: 0, N: 0, C: 0 };
    const savedResponses: StudentResponse[] = [];

    for (const answer of answers) {
      const question = await this.questionRepository.findOne({
        where: { id: answer.questionId },
        relations: ['options'],
      });

      if (!question) {
        throw new NotFoundException(
          `Question with ID ${answer.questionId} not found.`,
        );
      }

      if (
        answer.selectedOptionIndex < 0 ||
        answer.selectedOptionIndex >= question.options.length
      ) {
        throw new NotFoundException(
          `Invalid option index for question ID ${answer.questionId}.`,
        );
      }

      const selectedOption = question.options[answer.selectedOptionIndex];
      const correspondence = selectedOption.correspondence;
      scores[correspondence] = (scores[correspondence] || 0) + 1;

      const studentResponse = this.studentResponseRepository.create({
        question: question,
        selectedOptionCorrespondence: correspondence,
        timestamp: new Date(),
        userId: userId,
      });
      savedResponses.push(studentResponse);
    }

    await this.studentResponseRepository.save(savedResponses);

    const personalityType = Object.keys(scores).reduce((a, b) =>
      scores[a] > scores[b] ? a : b,
    );

    let publicSpeakingPersonalityMeaning: string;
    switch (personalityType) {
      case 'A':
        publicSpeakingPersonalityMeaning = 'Assertor';
        break;
      case 'D':
        publicSpeakingPersonalityMeaning = 'Demonstrator';
        break;
      case 'N':
        publicSpeakingPersonalityMeaning = 'Narrator';
        break;
      case 'C':
        publicSpeakingPersonalityMeaning = 'Contemplator';
        break;
      default:
        publicSpeakingPersonalityMeaning = 'Unknown';
    }

    return {
      scores: scores as { A: number; D: number; N: number; C: number },
      publicSpeakingPersonalityType: personalityType,
      publicSpeakingPersonalityMeaning: publicSpeakingPersonalityMeaning,
      userName: fullName,
    };
  }
}
