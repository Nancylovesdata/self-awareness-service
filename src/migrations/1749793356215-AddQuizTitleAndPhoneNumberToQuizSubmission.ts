import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddQuizTitleAndPhoneNumberToQuizSubmission1749793356215
  implements MigrationInterface
{
  name = 'AddQuizTitleAndPhoneNumberToQuizSubmission1749793356215';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // CHANGED: Removed 'NOT NULL' to allow existing rows to have null values for quizTitle
    await queryRunner.query(
      `ALTER TABLE "quiz_submissions" ADD "quizTitle" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "quiz_submissions" DROP COLUMN "quizTitle"`,
    );
  }
}
