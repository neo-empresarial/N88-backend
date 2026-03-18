import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSemesterToSubjects1773840645392 implements MigrationInterface {
  name = 'AddSemesterToSubjects1773840645392';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Step 1: Add column as nullable (allows existing rows)
    await queryRunner.query(`ALTER TABLE "subjects" ADD "semester_id" integer`);

    // Step 2: Ensure "2026.1" semester exists (Worker 1 should have created it)
    await queryRunner.query(
      `INSERT INTO "semesters" ("semester") 
       VALUES ('2026.1') 
       ON CONFLICT ("semester") DO NOTHING`,
    );

    // Step 3: Update all existing subjects to reference "2026.1"
    await queryRunner.query(
      `UPDATE "subjects" 
       SET "semester_id" = (SELECT id FROM "semesters" WHERE semester = '2026.1')
       WHERE "semester_id" IS NULL`,
    );

    // Step 4: Verify all subjects have semester_id (safety check)
    const result = await queryRunner.query(
      `SELECT COUNT(*) as count FROM "subjects" WHERE "semester_id" IS NULL`,
    );
    if (result[0].count > 0) {
      throw new Error(
        `Migration failed: ${result[0].count} subjects still have NULL semester_id`,
      );
    }

    // Step 5: Set NOT NULL constraint
    await queryRunner.query(
      `ALTER TABLE "subjects" ALTER COLUMN "semester_id" SET NOT NULL`,
    );

    // Step 6: Add foreign key constraint
    await queryRunner.query(
      `ALTER TABLE "subjects" 
       ADD CONSTRAINT "FK_subjects_semester" 
       FOREIGN KEY ("semester_id") 
       REFERENCES "semesters"("id") 
       ON DELETE CASCADE`,
    );

    // Step 7: Drop old unique constraint on code (if exists)
    await queryRunner.query(
      `ALTER TABLE "subjects" DROP CONSTRAINT IF EXISTS "UQ_542cbba74dde3c82ab49c573109"`,
    );

    // Step 8: Add composite unique constraint (code + semester_id)
    await queryRunner.query(
      `ALTER TABLE "subjects" 
       ADD CONSTRAINT "UQ_subjects_code_semester" 
       UNIQUE ("code", "semester_id")`,
    );

    // Step 9: Create index for faster semester queries
    await queryRunner.query(
      `CREATE INDEX "IDX_subjects_semester_id" ON "subjects" ("semester_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverse order of up()
    await queryRunner.query(`DROP INDEX "IDX_subjects_semester_id"`);
    await queryRunner.query(
      `ALTER TABLE "subjects" DROP CONSTRAINT "UQ_subjects_code_semester"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subjects" ADD CONSTRAINT "UQ_542cbba74dde3c82ab49c573109" UNIQUE ("code")`,
    );
    await queryRunner.query(
      `ALTER TABLE "subjects" DROP CONSTRAINT "FK_subjects_semester"`,
    );
    await queryRunner.query(`ALTER TABLE "subjects" DROP COLUMN "semester_id"`);
  }
}
