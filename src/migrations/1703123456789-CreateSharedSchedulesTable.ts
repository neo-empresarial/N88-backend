import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateSharedSchedulesTable1703123456789
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'shared_schedules',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'scheduleId',
            type: 'int',
          },
          {
            name: 'sharedByUserId',
            type: 'int',
          },
          {
            name: 'sharedWithUserId',
            type: 'int',
          },
          {
            name: 'groupId',
            type: 'int',
          },
          {
            name: 'sharedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'isAccepted',
            type: 'boolean',
            default: false,
          },
          {
            name: 'acceptedAt',
            type: 'timestamp',
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['scheduleId'],
            referencedColumnNames: ['idsavedschedule'],
            referencedTableName: 'saved_schedules',
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['sharedByUserId'],
            referencedColumnNames: ['iduser'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['sharedWithUserId'],
            referencedColumnNames: ['iduser'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['groupId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'group',
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('shared_schedules');
  }
}
