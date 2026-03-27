import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddCampusIdToSavedSchedules1773942033732
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'saved_schedules',
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
      `UPDATE saved_schedules SET campus_id = ${florianopolisId} WHERE campus_id IS NULL`,
    );

    await queryRunner.changeColumn(
      'saved_schedules',
      'campus_id',
      new TableColumn({
        name: 'campus_id',
        type: 'int',
        isNullable: false,
      }),
    );

    await queryRunner.createForeignKey(
      'saved_schedules',
      new TableForeignKey({
        columnNames: ['campus_id'],
        referencedTableName: 'campus',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('saved_schedules');
    const foreignKey = table?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('campus_id') !== -1,
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('saved_schedules', foreignKey);
    }
    await queryRunner.dropColumn('saved_schedules', 'campus_id');
  }
}
