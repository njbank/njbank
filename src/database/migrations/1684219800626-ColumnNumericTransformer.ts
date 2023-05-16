import { MigrationInterface, QueryRunner } from "typeorm";

export class ColumnNumericTransformer1684219800626 implements MigrationInterface {
    name = 'ColumnNumericTransformer1684219800626'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shop" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "shop" ADD "amount" numeric NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shop" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "shop" ADD "amount" integer NOT NULL DEFAULT '0'`);
    }

}
