// // src/app.module.ts
// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { QuizModule } from '@app/quiz/quiz.module'; // Changed path
// import { Question } from '@app/quiz/entities/question.entity'; // Changed path
// import { StudentResponse } from '@app/quiz/entities/student-response.entity'; // Changed path

// @Module({
//   imports: [
//     TypeOrmModule.forRoot({
//       type: 'sqlite',
//       database: 'db.sqlite',
//       entities: [Question, StudentResponse],
//       synchronize: true,
//     }),
//     QuizModule,
//   ],
//   controllers: [],
//   providers: [],
// })
// export class AppModule {}

// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuizModule } from './quiz/quiz.module';
import { User } from '@app/quiz/entities/user.entity'; // <-- CORRECTED IMPORT PATH FOR USER
import { AuthModule } from '@app/auth/auth.module';
import { Question } from './quiz/entities/question.entity';
import { StudentResponse } from './quiz/entities/student-response.entity';
import { Option } from './quiz/entities/option.entity'; //

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, Question, Option, StudentResponse],
      synchronize: true,
    }),
    QuizModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
