import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFriendsTable1757685906246 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE friend_status AS ENUM('pending', 'accepted', 'blocked');
        `);
    await queryRunner.query(`
            CREATE TABLE friends (
                id SERIAL PRIMARY KEY,
                requester_id INTEGER NOT NULL,
                addressee_id INTEGER NOT NULL,
                status friend_status DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (requester_id) REFERENCES users(iduser) ON DELETE CASCADE,
                FOREIGN KEY (addressee_id) REFERENCES users(iduser) ON DELETE CASCADE
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE friends;`);
    await queryRunner.query(`DROP TYPE friend_status;`);
  }
}
