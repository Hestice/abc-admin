import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUsers1766019015730 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if columns exist before dropping
    const hasPassword = await queryRunner.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'password'
        `);

    const hasUsername = await queryRunner.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'username'
        `);

    // Drop password column if it exists
    if (hasPassword.length > 0) {
      await queryRunner.query(`
                ALTER TABLE "users" DROP COLUMN IF EXISTS "password"
            `);
      console.log('Dropped password column from users table');
    }

    // Drop username column if it exists
    if (hasUsername.length > 0) {
      // First, drop any unique constraint on username if it exists
      await queryRunner.query(`
                ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "UQ_users_username"
            `);

      await queryRunner.query(`
                ALTER TABLE "users" DROP COLUMN IF EXISTS "username"
            `);
      console.log('Dropped username column from users table');
    }

    // Modify id column to remove auto-generation
    // First check if it has a default
    const idColumnInfo = await queryRunner.query(`
            SELECT column_default 
            FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'id'
        `);

    if (idColumnInfo.length > 0 && idColumnInfo[0].column_default) {
      await queryRunner.query(`
                ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT
            `);
      console.log('Removed default from id column');
    }

    // Ensure email is unique
    const emailUniqueCheck = await queryRunner.query(`
            SELECT constraint_name 
            FROM information_schema.table_constraints 
            WHERE table_name = 'users' 
            AND constraint_type = 'UNIQUE' 
            AND constraint_name LIKE '%email%'
        `);

    if (emailUniqueCheck.length === 0) {
      await queryRunner.query(`
                ALTER TABLE "users" ADD CONSTRAINT "UQ_users_email" UNIQUE ("email")
            `);
      console.log('Added unique constraint to email column');
    }

    console.log('Migration to Supabase auth completed');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Re-add username column
    await queryRunner.query(`
            ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "username" varchar
        `);

    // Re-add password column
    await queryRunner.query(`
            ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "password" varchar
        `);

    // Restore id column default
    await queryRunner.query(`
            ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()
        `);

    console.log('Reverted migration changes');
  }
}
