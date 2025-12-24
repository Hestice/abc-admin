import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveUniquePatientScheduleConstraint1766569972485
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Remove all unique constraints on patientId in schedules table
    // This includes both the named constraint and any auto-generated ones

    // First, try to drop the named constraint
    await queryRunner.query(`
      ALTER TABLE "schedules" 
      DROP CONSTRAINT IF EXISTS "REL_patient_schedule"
    `);

    // Drop the auto-generated constraint (from the error message)
    await queryRunner.query(`
      ALTER TABLE "schedules" 
      DROP CONSTRAINT IF EXISTS "REL_3b662d86d93c5febacaf65417d"
    `);

    // Find all unique constraints that involve the patientId column
    // We need to join with pg_attribute to get column names
    const constraints = await queryRunner.query(`
      SELECT DISTINCT c.conname
      FROM pg_constraint c
      JOIN pg_class t ON c.conrelid = t.oid
      JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = ANY(c.conkey)
      WHERE t.relname = 'schedules'
      AND c.contype = 'u'
      AND a.attname = 'patientId'
    `);

    // Drop each found constraint
    for (const constraint of constraints) {
      await queryRunner.query(`
        ALTER TABLE "schedules" 
        DROP CONSTRAINT IF EXISTS "${constraint.conname}"
      `);
    }

    // Also try dropping by checking all unique constraints on the table
    // Sometimes the column name might be stored differently
    const allUniqueConstraints = await queryRunner.query(`
      SELECT c.conname, array_agg(a.attname ORDER BY a.attnum) as columns
      FROM pg_constraint c
      JOIN pg_class t ON c.conrelid = t.oid
      JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = ANY(c.conkey)
      WHERE t.relname = 'schedules'
      AND c.contype = 'u'
      GROUP BY c.conname
      HAVING 'patientId' = ANY(array_agg(a.attname))
    `);

    // Drop any additional constraints found
    for (const constraint of allUniqueConstraints) {
      await queryRunner.query(`
        ALTER TABLE "schedules" 
        DROP CONSTRAINT IF EXISTS "${constraint.conname}"
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Note: We don't restore the unique constraint in down migration
    // because allowing multiple schedules per patient is the desired behavior
    // If you need to restore it, uncomment the following:
    // await queryRunner.query(`
    //   ALTER TABLE "schedules"
    //   ADD CONSTRAINT "REL_patient_schedule" UNIQUE ("patientId")
    // `);
  }
}
