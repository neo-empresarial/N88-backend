import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddCampusIdToCourses1773942026454 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'courses',
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
      throw new Error('Campus Florianópolis não encontrado.');
    }

    await queryRunner.query(
      `UPDATE courses SET campus_id = ${florianopolisId} WHERE campus_id IS NULL`,
    );

    await queryRunner.changeColumn(
      'courses',
      'campus_id',
      new TableColumn({
        name: 'campus_id',
        type: 'int',
        isNullable: false,
      }),
    );

    await queryRunner.createForeignKey(
      'courses',
      new TableForeignKey({
        columnNames: ['campus_id'],
        referencedTableName: 'campus',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('courses');
    const foreignKey = table?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('campus_id') !== -1,
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('courses', foreignKey);
    }
    await queryRunner.dropColumn('courses', 'campus_id');
  }
}
