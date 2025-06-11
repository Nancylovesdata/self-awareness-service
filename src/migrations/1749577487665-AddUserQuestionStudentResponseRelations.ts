import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserQuestionStudentResponseRelations1749577487665 implements MigrationInterface {
    name = 'AddUserQuestionStudentResponseRelations1749577487665'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_student_response" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "studentId" varchar, "selectedOptionCorrespondence" varchar NOT NULL, "timestamp" datetime NOT NULL DEFAULT ('CURRENT_TIMESTAMP'), "userId" integer, "questionId" integer, CONSTRAINT "FK_02a48d5c710307db31c8dab17c8" FOREIGN KEY ("questionId") REFERENCES "question" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_student_response"("id", "studentId", "selectedOptionCorrespondence", "timestamp", "userId", "questionId") SELECT "id", "studentId", "selectedOptionCorrespondence", "timestamp", "userId", "questionId" FROM "student_response"`);
        await queryRunner.query(`DROP TABLE "student_response"`);
        await queryRunner.query(`ALTER TABLE "temporary_student_response" RENAME TO "student_response"`);
        await queryRunner.query(`CREATE TABLE "temporary_student_response" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "selectedOptionCorrespondence" varchar NOT NULL, "timestamp" datetime NOT NULL DEFAULT ('CURRENT_TIMESTAMP'), "userId" integer, "questionId" integer, CONSTRAINT "FK_02a48d5c710307db31c8dab17c8" FOREIGN KEY ("questionId") REFERENCES "question" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_student_response"("id", "selectedOptionCorrespondence", "timestamp", "userId", "questionId") SELECT "id", "selectedOptionCorrespondence", "timestamp", "userId", "questionId" FROM "student_response"`);
        await queryRunner.query(`DROP TABLE "student_response"`);
        await queryRunner.query(`ALTER TABLE "temporary_student_response" RENAME TO "student_response"`);
        await queryRunner.query(`CREATE TABLE "temporary_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "username" varchar NOT NULL, "password" varchar NOT NULL, "fullName" varchar NOT NULL, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"))`);
        await queryRunner.query(`INSERT INTO "temporary_user"("id", "username", "password", "fullName") SELECT "id", "username", "password", "fullName" FROM "user"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
        await queryRunner.query(`CREATE TABLE "temporary_student_response" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "selectedOptionCorrespondence" varchar NOT NULL, "timestamp" datetime NOT NULL DEFAULT (datetime('now')), "userId" integer NOT NULL, "questionId" integer, CONSTRAINT "FK_02a48d5c710307db31c8dab17c8" FOREIGN KEY ("questionId") REFERENCES "question" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_student_response"("id", "selectedOptionCorrespondence", "timestamp", "userId", "questionId") SELECT "id", "selectedOptionCorrespondence", "timestamp", "userId", "questionId" FROM "student_response"`);
        await queryRunner.query(`DROP TABLE "student_response"`);
        await queryRunner.query(`ALTER TABLE "temporary_student_response" RENAME TO "student_response"`);
        await queryRunner.query(`CREATE TABLE "temporary_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "username" varchar NOT NULL, "password" varchar NOT NULL, "fullName" varchar, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"))`);
        await queryRunner.query(`INSERT INTO "temporary_user"("id", "username", "password", "fullName") SELECT "id", "username", "password", "fullName" FROM "user"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
        await queryRunner.query(`CREATE TABLE "temporary_student_response" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "selectedOptionCorrespondence" varchar NOT NULL, "timestamp" datetime NOT NULL DEFAULT (datetime('now')), "userId" integer NOT NULL, "questionId" integer, CONSTRAINT "FK_02a48d5c710307db31c8dab17c8" FOREIGN KEY ("questionId") REFERENCES "question" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_8fb8633ea0e3d2450b84f698c10" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_student_response"("id", "selectedOptionCorrespondence", "timestamp", "userId", "questionId") SELECT "id", "selectedOptionCorrespondence", "timestamp", "userId", "questionId" FROM "student_response"`);
        await queryRunner.query(`DROP TABLE "student_response"`);
        await queryRunner.query(`ALTER TABLE "temporary_student_response" RENAME TO "student_response"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student_response" RENAME TO "temporary_student_response"`);
        await queryRunner.query(`CREATE TABLE "student_response" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "selectedOptionCorrespondence" varchar NOT NULL, "timestamp" datetime NOT NULL DEFAULT (datetime('now')), "userId" integer NOT NULL, "questionId" integer, CONSTRAINT "FK_02a48d5c710307db31c8dab17c8" FOREIGN KEY ("questionId") REFERENCES "question" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "student_response"("id", "selectedOptionCorrespondence", "timestamp", "userId", "questionId") SELECT "id", "selectedOptionCorrespondence", "timestamp", "userId", "questionId" FROM "temporary_student_response"`);
        await queryRunner.query(`DROP TABLE "temporary_student_response"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "username" varchar NOT NULL, "password" varchar NOT NULL, "fullName" varchar NOT NULL, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"))`);
        await queryRunner.query(`INSERT INTO "user"("id", "username", "password", "fullName") SELECT "id", "username", "password", "fullName" FROM "temporary_user"`);
        await queryRunner.query(`DROP TABLE "temporary_user"`);
        await queryRunner.query(`ALTER TABLE "student_response" RENAME TO "temporary_student_response"`);
        await queryRunner.query(`CREATE TABLE "student_response" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "selectedOptionCorrespondence" varchar NOT NULL, "timestamp" datetime NOT NULL DEFAULT ('CURRENT_TIMESTAMP'), "userId" integer, "questionId" integer, CONSTRAINT "FK_02a48d5c710307db31c8dab17c8" FOREIGN KEY ("questionId") REFERENCES "question" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "student_response"("id", "selectedOptionCorrespondence", "timestamp", "userId", "questionId") SELECT "id", "selectedOptionCorrespondence", "timestamp", "userId", "questionId" FROM "temporary_student_response"`);
        await queryRunner.query(`DROP TABLE "temporary_student_response"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "username" varchar NOT NULL, "password" varchar NOT NULL, "fullName" varchar NOT NULL, "phoneNumber" varchar, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"))`);
        await queryRunner.query(`INSERT INTO "user"("id", "username", "password", "fullName") SELECT "id", "username", "password", "fullName" FROM "temporary_user"`);
        await queryRunner.query(`DROP TABLE "temporary_user"`);
        await queryRunner.query(`ALTER TABLE "student_response" RENAME TO "temporary_student_response"`);
        await queryRunner.query(`CREATE TABLE "student_response" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "studentId" varchar, "selectedOptionCorrespondence" varchar NOT NULL, "timestamp" datetime NOT NULL DEFAULT ('CURRENT_TIMESTAMP'), "userId" integer, "questionId" integer, CONSTRAINT "FK_02a48d5c710307db31c8dab17c8" FOREIGN KEY ("questionId") REFERENCES "question" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "student_response"("id", "selectedOptionCorrespondence", "timestamp", "userId", "questionId") SELECT "id", "selectedOptionCorrespondence", "timestamp", "userId", "questionId" FROM "temporary_student_response"`);
        await queryRunner.query(`DROP TABLE "temporary_student_response"`);
        await queryRunner.query(`ALTER TABLE "student_response" RENAME TO "temporary_student_response"`);
        await queryRunner.query(`CREATE TABLE "student_response" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "studentId" varchar, "selectedOptionCorrespondence" varchar NOT NULL, "timestamp" datetime NOT NULL DEFAULT ('CURRENT_TIMESTAMP'), "userId" integer, "questionId" integer, CONSTRAINT "FK_8fb8633ea0e3d2450b84f698c10" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE SET NULL ON UPDATE NO ACTION, CONSTRAINT "FK_02a48d5c710307db31c8dab17c8" FOREIGN KEY ("questionId") REFERENCES "question" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "student_response"("id", "studentId", "selectedOptionCorrespondence", "timestamp", "userId", "questionId") SELECT "id", "studentId", "selectedOptionCorrespondence", "timestamp", "userId", "questionId" FROM "temporary_student_response"`);
        await queryRunner.query(`DROP TABLE "temporary_student_response"`);
    }

}
