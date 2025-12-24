import { MigrationInterface, QueryRunner } from 'typeorm';

export class InviteCodes1766546648442 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create invite_codes table
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "invite_codes" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "code" uuid NOT NULL UNIQUE,
                "created_by" uuid NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "is_active" BOOLEAN NOT NULL DEFAULT true,
                "consumed_by" uuid,
                "consumed_at" TIMESTAMP,
                CONSTRAINT "fk_invite_code_created_by" FOREIGN KEY ("created_by") REFERENCES "users"("id"),
                CONSTRAINT "fk_invite_code_consumed_by" FOREIGN KEY ("consumed_by") REFERENCES "users"("id")
            )
        `);

    console.log('Created invite_codes table');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the invite_codes table if migration needs to be reverted
    await queryRunner.query(`
            DROP TABLE IF EXISTS "invite_codes"
        `);

    console.log('Dropped invite_codes table');
  }
}
