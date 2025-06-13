// src/quiz/quiz.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { StudentResponse } from './entities/student-response.entity';
import { Option } from './entities/option.entity';
import { QuizSubmission } from './entities/quiz-submission.entity'; // Your entity file

import { SubmitAnswersDto } from './dto/submit-answers.dto';
import { QuizResultDto } from './dto/quiz-result.dto';

// Define a new type for the full quiz submission response to be explicit
type FullQuizSubmissionResponse = QuizResultDto & {
  submissionId: string;
  submissionDate: string;
  userName: string;
  phoneNumber: string;
  quizTitle: string;
  // NEW: Add a field for combined meaning string if ties exist
  combinedPublicSpeakingPersonalityMeaning?: string;
};

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
    @InjectRepository(Option)
    private optionRepository: Repository<Option>,
    @InjectRepository(QuizSubmission)
    private quizSubmissionRepository: Repository<QuizSubmission>,
  ) {}

  async getQuestions(): Promise<Question[]> {
    // --- START OF CHANGES FOR OPTION ORDERING ---
    const questions = await this.questionRepository.find({
      relations: ['options'],
      // You can try ordering by question ID directly in the query for consistency
      order: {
        id: 'ASC',
      },
    });

    // Manually sort options within each question to ensure ascending ID order
    // This is robust as TypeORM's `order` for nested relations can be tricky sometimes
    questions.forEach((question) => {
      if (question.options && Array.isArray(question.options)) {
        question.options.sort((a, b) => a.id - b.id);
      }
    });

    return questions;
    // --- END OF CHANGES FOR OPTION ORDERING ---
  }

  async submitAnswers(
    submitAnswersDto: SubmitAnswersDto,
  ): Promise<FullQuizSubmissionResponse> {
    console.log('--- Inside QuizService submitAnswers method ---');
    console.log('Received DTO:', submitAnswersDto);

    const { answers, userName, phoneNumber, quizTitle } = submitAnswersDto;

    const scores: { [key: string]: number } = { A: 0, D: 0, N: 0, C: 0 };
    const savedResponses: StudentResponse[] = [];

    for (const answer of answers) {
      const question = await this.questionRepository.findOne({
        where: { id: answer.questionId },
        relations: ['options'],
      });

      if (!question) {
        console.warn(
          `Question with ID ${answer.questionId} not found. Skipping.`,
        );
        continue;
      }

      const selectedOption = question.options.find(
        (option) => option.id === answer.selectedOptionId,
      );

      if (!selectedOption) {
        console.warn(
          `Option with ID ${answer.selectedOptionId} not found for question ID ${answer.questionId}. Skipping.`,
        );
        continue;
      }

      const correspondence = selectedOption.correspondence;
      scores[correspondence] = (scores[correspondence] || 0) + 1;

      const studentResponse = this.studentResponseRepository.create({
        question: question,
        selectedOption: selectedOption,
        selectedOptionCorrespondence: correspondence,
        timestamp: new Date(),
      });
      savedResponses.push(studentResponse);
    }

    await this.studentResponseRepository.save(savedResponses);

    // --- START OF CHANGES FOR TIE HANDLING & COMBINED MEANING ---
    let maxScore = -1;
    for (const type in scores) {
      if (scores.hasOwnProperty(type)) {
        // Ensure it's an own property, not from prototype chain
        if (scores[type as keyof typeof scores] > maxScore) {
          maxScore = scores[type as keyof typeof scores];
        }
      }
    }

    const tiedPersonalityDetails: {
      type: string;
      meaning: string;
      score: number;
    }[] = [];
    for (const type in scores) {
      if (scores.hasOwnProperty(type)) {
        // Ensure it's an own property
        if (scores[type as keyof typeof scores] === maxScore) {
          tiedPersonalityDetails.push({
            type: type,
            score: maxScore,
            meaning: this.letterMeanings[type] || 'Unknown Meaning',
          });
        }
      }
    }

    // Sort tied types alphabetically by type for consistent display
    tiedPersonalityDetails.sort((a, b) => a.type.localeCompare(b.type));

    // Determine the single primary type for database storage (first in sorted tied list)
    const primaryPersonalityType =
      tiedPersonalityDetails.length > 0
        ? tiedPersonalityDetails[0].type
        : 'Unknown';
    const primaryPersonalityMeaning =
      tiedPersonalityDetails.length > 0
        ? tiedPersonalityDetails[0].meaning
        : 'Unknown';

    // Generate the combined meaning string for the response
    let combinedMeaningString: string;
    if (tiedPersonalityDetails.length > 1) {
      combinedMeaningString = tiedPersonalityDetails
        .map((t) => t.meaning)
        .join(' and ');
    } else if (tiedPersonalityDetails.length === 1) {
      combinedMeaningString = tiedPersonalityDetails[0].meaning;
    } else {
      combinedMeaningString = 'Unknown';
    }

    console.log('Calculated Scores:', scores);
    console.log(
      'Determined Primary Personality Type (for DB):',
      primaryPersonalityType,
    );
    console.log(
      'Combined Personality Meaning (for response):',
      combinedMeaningString,
    );
    // --- END OF CHANGES FOR TIE HANDLING & COMBINED MEANING ---

    const quizSubmission = this.quizSubmissionRepository.create({
      userName: userName,
      phoneNumber: phoneNumber,
      quizTitle: quizTitle,
      scores: scores,
      // Store the primary type/meaning in the entity as per existing schema
      publicSpeakingPersonalityType: primaryPersonalityType,
      publicSpeakingPersonalityMeaning: primaryPersonalityMeaning,
    });

    const savedQuizSubmission =
      await this.quizSubmissionRepository.save(quizSubmission);

    console.log('--- End QuizService submitAnswers method ---');

    return {
      scores: scores as { A: number; D: number; N: number; C: number },
      publicSpeakingPersonalityType: primaryPersonalityType, // This will be the primary one saved to DB
      publicSpeakingPersonalityMeaning: primaryPersonalityMeaning, // This will be the primary one saved to DB
      userName: userName,
      phoneNumber: phoneNumber,
      quizTitle: quizTitle,
      submissionId: savedQuizSubmission.submissionId,
      submissionDate: savedQuizSubmission.submissionDate.toISOString(),
      combinedPublicSpeakingPersonalityMeaning: combinedMeaningString, // <--- NEW FIELD IN RESPONSE
    };
  }

  async getQuizSubmissionById(
    submissionId: string,
  ): Promise<FullQuizSubmissionResponse> {
    const submission = await this.quizSubmissionRepository.findOne({
      where: { submissionId },
    });

    if (!submission) {
      throw new NotFoundException(
        `Quiz submission with ID "${submissionId}" not found.`,
      );
    }

    // --- RE-CALCULATE TIED MEANING FOR RETRIEVED SUBMISSION ---
    const scores: { A: number; D: number; N: number; C: number } =
      submission.scores;
    let maxScore = -1;
    for (const type in scores) {
      if (scores.hasOwnProperty(type)) {
        if (scores[type as keyof typeof scores] > maxScore) {
          maxScore = scores[type as keyof typeof scores];
        }
      }
    }
    const tiedPersonalityDetails: {
      type: string;
      meaning: string;
      score: number;
    }[] = [];
    for (const type in scores) {
      if (scores.hasOwnProperty(type)) {
        if (scores[type as keyof typeof scores] === maxScore) {
          tiedPersonalityDetails.push({
            type: type,
            score: maxScore,
            meaning: this.letterMeanings[type] || 'Unknown Meaning',
          });
        }
      }
    }
    tiedPersonalityDetails.sort((a, b) => a.type.localeCompare(b.type));

    let combinedMeaningString: string;
    if (tiedPersonalityDetails.length > 1) {
      combinedMeaningString = tiedPersonalityDetails
        .map((t) => t.meaning)
        .join(' and ');
    } else if (tiedPersonalityDetails.length === 1) {
      combinedMeaningString = tiedPersonalityDetails[0].meaning;
    } else {
      combinedMeaningString = 'Unknown';
    }
    // --- END OF RE-CALCULATION ---

    return {
      submissionId: submission.submissionId,
      scores: submission.scores,
      publicSpeakingPersonalityType: submission.publicSpeakingPersonalityType,
      publicSpeakingPersonalityMeaning:
        submission.publicSpeakingPersonalityMeaning,
      combinedPublicSpeakingPersonalityMeaning: combinedMeaningString, // <--- NEW FIELD IN RESPONSE
      userName: submission.userName,
      phoneNumber: submission.phoneNumber,
      quizTitle: submission.quizTitle,
      submissionDate: submission.submissionDate.toISOString(),
    };
  }

  async findAllQuizSubmissions(): Promise<FullQuizSubmissionResponse[]> {
    // --- START OF CHANGES FOR ORDER ---
    const submissions = await this.quizSubmissionRepository.find({
      order: {
        submissionDate: 'DESC', // Order by submissionDate in descending order (newest first)
      },
    });
    // --- END OF CHANGES FOR ORDER ---

    return submissions.map((submission) => {
      // --- RE-CALCULATE TIED MEANING FOR EACH SUBMISSION IN THE LIST ---
      const scores: { A: number; D: number; N: number; C: number } =
        submission.scores;
      let maxScore = -1;
      for (const type in scores) {
        if (scores.hasOwnProperty(type)) {
          if (scores[type as keyof typeof scores] > maxScore) {
            maxScore = scores[type as keyof typeof scores];
          }
        }
      }
      const tiedPersonalityDetails: {
        type: string;
        meaning: string;
        score: number;
      }[] = [];
      for (const type in scores) {
        if (scores.hasOwnProperty(type)) {
          if (scores[type as keyof typeof scores] === maxScore) {
            tiedPersonalityDetails.push({
              type: type,
              score: maxScore,
              meaning: this.letterMeanings[type] || 'Unknown Meaning',
            });
          }
        }
      }
      tiedPersonalityDetails.sort((a, b) => a.type.localeCompare(b.type));

      let combinedMeaningString: string;
      if (tiedPersonalityDetails.length > 1) {
        combinedMeaningString = tiedPersonalityDetails
          .map((t) => t.meaning)
          .join(' and ');
      } else if (tiedPersonalityDetails.length === 1) {
        combinedMeaningString = tiedPersonalityDetails[0].meaning;
      } else {
        combinedMeaningString = 'Unknown';
      }
      // --- END OF RE-CALCULATION ---

      return {
        submissionId: submission.submissionId,
        scores: submission.scores,
        publicSpeakingPersonalityType: submission.publicSpeakingPersonalityType,
        publicSpeakingPersonalityMeaning:
          submission.publicSpeakingPersonalityMeaning,
        combinedPublicSpeakingPersonalityMeaning: combinedMeaningString, // <--- NEW FIELD IN RESPONSE
        userName: submission.userName,
        phoneNumber: submission.phoneNumber,
        quizTitle: submission.quizTitle,
        submissionDate: submission.submissionDate.toISOString(),
      };
    });
  }
}
