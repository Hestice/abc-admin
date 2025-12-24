import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateScheduleList1766567456662 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Remove the unique constraint on patientId to allow multiple schedules per patient
    await queryRunner.query(`
            ALTER TABLE "schedules" 
            DROP CONSTRAINT IF EXISTS "REL_patient_schedule"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Restore the unique constraint (note: this will fail if multiple schedules exist for a patient)
    await queryRunner.query(`
            ALTER TABLE "schedules" 
            ADD CONSTRAINT "REL_patient_schedule" UNIQUE ("patientId")
        `);
  }
}
