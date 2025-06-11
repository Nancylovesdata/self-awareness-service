// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuizModule } from './quiz/quiz.module';
import { AuthModule } from './auth/auth.module';
import { User } from './quiz/entities/user.entity';
import { Question } from './quiz/entities/question.entity';
import { StudentResponse } from './quiz/entities/student-response.entity';
import { Option } from './quiz/entities/option.entity';

import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'), // <--- CORRECTED: Just the variable name 'DATABASE_URL'
        entities: [User, Question, Option, StudentResponse],
        synchronize: true,
        ssl: {
          rejectUnauthorized: false,
        },
      }),
    }),
    QuizModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
