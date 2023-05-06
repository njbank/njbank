import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRanking1683349493945 implements MigrationInterface {
    name = 'CreateRanking1683349493945'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ranking_board" ("id" SERIAL NOT NULL, "tag" character varying NOT NULL, "token" character varying NOT NULL, "date" tstzrange NOT NULL, CONSTRAINT "PK_b52998d1cce33ef437dd769fe1b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7f9f42434d2be7cd07b9508001" ON "ranking_board" ("token") `);
        await queryRunner.query(`CREATE TABLE "ranking_entries" ("id" SERIAL NOT NULL, "userId" character varying NOT NULL, "userName" character varying NOT NULL, "board" integer NOT NULL, "amount" integer NOT NULL, CONSTRAINT "PK_d96715e4495075ef3427c9d0953" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_99e6bb0c9a1c03cc1e2337e3b7" ON "ranking_entries" ("board") `);
        await queryRunner.query(`ALTER TABLE "Token" ADD "rankingType" character varying NOT NULL DEFAULT 'none'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Token" DROP COLUMN "rankingType"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_99e6bb0c9a1c03cc1e2337e3b7"`);
        await queryRunner.query(`DROP TABLE "ranking_entries"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7f9f42434d2be7cd07b9508001"`);
        await queryRunner.query(`DROP TABLE "ranking_board"`);
    }

}
