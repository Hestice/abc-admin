import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSchedules1744536178372 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if the table exists first
    const tableExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'schedules'
      );
    `);

    if (!tableExists[0].exists) {
      // Create enum type for schedule status if it doesn't exist
      await queryRunner.query(`
        DO $$
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'schedule_status_enum') THEN
            CREATE TYPE schedule_status_enum AS ENUM ('in_progress', 'completed');
          END IF;
        END
        $$;
      `);

      // Create schedules table
      await queryRunner.query(`
        CREATE TABLE "schedules" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
          "status" schedule_status_enum NOT NULL DEFAULT 'in_progress',
          "day0Date" date NOT NULL,
          "day3Date" date NOT NULL,
          "day7Date" date NOT NULL,
          "day28Date" date NOT NULL,
          "day0Completed" boolean NOT NULL DEFAULT false,
          "day3Completed" boolean NOT NULL DEFAULT false,
          "day7Completed" boolean NOT NULL DEFAULT false,
          "day28Completed" boolean NOT NULL DEFAULT false,
          "day0CompletedAt" TIMESTAMP,
          "day3CompletedAt" TIMESTAMP,
          "day7CompletedAt" TIMESTAMP,
          "day28CompletedAt" TIMESTAMP,
          "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
          "patientId" uuid,
          CONSTRAINT "REL_patient_schedule" UNIQUE ("patientId"),
          CONSTRAINT "PK_schedule" PRIMARY KEY ("id")
        )
      `);

      // Add foreign key constraint
      await queryRunner.query(`
        ALTER TABLE "schedules" 
        ADD CONSTRAINT "FK_schedule_patient" 
        FOREIGN KEY ("patientId") 
        REFERENCES "patients"("id") 
        ON DELETE CASCADE
      `);
    } else {
      // Check and add the date columns if they don't exist
      const dateColumns = ['day0Date', 'day3Date', 'day7Date', 'day28Date'];

      for (const columnName of dateColumns) {
        const columnExists = await queryRunner.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'schedules' 
            AND column_name = '${columnName}'
          );
        `);

        if (!columnExists[0].exists) {
          await queryRunner.query(`
            ALTER TABLE "schedules" 
            ADD COLUMN "${columnName}" date NOT NULL DEFAULT CURRENT_DATE
          `);
        }
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Check if the table was created by this migration (not by synchronize)
    // If it was created by sync, we'll just remove the columns we added

    // For safety, we'll only drop the date columns we might have added
    const columnsToDrop = ['day0Date', 'day3Date', 'day7Date', 'day28Date'];

    for (const columnName of columnsToDrop) {
      const columnExists = await queryRunner.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = 'schedules' 
          AND column_name = '${columnName}'
        );
      `);

      if (columnExists[0].exists) {
        await queryRunner.query(`
          ALTER TABLE "schedules" 
          DROP COLUMN IF EXISTS "${columnName}"
        `);
      }
    }
  }
}
