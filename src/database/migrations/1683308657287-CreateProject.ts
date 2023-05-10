import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProject1683308657287 implements MigrationInterface {
    name = 'CreateProject1683308657287'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "User" ("id" character varying NOT NULL, "userName" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'Guest', "ipAddress" character varying NOT NULL, "amount" numeric NOT NULL DEFAULT '0', "tokens" jsonb NOT NULL DEFAULT '{}', "oneTimeCode" character varying NOT NULL DEFAULT '', CONSTRAINT "PK_9862f679340fb2388436a5ab3e4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Token" ("name" character varying NOT NULL, "owner" character varying NOT NULL, "rate" numeric(6,2) NOT NULL, "checkingIp" boolean NOT NULL, CONSTRAINT "PK_1e764a4f3eaee9050cce8da5be7" PRIMARY KEY ("name"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "Token"`);
        await queryRunner.query(`DROP TABLE "User"`);
    }

}
