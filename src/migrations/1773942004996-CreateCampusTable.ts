import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateCampusTable1773942004996 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criar tabela campus
    await queryRunner.createTable(
      new Table({
        name: 'campus',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
            isUnique: true,
            isNullable: false,
          },
        ],
      }),
      true,
    );

    // Popular tabela com 5 campi
    await queryRunner.query(`
      INSERT INTO campus (name) VALUES 
        ('Florianópolis'),
        ('Joinville'),
        ('Curitibanos'),
        ('Araranguá'),
        ('Blumenau')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('campus');
  }
}
