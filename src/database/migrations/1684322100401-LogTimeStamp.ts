import { MigrationInterface, QueryRunner } from "typeorm";

export class LogTimeStamp1684322100401 implements MigrationInterface {
    name = 'LogTimeStamp1684322100401'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "log" ADD "date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT '2000-01-01 00:00:00.000+09:00'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "log" DROP COLUMN "date"`);
    }

}
