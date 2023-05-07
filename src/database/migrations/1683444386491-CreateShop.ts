import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateShop1683444386491 implements MigrationInterface {
    name = 'CreateShop1683444386491'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "shop" ("id" SERIAL NOT NULL, "shopName" character varying NOT NULL, "owner" character varying NOT NULL, "member" jsonb NOT NULL DEFAULT '[]', "amount" integer NOT NULL DEFAULT '0', "lastAmount" integer NOT NULL DEFAULT '0', "autoSendAddress" jsonb NOT NULL DEFAULT '{}', "autoSendToBeLeft" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_ad47b7c6121fe31cb4b05438e44" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "shop"`);
    }

}
