import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddPlanNumberToSavedScheduleItems1773696781056
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'saved_schedule_items',
      new TableColumn({
        name: 'planNumber',
        type: 'int',
        default: 1,
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('saved_schedule_items', 'planNumber');
  }
}
