// src/quiz/quiz.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { StudentResponse } from './entities/student-response.entity';
import { Option } from './entities/option.entity'; // <-- NEW: Import Option entity
import { User } from '../quiz/entities/user.entity'; // <-- NEW: Import User entity (adjust path if User is in auth/entities)
import { QuizResultDto } from './dto/quiz-result.dto';
import { AnswerDto } from './dto/submit-answers.dto';

@Injectable()
export class QuizService {
  // Define the meanings of the letters directly in the service
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
    @InjectRepository(Option) // <-- NEW: Inject OptionRepository
    private optionRepository: Repository<Option>, // This is not strictly needed for the .find() but good practice
    @InjectRepository(User) // <-- NEW: Inject UserRepository
    private userRepository: Repository<User>,
  ) {}

  async getQuestions(): Promise<Question[]> {
    return this.questionRepository.find({
      relations: ['options'],
    });
  }

  async submitAnswers(
    // CHANGE 1: Use selectedOptionId as provided by the client
    answers: AnswerDto[], // <--- CORRECTED PARAMETER TYPE
    userId: number,
    fullName: string,
  ): Promise<QuizResultDto> {
    console.log('--- Inside QuizService submitAnswers method ---');
    console.log('Received answers:', answers);
    console.log('Received userId:', userId);
    console.log('Received fullName:', fullName);

    const scores: { [key: string]: number } = { A: 0, D: 0, N: 0, C: 0 };
    const savedResponses: StudentResponse[] = [];

    // Find the user entity based on the userId provided by the JWT
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    for (const answer of answers) {
      const question = await this.questionRepository.findOne({
        where: { id: answer.questionId },
        relations: ['options'], // Ensure options are loaded with the question
      });

      if (!question) {
        console.warn(
          `Question with ID ${answer.questionId} not found. Skipping.`,
        );
        // Decide if you want to throw an error or just skip invalid questions
        continue; // Skip to the next answer
      }

      // CHANGE 2: Find the selected option by its ID, not its index
      const selectedOption = question.options.find(
        (option) => option.id === answer.selectedOptionId, // <--- CORRECTED LOGIC
      );

      if (!selectedOption) {
        console.warn(
          `Option with ID ${answer.selectedOptionId} not found for question ID ${answer.questionId}. Skipping.`,
        );
        // Decide if you want to throw an error or just skip invalid options
        continue; // Skip to the next answer
      }

      // Line that was causing the error, now selectedOption should be defined
      const correspondence = selectedOption.correspondence;
      scores[correspondence] = (scores[correspondence] || 0) + 1;

      // CHANGE 4: Assign the user entity to the student response
      const studentResponse = this.studentResponseRepository.create({
        user: user, // <--- Assign the actual User entity, not just the ID
        question: question,
        selectedOption: selectedOption, // Save the entire selected option
        selectedOptionCorrespondence: correspondence,
        timestamp: new Date(),
      });
      savedResponses.push(studentResponse);
    }

    await this.studentResponseRepository.save(savedResponses);

    const personalityType = Object.keys(scores).reduce((a, b) =>
      scores[a] > scores[b] ? a : b,
    );

    // CHANGE 5: Use letterMeanings for clearer assignment
    const publicSpeakingPersonalityMeaning =
      this.letterMeanings[personalityType] || 'Unknown';

    console.log('Calculated Scores:', scores);
    console.log('Determined Personality Type:', personalityType);
    console.log('--- End QuizService submitAnswers method ---');

    return {
      scores: scores as { A: number; D: number; N: number; C: number },
      publicSpeakingPersonalityType: personalityType,
      publicSpeakingPersonalityMeaning: publicSpeakingPersonalityMeaning,
      userName: fullName,
    };
  }
}
