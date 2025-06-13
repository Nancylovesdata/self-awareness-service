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
    const tempStudentResponses: StudentResponse[] = []; // Store responses temporarily

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
        // quizSubmission: null, // This will be set when the parent submission is created/saved
        // submissionId: '', // This will be set by the parent submission
      });
      tempStudentResponses.push(studentResponse);
    }

    const maxScore = Math.max(...Object.values(scores));
    const highestLetters = Object.keys(scores).filter(
      (letter) => scores[letter] === maxScore,
    );

    const publicSpeakingPersonalityType = highestLetters.join('/');

    console.log('Calculated Scores:', scores);
    console.log(
      'Determined Personality Type (for response):',
      publicSpeakingPersonalityType,
    );

    const fullMeaningForDb =
      highestLetters
        .map((letter) => this.letterMeanings[letter] || 'Unknown')
        .join('/') || 'Unknown';

    // Create the quiz submission first
    const quizSubmission = this.quizSubmissionRepository.create({
      userName: userName,
      phoneNumber: phoneNumber,
      quizTitle: quizTitle,
      scores: scores,
      publicSpeakingPersonalityType: publicSpeakingPersonalityType,
      publicSpeakingPersonalityMeaning: fullMeaningForDb,
      // Assign the collected student responses to the submission
      studentResponses: tempStudentResponses, // Assign the created responses here
    });

    // Save the quiz submission. Due to 'cascade: true' on studentResponses,
    // the related student responses will also be saved.
    const savedQuizSubmission = await this.quizSubmissionRepository.save(quizSubmission);

    console.log('--- End QuizService submitAnswers method ---');

    return {
      scores: scores as { A: number; D: number; N: number; C: number },
      publicSpeakingPersonalityType: publicSpeakingPersonalityType,
      publicSpeakingPersonalityMeaning: '',
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
      // OPTIONAL: If you want to load student responses with the submission
      // relations: ['studentResponses'],
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
      // OPTIONAL: If you want to load student responses with all submissions
      // relations: ['studentResponses'],
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

  /**
   * Deletes a single quiz submission by its ID.
   * If onDelete: 'CASCADE' is set on the relation, related student responses will be automatically deleted.
   * @param submissionId The ID of the quiz submission to delete.
   * @returns A message indicating the success or failure of the operation.
   * @throws NotFoundException if the quiz submission is not found.
   */
  async deleteSubmissionById(submissionId: string): Promise<{ message: string }> {
    // Find the submission first to ensure it exists
    const submission = await this.quizSubmissionRepository.findOne({ where: { submissionId } });

    if (!submission) {
      throw new NotFoundException(`Quiz submission with ID "${submissionId}" not found.`);
    }

    // If onDelete: 'CASCADE' is configured in your entities, the database will handle
    // deleting associated student responses automatically when the QuizSubmission is deleted.
    // So, we can remove the explicit `studentResponseRepository.delete` call here.
    const deleteResult = await this.quizSubmissionRepository.delete(submissionId);

    if (deleteResult.affected === 0) {
      throw new NotFoundException(`Failed to delete quiz submission with ID "${submissionId}".`);
    }

    return { message: `Quiz submission with ID "${submissionId}" successfully deleted.` };
  }

  /**
   * Deletes all quiz submissions and their associated student responses from the database.
   * If onDelete: 'CASCADE' is set on the relation, related student responses will be automatically deleted.
   * @returns A message indicating the success of the operation and the count of deleted items.
   */
  async deleteAllSubmissions(): Promise<{ message: string; deletedCount: number }> {
    // If onDelete: 'CASCADE' is configured, deleting submissions will cascade to responses.
    // So, we can remove the explicit `studentResponseRepository.delete` call here.
    const deleteResult = await this.quizSubmissionRepository.delete({});
    const deletedCount = deleteResult.affected || 0;
    console.log(`Deleted ${deletedCount} quiz submissions.`);
    return { message: `Successfully deleted ${deletedCount} quiz submissions.`, deletedCount };
  }
}