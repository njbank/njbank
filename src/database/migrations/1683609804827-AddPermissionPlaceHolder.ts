import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPermissionPlaceHolder1683609804827 implements MigrationInterface {
    name = 'AddPermissionPlaceHolder1683609804827'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permission" ADD "placeHolder" jsonb NOT NULL DEFAULT '[]'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permission" DROP COLUMN "placeHolder"`);
    }

}
