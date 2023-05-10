import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOperator1683704379089 implements MigrationInterface {
    name = 'CreateOperator1683704379089'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Token" ADD "operationType" character varying NOT NULL DEFAULT 'none'`);
        await queryRunner.query(`ALTER TABLE "Token" ADD "operator" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Token" DROP COLUMN "operator"`);
        await queryRunner.query(`ALTER TABLE "Token" DROP COLUMN "operationType"`);
    }

}
