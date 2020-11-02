import {MigrationInterface, QueryRunner} from "typeorm";

export class UserAdditionalAuthData1604083605735 implements MigrationInterface {
    name = 'UserAdditionalAuthData1604083605735'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "mailConfirmed"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "googleId" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "emailConfirmed" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`CREATE TYPE "user_authtype_enum" AS ENUM('web', 'google', 'facebook')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "authType" "user_authtype_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "firstName" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "lastName" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "phone" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "mailConfirmationHashString" DROP NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_470355432cc67b2c470c30bef7" ON "user" ("googleId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_470355432cc67b2c470c30bef7"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "mailConfirmationHashString" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "phone" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "lastName" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "firstName" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "authType"`);
        await queryRunner.query(`DROP TYPE "user_authtype_enum"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "emailConfirmed"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "googleId"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "mailConfirmed" boolean NOT NULL DEFAULT false`);
    }

}
