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
    return this.questionRepository.find({
      relations: ['options'],
    });
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

    const personalityType = Object.keys(scores).reduce((a, b) =>
      scores[a] > scores[b] ? a : b,
    );
    const publicSpeakingPersonalityMeaning =
      this.letterMeanings[personalityType] || 'Unknown';

    console.log('Calculated Scores:', scores);
    console.log('Determined Personality Type:', personalityType);

    const quizSubmission = this.quizSubmissionRepository.create({
      userName: userName,
      phoneNumber: phoneNumber,
      quizTitle: quizTitle,
      scores: scores, // <--- REVERTED: No JSON.stringify here. Entity transformer handles it.
      publicSpeakingPersonalityType: personalityType,
      publicSpeakingPersonalityMeaning: publicSpeakingPersonalityMeaning,
    });

    const savedQuizSubmission =
      await this.quizSubmissionRepository.save(quizSubmission);

    console.log('--- End QuizService submitAnswers method ---');

    return {
      scores: scores as { A: number; D: number; N: number; C: number },
      publicSpeakingPersonalityType: personalityType,
      publicSpeakingPersonalityMeaning: publicSpeakingPersonalityMeaning,
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
      scores: submission.scores, // <--- REVERTED: No JSON.parse here. Entity transformer handles it.
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
    const submissions = await this.quizSubmissionRepository.find();

    return submissions.map((submission) => ({
      submissionId: submission.submissionId,
      scores: submission.scores, // <--- REVERTED: No JSON.parse here. Entity transformer handles it.
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
