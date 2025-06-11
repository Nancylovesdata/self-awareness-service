// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app/app.module';
import { seedQuestions } from '@app/database/seeds/questions.seeder';
import { getDataSourceToken } from '@nestjs/typeorm';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- ADD THIS CORS CONFIGURATION HERE ---
  app.enableCors({
    origin: 'http://localhost:4200', // This allows requests from your frontend's local development server
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Adjust methods as per your API needs
    credentials: true, // Set to true if your frontend needs to send cookies or authorization headers
  });
  // --- END CORS CONFIGURATION ---

  const dataSource = app.get(getDataSourceToken());
  await seedQuestions(dataSource);

  // IMPORTANT: For Render deployment, you should use process.env.PORT
  // app.listen(process.env.PORT || 3000)
  await app.listen(3000); // If 3000 is directly used on Render, it might cause issues. Recommend process.env.PORT
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
