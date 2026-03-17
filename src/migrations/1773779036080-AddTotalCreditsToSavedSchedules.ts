import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTotalCreditsToSavedSchedules1773779036080 implements MigrationInterface {
    name = 'AddTotalCreditsToSavedSchedules1773779036080'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "saved_schedules" ADD "totalCredits" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "saved_schedules" DROP COLUMN "totalCredits"`);
    }

}
