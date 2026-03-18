import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCreditsToSavedScheduleItems1773780191902
  implements MigrationInterface
{
  name = 'AddCreditsToSavedScheduleItems1773780191902';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "saved_schedule_items" ADD "credits" integer NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "saved_schedule_items" DROP COLUMN "credits"`,
    );
  }
}
