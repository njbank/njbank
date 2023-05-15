import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProject1684049269271 implements MigrationInterface {
    name = 'CreateProject1684049269271'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ranking_board" ("id" SERIAL NOT NULL, "tag" character varying NOT NULL, "token" character varying NOT NULL, "date" tstzrange NOT NULL, CONSTRAINT "PK_b52998d1cce33ef437dd769fe1b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7f9f42434d2be7cd07b9508001" ON "ranking_board" ("token") `);
        await queryRunner.query(`CREATE TABLE "User" ("id" character varying NOT NULL, "userName" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'Guest', "ipAddress" character varying NOT NULL, "amount" numeric NOT NULL DEFAULT '0', "tokens" jsonb NOT NULL DEFAULT '{}', "oneTimeCode" character varying NOT NULL DEFAULT '', "skin" jsonb NOT NULL DEFAULT '[]', CONSTRAINT "PK_9862f679340fb2388436a5ab3e4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ranking_entry" ("id" SERIAL NOT NULL, "userId" character varying NOT NULL, "board" integer NOT NULL, "amount" integer NOT NULL, CONSTRAINT "PK_572074811b085ab97e391a7da09" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f76b5ec30b83894c39e25c48da" ON "ranking_entry" ("board") `);
        await queryRunner.query(`CREATE TABLE "shop" ("id" SERIAL NOT NULL, "shopName" character varying NOT NULL, "owner" character varying NOT NULL, "member" jsonb NOT NULL DEFAULT '[]', "amount" integer NOT NULL DEFAULT '0', "lastAmount" integer NOT NULL DEFAULT '0', "autoSendAddress" jsonb NOT NULL DEFAULT '{}', "autoSendToBeLeft" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_ad47b7c6121fe31cb4b05438e44" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "skin" ("id" character varying NOT NULL, "url" character varying NOT NULL, CONSTRAINT "PK_97972756e0d7195ced4ee8a5a18" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_97972756e0d7195ced4ee8a5a1" ON "skin" ("id") `);
        await queryRunner.query(`CREATE TABLE "Token" ("name" character varying NOT NULL, "owner" character varying NOT NULL, "rate" numeric(6,2) NOT NULL, "checkingIp" boolean NOT NULL, "rankingType" character varying NOT NULL DEFAULT 'none', "operationType" character varying NOT NULL DEFAULT 'none', "operator" character varying NOT NULL DEFAULT '', CONSTRAINT "PK_1e764a4f3eaee9050cce8da5be7" PRIMARY KEY ("name"))`);
        await queryRunner.query(`CREATE TABLE "api_key" ("key" character varying NOT NULL, "owner" character varying NOT NULL, "permissions" jsonb NOT NULL DEFAULT '[]', "paramsWhiteList" jsonb NOT NULL DEFAULT '{}', "ipCheckExcludes" jsonb NOT NULL DEFAULT '[]', CONSTRAINT "PK_fb080786c16de6ace7ed0b69f7d" PRIMARY KEY ("key"))`);
        await queryRunner.query(`CREATE TABLE "permission" ("id" character varying NOT NULL, "allowedPaths" jsonb NOT NULL, "placeHolder" jsonb NOT NULL DEFAULT '[]', CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "ranking_entry" ADD CONSTRAINT "FK_de44e434f37609060380b400f13" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ranking_entry" DROP CONSTRAINT "FK_de44e434f37609060380b400f13"`);
        await queryRunner.query(`DROP TABLE "permission"`);
        await queryRunner.query(`DROP TABLE "api_key"`);
        await queryRunner.query(`DROP TABLE "Token"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97972756e0d7195ced4ee8a5a1"`);
        await queryRunner.query(`DROP TABLE "skin"`);
        await queryRunner.query(`DROP TABLE "shop"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f76b5ec30b83894c39e25c48da"`);
        await queryRunner.query(`DROP TABLE "ranking_entry"`);
        await queryRunner.query(`DROP TABLE "User"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7f9f42434d2be7cd07b9508001"`);
        await queryRunner.query(`DROP TABLE "ranking_board"`);
    }

}
