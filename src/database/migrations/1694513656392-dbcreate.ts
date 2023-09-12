import { MigrationInterface, QueryRunner } from "typeorm";

export class Dbcreate1694513656392 implements MigrationInterface {
    name = 'Dbcreate1694513656392'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ranking_board" ("id" SERIAL NOT NULL, "tag" character varying NOT NULL, "token" character varying NOT NULL, "date" tstzrange NOT NULL, CONSTRAINT "PK_b52998d1cce33ef437dd769fe1b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7f9f42434d2be7cd07b9508001" ON "ranking_board" ("token") `);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "userId" character varying NOT NULL, "userName" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'Guest', "ipAddress" character varying NOT NULL, "amount" numeric NOT NULL DEFAULT '0', "tokens" jsonb NOT NULL DEFAULT '{}', "oneTimeCode" character varying NOT NULL DEFAULT '', "skin" jsonb NOT NULL DEFAULT '[]', CONSTRAINT "PK_1bd17e66f73b77cbd47fe4bef0b" PRIMARY KEY ("id", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d72ea127f30e21753c9e229891" ON "user" ("userId") `);
        await queryRunner.query(`CREATE TABLE "ranking_entry" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "board" integer NOT NULL, "amount" integer NOT NULL, "userUserId" character varying, CONSTRAINT "PK_572074811b085ab97e391a7da09" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f76b5ec30b83894c39e25c48da" ON "ranking_entry" ("board") `);
        await queryRunner.query(`CREATE TABLE "shop" ("id" SERIAL NOT NULL, "shopName" character varying NOT NULL, "owner" character varying NOT NULL, "member" jsonb NOT NULL DEFAULT '[]', "amount" numeric NOT NULL DEFAULT '0', "lastAmount" numeric NOT NULL DEFAULT '0', "autoSendAddress" jsonb NOT NULL DEFAULT '{}', "autoSendToBeLeft" numeric NOT NULL DEFAULT '0', CONSTRAINT "PK_ad47b7c6121fe31cb4b05438e44" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "skin" ("id" character varying NOT NULL, "url" character varying NOT NULL, CONSTRAINT "PK_97972756e0d7195ced4ee8a5a18" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_97972756e0d7195ced4ee8a5a1" ON "skin" ("id") `);
        await queryRunner.query(`CREATE TABLE "token" ("name" character varying NOT NULL, "owner" character varying NOT NULL, "rate" numeric(6,2) NOT NULL, "checkingIp" boolean NOT NULL, "rankingType" character varying NOT NULL DEFAULT 'none', "operationType" character varying NOT NULL DEFAULT 'none', "operator" character varying NOT NULL DEFAULT '', CONSTRAINT "PK_dc9680c2bbb75483a58b9c4fc50" PRIMARY KEY ("name"))`);
        await queryRunner.query(`CREATE TABLE "api_key" ("key" character varying NOT NULL, "owner" character varying NOT NULL, "permissions" jsonb NOT NULL DEFAULT '[]', "paramsWhiteList" jsonb NOT NULL DEFAULT '{}', "ipCheckExcludes" jsonb NOT NULL DEFAULT '[]', CONSTRAINT "PK_fb080786c16de6ace7ed0b69f7d" PRIMARY KEY ("key"))`);
        await queryRunner.query(`CREATE TABLE "permission" ("id" character varying NOT NULL, "allowedPaths" jsonb NOT NULL, "placeHolder" jsonb NOT NULL DEFAULT '[]', CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "log" ("id" SERIAL NOT NULL, "date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT '2000-01-01 00:00:00.000+09:00', "bankType" character varying NOT NULL, "bankId" character varying NOT NULL, "logType" character varying NOT NULL, "logText" character varying NOT NULL, "reason" character varying NOT NULL, CONSTRAINT "PK_350604cbdf991d5930d9e618fbd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_83f0fd94b79094ecb83becb348" ON "log" ("bankId") `);
        await queryRunner.query(`CREATE TABLE "executed_message" ("id" SERIAL NOT NULL, "msgId" character varying NOT NULL, CONSTRAINT "PK_b41a9df6d9fd02833b6d9e357b3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "ranking_entry" ADD CONSTRAINT "FK_86ee5108615135477bdd449a26f" FOREIGN KEY ("userId", "userUserId") REFERENCES "user"("id","userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ranking_entry" DROP CONSTRAINT "FK_86ee5108615135477bdd449a26f"`);
        await queryRunner.query(`DROP TABLE "executed_message"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_83f0fd94b79094ecb83becb348"`);
        await queryRunner.query(`DROP TABLE "log"`);
        await queryRunner.query(`DROP TABLE "permission"`);
        await queryRunner.query(`DROP TABLE "api_key"`);
        await queryRunner.query(`DROP TABLE "token"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97972756e0d7195ced4ee8a5a1"`);
        await queryRunner.query(`DROP TABLE "skin"`);
        await queryRunner.query(`DROP TABLE "shop"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f76b5ec30b83894c39e25c48da"`);
        await queryRunner.query(`DROP TABLE "ranking_entry"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d72ea127f30e21753c9e229891"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7f9f42434d2be7cd07b9508001"`);
        await queryRunner.query(`DROP TABLE "ranking_board"`);
    }

}
