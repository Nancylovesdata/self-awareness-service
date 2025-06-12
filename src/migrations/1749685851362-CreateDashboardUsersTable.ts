import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDashboardUsersTable1749685851362 implements MigrationInterface {
    name = 'CreateDashboardUsersTable1749685851362'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "dashboard_users" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'user', CONSTRAINT "UQ_507b02a1dd4a2b320b60dfa6485" UNIQUE ("username"), CONSTRAINT "PK_a34bdf209c625b674f61a9a60dc" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "dashboard_users"`);
    }

}
