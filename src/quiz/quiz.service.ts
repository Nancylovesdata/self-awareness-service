/* eslint-disable prettier/prettier */
// src/quiz/quiz.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { StudentResponse } from './entities/student-response.entity';
import { Option } from './entities/option.entity';
import { QuizSubmission } from './entities/quiz-submission.entity';

import { SubmitAnswersDto } from './dto/submit-answers.dto';
import { QuizResultDto } from './dto/quiz-result.dto';

// Define a new type for the full quiz submission response to be explicit
// <--- MODIFIED / ADDED: Include userName, phoneNumber, and quizTitle in the response type
type FullQuizSubmissionResponse = QuizResultDto & {
  submissionId: string;
  submissionDate: string;
  userName: string; // MODIFIED: Added to type
  phoneNumber: string; // MODIFIED: Added to type
  quizTitle: string; // MODIFIED: Added to type
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

    // --- MODIFIED LOGIC START: Handle ties and generate personality type string ---
    const maxScore = Math.max(...Object.values(scores));
    const highestLetters = Object.keys(scores).filter(
      (letter) => scores[letter] === maxScore,
    );

    // If there's a tie, show all tied letters separated by a slash (e.g., "N/D")
    const publicSpeakingPersonalityType = highestLetters.join('/');

    console.log('Calculated Scores:', scores);
    console.log(
      'Determined Personality Type (for response):',
      publicSpeakingPersonalityType,
    );
    // --- MODIFIED LOGIC END ---

    // Save the full meaning to the database for later retrieval/admin purposes
    const fullMeaningForDb =
      highestLetters
        .map((letter) => this.letterMeanings[letter] || 'Unknown')
        .join('/') || 'Unknown';

    const quizSubmission = this.quizSubmissionRepository.create({
      userName: userName,
      phoneNumber: phoneNumber,
      quizTitle: quizTitle,
      scores: scores,
      // Save the combined personality type (e.g., "N/D")
      publicSpeakingPersonalityType: publicSpeakingPersonalityType,
      // Save the full meaning for database records, but not for the immediate response to the user
      publicSpeakingPersonalityMeaning: fullMeaningForDb,
    });

    const savedQuizSubmission =
      await this.quizSubmissionRepository.save(quizSubmission);

    console.log('--- End QuizService submitAnswers method ---');

    return {
      scores: scores as { A: number; D: number; N: number; C: number },
      // Return only the letter(s) as requested
      publicSpeakingPersonalityType: publicSpeakingPersonalityType,
      // Ensure this is an empty string or removed from DTO for the immediate response
      publicSpeakingPersonalityMeaning: '', // IMPORTANT: Keep this empty for the immediate response
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

    // For historical retrieval (e.g., by an admin), you might want to return the full meaning.
    // However, if this endpoint is also exposed to the user immediately after submission,
    // you might need to apply the same logic as `submitAnswers` to hide the full meaning.
    // Assuming this might be for internal/admin retrieval or later use where full meaning is allowed:
    return {
      submissionId: submission.submissionId,
      scores: submission.scores,
      publicSpeakingPersonalityType: submission.publicSpeakingPersonalityType, // This will be N/D if saved as such
      publicSpeakingPersonalityMeaning:
        submission.publicSpeakingPersonalityMeaning, // This will have the full meaning if saved as such
      userName: submission.userName,
      phoneNumber: submission.phoneNumber,
      quizTitle: submission.quizTitle,
      submissionDate: submission.submissionDate.toISOString(),
    };
  }

  // --- NEW METHOD TO FIND ALL SUBMISSIONS ---
  async findAllQuizSubmissions(): Promise<FullQuizSubmissionResponse[]> {
    const submissions = await this.quizSubmissionRepository.find();

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