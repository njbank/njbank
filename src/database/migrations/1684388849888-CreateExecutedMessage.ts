import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateExecutedMessage1684388849888 implements MigrationInterface {
    name = 'CreateExecutedMessage1684388849888'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "date" SET DEFAULT '2000-01-01 00:00:00.000+09:00'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "date" SET DEFAULT '2000-01-01 00:00:00+09'`);
    }

}
