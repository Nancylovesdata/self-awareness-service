import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSetupPostgres1749675546881 implements MigrationInterface {
    name = 'InitialSetupPostgres1749675546881'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student_response" DROP CONSTRAINT "FK_8fb8633ea0e3d2450b84f698c10"`);
        await queryRunner.query(`ALTER TABLE "student_response" DROP CONSTRAINT "FK_d3b8fc32243a316afdfc044de95"`);
        await queryRunner.query(`CREATE TABLE "quiz_submissions" ("submissionId" uuid NOT NULL, "userName" character varying NOT NULL, "phoneNumber" character varying NOT NULL, "submissionDate" TIMESTAMP NOT NULL DEFAULT now(), "scores" text NOT NULL, "publicSpeakingPersonalityType" character varying NOT NULL, "publicSpeakingPersonalityMeaning" character varying NOT NULL, CONSTRAINT "PK_1f48722ae5eed92eee4b9c517f5" PRIMARY KEY ("submissionId"))`);
        await queryRunner.query(`ALTER TABLE "student_response" DROP CONSTRAINT "FK_02a48d5c710307db31c8dab17c8"`);
        await queryRunner.query(`ALTER TABLE "student_response" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "student_response" ALTER COLUMN "questionId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "student_response" ALTER COLUMN "selectedOptionId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "student_response" ADD CONSTRAINT "FK_8fb8633ea0e3d2450b84f698c10" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "student_response" ADD CONSTRAINT "FK_02a48d5c710307db31c8dab17c8" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "student_response" ADD CONSTRAINT "FK_d3b8fc32243a316afdfc044de95" FOREIGN KEY ("selectedOptionId") REFERENCES "option"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student_response" DROP CONSTRAINT "FK_d3b8fc32243a316afdfc044de95"`);
        await queryRunner.query(`ALTER TABLE "student_response" DROP CONSTRAINT "FK_02a48d5c710307db31c8dab17c8"`);
        await queryRunner.query(`ALTER TABLE "student_response" DROP CONSTRAINT "FK_8fb8633ea0e3d2450b84f698c10"`);
        await queryRunner.query(`ALTER TABLE "student_response" ALTER COLUMN "selectedOptionId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "student_response" ALTER COLUMN "questionId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "student_response" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "student_response" ADD CONSTRAINT "FK_02a48d5c710307db31c8dab17c8" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP TABLE "quiz_submissions"`);
        await queryRunner.query(`ALTER TABLE "student_response" ADD CONSTRAINT "FK_d3b8fc32243a316afdfc044de95" FOREIGN KEY ("selectedOptionId") REFERENCES "option"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "student_response" ADD CONSTRAINT "FK_8fb8633ea0e3d2450b84f698c10" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
