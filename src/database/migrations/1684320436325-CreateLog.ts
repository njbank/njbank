import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateLog1684320436325 implements MigrationInterface {
    name = 'CreateLog1684320436325'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "log" ("id" SERIAL NOT NULL, "bankType" character varying NOT NULL, "bankId" character varying NOT NULL, "logType" character varying NOT NULL, "logText" character varying NOT NULL, "reason" character varying NOT NULL, CONSTRAINT "PK_350604cbdf991d5930d9e618fbd" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "log"`);
    }

}
