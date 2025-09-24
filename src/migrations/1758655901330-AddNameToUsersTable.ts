import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddNameToUsersTable1758650209495 implements MigrationInterface {
    name = 'AddNameToUsersTable1758650209495'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("users", new TableColumn({
            name: "name",
            type: "varchar",
            isNullable: false,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("users", "name");
    }
}