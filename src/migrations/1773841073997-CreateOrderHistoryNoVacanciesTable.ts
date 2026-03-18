import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrderHistoryNoVacanciesTable1773841073997
  implements MigrationInterface
{
  name = 'CreateOrderHistoryNoVacanciesTable1773841073997';

  public async up(queryRunner: QueryRunner): Promise<void> {
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_order_history_subject_id"`);
    await queryRunner.query(`DROP INDEX "IDX_order_history_semester_id"`);
    await queryRunner.query(
      `ALTER TABLE "order_history_no_vacancies" DROP CONSTRAINT "FK_order_history_semester"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_history_no_vacancies" DROP CONSTRAINT "FK_order_history_subject"`,
    );
    await queryRunner.query(`DROP TABLE "order_history_no_vacancies" CASCADE`);
  }
}
