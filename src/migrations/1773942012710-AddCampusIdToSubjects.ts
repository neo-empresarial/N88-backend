import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddCampusIdToSubjects1773942012710 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'subjects',
      new TableColumn({
        name: 'campus_id',
        type: 'int',
        isNullable: true,
      }),
    );

    const florianopolisResult = await queryRunner.query(
      `SELECT id FROM campus WHERE name = 'Florianópolis' LIMIT 1`,
    );
    const florianopolisId = florianopolisResult[0]?.id;

    if (!florianopolisId) {
      throw new Error(
        'Campus Florianópolis não encontrado. Execute migration anterior.',
      );
    }

    await queryRunner.query(
      `UPDATE subjects SET campus_id = ${florianopolisId} WHERE campus_id IS NULL`,
    );

    await queryRunner.changeColumn(
      'subjects',
      'campus_id',
      new TableColumn({
        name: 'campus_id',
        type: 'int',
        isNullable: false,
      }),
    );

    await queryRunner.createForeignKey(
      'subjects',
      new TableForeignKey({
        columnNames: ['campus_id'],
        referencedTableName: 'campus',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.query(`
      ALTER TABLE subjects DROP CONSTRAINT IF EXISTS "UQ_subjects_code_semester"
    `);

    await queryRunner.query(`
      ALTER TABLE subjects 
      ADD CONSTRAINT "UQ_subjects_code_semester_campus" 
      UNIQUE (code, semester_id, campus_id)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE subjects DROP CONSTRAINT IF EXISTS "UQ_subjects_code_semester_campus"
    `);
    await queryRunner.query(`
      ALTER TABLE subjects 
      ADD CONSTRAINT "UQ_subjects_code_semester" 
      UNIQUE (code, semester_id)
    `);

    const table = await queryRunner.getTable('subjects');
    const foreignKey = table?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('campus_id') !== -1,
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('subjects', foreignKey);
    }
    await queryRunner.dropColumn('subjects', 'campus_id');
  }
}
