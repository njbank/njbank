import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateApiKey1683602602307 implements MigrationInterface {
    name = 'CreateApiKey1683602602307'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "api_key" ("key" character varying NOT NULL, "owner" character varying NOT NULL, "permissions" jsonb NOT NULL DEFAULT '[]', "paramsWhiteList" jsonb NOT NULL DEFAULT '{}', CONSTRAINT "PK_fb080786c16de6ace7ed0b69f7d" PRIMARY KEY ("key"))`);
        await queryRunner.query(`CREATE TABLE "permission" ("id" character varying NOT NULL, "allowedPaths" jsonb NOT NULL, CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "permission"`);
        await queryRunner.query(`DROP TABLE "api_key"`);
    }

}
