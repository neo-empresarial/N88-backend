import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class AddOnDeleteCascadeToNotification1758732838409 implements MigrationInterface {
    name = 'AddOnDeleteCascadeToNotification1758732838409'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("notification", "FK_2f7dcc604f60fce7609d29d809e");
        
        await queryRunner.createForeignKey(
            "notification",
            new TableForeignKey({
                columnNames: ["groupId"],
                referencedColumnNames: ["id"],
                referencedTableName: "group",
                name: "FK_2f7dcc604f60fce7609d29d809e",
                onDelete: "CASCADE",
                onUpdate: "NO ACTION"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("notification", "FK_2f7dcc604f60fce7609d29d809e");

        await queryRunner.createForeignKey(
            "notification",
            new TableForeignKey({
                columnNames: ["groupId"],
                referencedColumnNames: ["id"],
                referencedTableName: "group",
                name: "FK_2f7dcc604f60fce7609d29d809e",
                onDelete: "NO ACTION",
                onUpdate: "NO ACTION"
            })
        );
    }
}