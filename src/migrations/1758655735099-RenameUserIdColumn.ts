import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameUserIdColumn1758650209494 implements MigrationInterface {
    name = 'RenameUserIdColumn1758650209494'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameColumn("users", "id", "iduser");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameColumn("users", "iduser", "id");
    }
}