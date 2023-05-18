import { MigrationInterface, QueryRunner } from "typeorm";

export class IndexingLog1684395351279 implements MigrationInterface {
    name = 'IndexingLog1684395351279'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "date" SET DEFAULT '2000-01-01 00:00:00.000+09:00'`);
        await queryRunner.query(`CREATE INDEX "IDX_83f0fd94b79094ecb83becb348" ON "log" ("bankId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_83f0fd94b79094ecb83becb348"`);
        await queryRunner.query(`ALTER TABLE "log" ALTER COLUMN "date" SET DEFAULT '2000-01-01 00:00:00+09'`);
    }

}
