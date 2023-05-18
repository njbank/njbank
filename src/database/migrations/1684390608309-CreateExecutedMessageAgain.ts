import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateExecutedMessageAgain1684390608309 implements MigrationInterface {
    name = 'CreateExecutedMessageAgain1684390608309'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "executed_message" ("id" SERIAL NOT NULL, "msgId" character varying NOT NULL, CONSTRAINT "PK_b41a9df6d9fd02833b6d9e357b3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "date" SET DEFAULT '2000-01-01 00:00:00.000+09:00'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "date" SET DEFAULT '2000-01-01 00:00:00+09'`);
        await queryRunner.query(`DROP TABLE "executed_message"`);
    }

}
