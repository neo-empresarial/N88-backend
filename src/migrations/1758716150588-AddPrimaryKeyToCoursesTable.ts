import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPrimaryKeyToCoursesTable1758715868841 implements MigrationInterface {
    name = 'AddPrimaryKeyToCoursesTable1758715868841' // O número será diferente no seu arquivo

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "courses" ADD CONSTRAINT "PK_8017e9ec507232a36ba491d2012" PRIMARY KEY ("idcourse")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "courses" DROP CONSTRAINT "PK_8017e9ec507232a36ba491d2012"`);
    }
}