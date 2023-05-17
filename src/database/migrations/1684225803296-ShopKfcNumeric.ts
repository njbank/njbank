import { MigrationInterface, QueryRunner } from "typeorm";

export class ShopKfcNumeric1684225803296 implements MigrationInterface {
    name = 'ShopKfcNumeric1684225803296'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shop" DROP COLUMN "lastAmount"`);
        await queryRunner.query(`ALTER TABLE "shop" ADD "lastAmount" numeric NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "shop" DROP COLUMN "autoSendToBeLeft"`);
        await queryRunner.query(`ALTER TABLE "shop" ADD "autoSendToBeLeft" numeric NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shop" DROP COLUMN "autoSendToBeLeft"`);
        await queryRunner.query(`ALTER TABLE "shop" ADD "autoSendToBeLeft" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "shop" DROP COLUMN "lastAmount"`);
        await queryRunner.query(`ALTER TABLE "shop" ADD "lastAmount" integer NOT NULL DEFAULT '0'`);
    }

}
