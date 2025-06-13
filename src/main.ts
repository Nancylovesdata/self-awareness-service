// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app/app.module';
import { seedQuestions } from '@app/database/seeds/questions.seeder';
import { getDataSourceToken } from '@nestjs/typeorm';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:4200',
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
