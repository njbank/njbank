import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSkin1683366942192 implements MigrationInterface {
    name = 'CreateSkin1683366942192'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "skin" ("id" character varying NOT NULL, "url" character varying NOT NULL, CONSTRAINT "PK_97972756e0d7195ced4ee8a5a18" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_97972756e0d7195ced4ee8a5a1" ON "skin" ("id") `);
        await queryRunner.query(`ALTER TABLE "User" ADD "skin" jsonb NOT NULL DEFAULT '["NONE"]'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "User" DROP COLUMN "skin"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97972756e0d7195ced4ee8a5a1"`);
        await queryRunner.query(`DROP TABLE "skin"`);
    }

}
