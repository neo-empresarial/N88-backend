import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class AddCourseIdToUsersTable1758715869000 implements MigrationInterface {
    name = 'AddCourseIdToUsersTable1758715869000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("users", new TableColumn({
            name: "courseId",
            type: "int",
            isNullable: true,
        }));
        
        await queryRunner.createForeignKey("users", new TableForeignKey({
            columnNames: ["courseId"],
            referencedColumnNames: ["idcourse"],
            referencedTableName: "courses",
            onDelete: "SET NULL",
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("users", "FK_YOUR_FOREIGN_KEY_NAME");
        await queryRunner.dropColumn("users", "courseId");
    }
}