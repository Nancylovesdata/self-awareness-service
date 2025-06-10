// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app/app.module'; // Changed path
import { seedQuestions } from '@app/database/seeds/questions.seeder'; // Changed path
import { getDataSourceToken } from '@nestjs/typeorm';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const dataSource = app.get(getDataSourceToken());
  await seedQuestions(dataSource);

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
