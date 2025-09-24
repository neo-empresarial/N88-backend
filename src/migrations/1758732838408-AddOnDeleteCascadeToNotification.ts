import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class AddOnDeleteCascadeToNotification1758732838409 implements MigrationInterface {
    name = 'AddOnDeleteCascadeToNotification1758732838409'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop a chave estrangeira existente
        await queryRunner.dropForeignKey("notification", "FK_2f7dcc604f60fce7609d29d809e");

        // Cria a nova chave estrangeira com ON DELETE CASCADE
        await queryRunner.createForeignKey(
            "notification",
            new TableForeignKey({
                columnNames: ["groupId"],
                referencedColumnNames: ["id"],
                referencedTableName: "group",
                name: "FK_2f7dcc604f60fce7609d29d809e",
                onDelete: "CASCADE", // Ação de delete que você quer
                onUpdate: "NO ACTION"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop a chave estrangeira com ON DELETE CASCADE
        await queryRunner.dropForeignKey("notification", "FK_2f7dcc604f60fce7609d29d809e");

        // Recria a chave estrangeira original (sem ON DELETE CASCADE)
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