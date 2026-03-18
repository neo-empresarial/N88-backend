import { MigrationInterface, QueryRunner } from 'typeorm';

export class MoveOrderHistoryNoVacanciesToSubjects1775000000000
  implements MigrationInterface
{
  name = 'MoveOrderHistoryNoVacanciesToSubjects1775000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "subjects" ADD "pedidos_sem_vaga" integer`,
    );

    await queryRunner.query(
      `UPDATE "subjects" AS subjects
       SET "pedidos_sem_vaga" = order_history."quantity"
       FROM "order_history_no_vacancies" AS order_history
       WHERE order_history."subject_id" = subjects."idsubject"
       AND order_history."semester_id" = subjects."semester_id"`,
    );

    await queryRunner.query(
      `UPDATE "subjects" SET "pedidos_sem_vaga" = 0 WHERE "pedidos_sem_vaga" IS NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE "subjects" ALTER COLUMN "pedidos_sem_vaga" SET NOT NULL`,
    );

    await queryRunner.query(`DROP TABLE "order_history_no_vacancies"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "order_history_no_vacancies" (
        "id" SERIAL NOT NULL,
        "subject_id" integer NOT NULL,
        "semester_id" integer NOT NULL,
        "quantity" integer NOT NULL,
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "CHK_order_history_quantity" CHECK ("quantity" >= 0),
        CONSTRAINT "UQ_order_history_subject_semester" UNIQUE ("subject_id", "semester_id"),
        CONSTRAINT "PK_order_history_no_vacancies" PRIMARY KEY ("id")
      )`,
    );

    await queryRunner.query(
      `ALTER TABLE "order_history_no_vacancies"
       ADD CONSTRAINT "FK_order_history_subject"
       FOREIGN KEY ("subject_id")
       REFERENCES "subjects"("idsubject")
       ON DELETE CASCADE`,
    );

    await queryRunner.query(
      `ALTER TABLE "order_history_no_vacancies"
       ADD CONSTRAINT "FK_order_history_semester"
       FOREIGN KEY ("semester_id")
       REFERENCES "semesters"("id")
       ON DELETE CASCADE`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_order_history_semester_id"
       ON "order_history_no_vacancies" ("semester_id")`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_order_history_subject_id"
       ON "order_history_no_vacancies" ("subject_id")`,
    );

    await queryRunner.query(
      `INSERT INTO "order_history_no_vacancies" ("subject_id", "semester_id", "quantity")
       SELECT "idsubject", "semester_id", "pedidos_sem_vaga"
       FROM "subjects"`,
    );

    await queryRunner.query(
      `ALTER TABLE "subjects" DROP COLUMN "pedidos_sem_vaga"`,
    );
  }
}
