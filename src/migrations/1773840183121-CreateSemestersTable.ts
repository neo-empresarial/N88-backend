import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSemestersTable1773840183121 implements MigrationInterface {
  name = 'CreateSemestersTable1773840183121';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "semesters" (
        "id" SERIAL NOT NULL,
        "semester" VARCHAR(10) NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_semesters_semester" UNIQUE ("semester"),
        CONSTRAINT "PK_semesters" PRIMARY KEY ("id")
      )`,
    );

    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_semesters_semester" ON "semesters" ("semester")`,
    );

    await queryRunner.query(
      `INSERT INTO "semesters" ("semester") VALUES ('2026.1')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_semesters_semester"`);
    await queryRunner.query(`DROP TABLE "semesters" CASCADE`);
  }
}
