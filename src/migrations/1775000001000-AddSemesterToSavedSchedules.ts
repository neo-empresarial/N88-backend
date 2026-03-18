import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSemesterToSavedSchedules1775000001000
  implements MigrationInterface
{
  name = 'AddSemesterToSavedSchedules1775000001000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Step 1: Add semester_id column as nullable (allows existing rows)
    await queryRunner.query(
      `ALTER TABLE "saved_schedules" ADD "semester_id" integer`,
    );

    // Step 2: Ensure "2026.1" semester exists (should already exist from previous migration)
    await queryRunner.query(
      `INSERT INTO "semesters" ("semester") 
       VALUES ('2026.1') 
       ON CONFLICT ("semester") DO NOTHING`,
    );

    // Step 3: Update all existing saved_schedules to reference "2026.1" as default
    await queryRunner.query(
      `UPDATE "saved_schedules" 
       SET "semester_id" = (SELECT id FROM "semesters" WHERE semester = '2026.1')
       WHERE "semester_id" IS NULL`,
    );

    // Step 4: Add foreign key constraint (but keep nullable for future flexibility)
    await queryRunner.query(
      `ALTER TABLE "saved_schedules" 
       ADD CONSTRAINT "FK_saved_schedules_semester" 
       FOREIGN KEY ("semester_id") 
       REFERENCES "semesters"("id") 
       ON DELETE SET NULL`,
    );

    // Step 5: Create index for faster semester queries
    await queryRunner.query(
      `CREATE INDEX "IDX_saved_schedules_semester_id" ON "saved_schedules" ("semester_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverse order of up()
    await queryRunner.query(`DROP INDEX "IDX_saved_schedules_semester_id"`);
    await queryRunner.query(
      `ALTER TABLE "saved_schedules" DROP CONSTRAINT "FK_saved_schedules_semester"`,
    );
    await queryRunner.query(
      `ALTER TABLE "saved_schedules" DROP COLUMN "semester_id"`,
    );
  }
}
