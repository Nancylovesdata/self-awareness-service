/* eslint-disable prettier/prettier */
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app/app.module';
import { seedQuestions } from '@app/database/seeds/questions.seeder';
import { getDataSourceToken } from '@nestjs/typeorm';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // IMPORTANT: Update CORS origin to allow both frontend domains
 // Split the string by comma and trim any whitespace from each origin
  const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
    : ['http://localhost:4200']; // Fallback for development if not set

  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const dataSource = app.get(getDataSourceToken());
  await seedQuestions(dataSource);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
