import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialProjectSchema1749840658183 implements MigrationInterface {
    name = 'InitialProjectSchema1749840658183'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "option" ("id" SERIAL NOT NULL, "text" character varying NOT NULL, "correspondence" character varying NOT NULL, "questionId" integer, CONSTRAINT "PK_e6090c1c6ad8962eea97abdbe63" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "question" ("id" SERIAL NOT NULL, "text" character varying NOT NULL, CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "student_response" ("id" SERIAL NOT NULL, "userId" integer, "selectedOptionCorrespondence" character varying NOT NULL, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "questionId" integer, "selectedOptionId" integer, CONSTRAINT "PK_5a9bf9b4a673aa554a565297800" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "fullName" character varying, "phoneNumber" character varying, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "dashboard_users" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'user', CONSTRAINT "UQ_507b02a1dd4a2b320b60dfa6485" UNIQUE ("username"), CONSTRAINT "PK_a34bdf209c625b674f61a9a60dc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "quiz_submissions" ("submissionId" uuid NOT NULL, "userName" character varying NOT NULL, "phoneNumber" character varying NOT NULL, "submissionDate" TIMESTAMP NOT NULL DEFAULT now(), "scores" text NOT NULL, "publicSpeakingPersonalityType" character varying NOT NULL, "publicSpeakingPersonalityMeaning" character varying NOT NULL, "quizTitle" character varying NOT NULL, CONSTRAINT "PK_1f48722ae5eed92eee4b9c517f5" PRIMARY KEY ("submissionId"))`);
        await queryRunner.query(`ALTER TABLE "option" ADD CONSTRAINT "FK_b94517ccffa9c97ebb8eddfcae3" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "student_response" ADD CONSTRAINT "FK_8fb8633ea0e3d2450b84f698c10" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "student_response" ADD CONSTRAINT "FK_02a48d5c710307db31c8dab17c8" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "student_response" ADD CONSTRAINT "FK_d3b8fc32243a316afdfc044de95" FOREIGN KEY ("selectedOptionId") REFERENCES "option"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student_response" DROP CONSTRAINT "FK_d3b8fc32243a316afdfc044de95"`);
        await queryRunner.query(`ALTER TABLE "student_response" DROP CONSTRAINT "FK_02a48d5c710307db31c8dab17c8"`);
        await queryRunner.query(`ALTER TABLE "student_response" DROP CONSTRAINT "FK_8fb8633ea0e3d2450b84f698c10"`);
        await queryRunner.query(`ALTER TABLE "option" DROP CONSTRAINT "FK_b94517ccffa9c97ebb8eddfcae3"`);
        await queryRunner.query(`DROP TABLE "quiz_submissions"`);
        await queryRunner.query(`DROP TABLE "dashboard_users"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "student_response"`);
        await queryRunner.query(`DROP TABLE "question"`);
        await queryRunner.query(`DROP TABLE "option"`);
    }

}
