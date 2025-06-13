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
    const questions = await this.questionRepository.find({
      relations: ['options'],
      order: {
        id: 'ASC', // Order questions by ID
      },
    });

    questions.forEach((question) => {
      if (question.options && Array.isArray(question.options)) {
        question.options.sort((a, b) => a.id - b.id);
      }
    });

    return questions;
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

    let finalPersonalityType: string;
    let finalPersonalityMeaning: string;

    if (tiedPersonalityDetails.length > 1) {
      // If there's a tie, combine the types with a FORWARD SLASH '/'
      finalPersonalityType = tiedPersonalityDetails
        .map((t) => t.type)
        .join('/'); // <--- CHANGE IS HERE (back to '/')
      // If there's a tie, combine the meanings with ' and '
      finalPersonalityMeaning = tiedPersonalityDetails
        .map((t) => t.meaning)
        .join(' and ');
    } else if (tiedPersonalityDetails.length === 1) {
      finalPersonalityType = tiedPersonalityDetails[0].type;
      finalPersonalityMeaning = tiedPersonalityDetails[0].meaning;
    } else {
      finalPersonalityType = 'Unknown';
      finalPersonalityMeaning = 'Unknown';
    }

    console.log('Calculated Scores:', scores);
    console.log(
      'Final Personality Type (including ties):',
      finalPersonalityType,
    );
    console.log(
      'Final Personality Meaning (including ties):',
      finalPersonalityMeaning,
    );

    const quizSubmission = this.quizSubmissionRepository.create({
      userName: userName,
      phoneNumber: phoneNumber,
      quizTitle: quizTitle,
      scores: scores,
      publicSpeakingPersonalityType: finalPersonalityType,
      publicSpeakingPersonalityMeaning: finalPersonalityMeaning,
    });

    const savedQuizSubmission =
      await this.quizSubmissionRepository.save(quizSubmission);

    console.log('--- End QuizService submitAnswers method ---');

    return {
      scores: scores as { A: number; D: number; N: number; C: number },
      publicSpeakingPersonalityType: finalPersonalityType,
      publicSpeakingPersonalityMeaning: finalPersonalityMeaning,
      userName: userName,
      phoneNumber: phoneNumber,
      quizTitle: quizTitle,
      submissionId: savedQuizSubmission.submissionId,
      submissionDate: savedQuizSubmission.submissionDate.toISOString(),
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

    return {
      submissionId: submission.submissionId,
      scores: submission.scores,
      publicSpeakingPersonalityType: submission.publicSpeakingPersonalityType,
      publicSpeakingPersonalityMeaning:
        submission.publicSpeakingPersonalityMeaning,
      userName: submission.userName,
      phoneNumber: submission.phoneNumber,
      quizTitle: submission.quizTitle,
      submissionDate: submission.submissionDate.toISOString(),
    };
  }

  async findAllQuizSubmissions(): Promise<FullQuizSubmissionResponse[]> {
    const submissions = await this.quizSubmissionRepository.find({
      order: {
        submissionDate: 'DESC', // Order by submissionDate in descending order (newest first)
      },
    });

    return submissions.map((submission) => ({
      submissionId: submission.submissionId,
      scores: submission.scores,
      publicSpeakingPersonalityType: submission.publicSpeakingPersonalityType,
      publicSpeakingPersonalityMeaning:
        submission.publicSpeakingPersonalityMeaning,
      userName: submission.userName,
      phoneNumber: submission.phoneNumber,
      quizTitle: submission.quizTitle,
      submissionDate: submission.submissionDate.toISOString(),
    }));
  }
}
