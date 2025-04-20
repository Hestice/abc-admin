import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAnimalStatus1745145827218 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum type if it doesn't exist
    await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_enum') THEN
                    CREATE TYPE status_enum AS ENUM ('alive', 'dead', 'unknown', 'lost');
                END IF;
            END
            $$;
        `);

    // Add animalStatus column to patients table
    await queryRunner.query(`
            ALTER TABLE "patients" 
            ADD COLUMN IF NOT EXISTS "animalStatus" status_enum DEFAULT 'unknown'
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove the column
    await queryRunner.query(`
            ALTER TABLE "patients" 
            DROP COLUMN IF EXISTS "animalStatus"
        `);

    // We don't drop the enum type as it might be used elsewhere
  }
}
