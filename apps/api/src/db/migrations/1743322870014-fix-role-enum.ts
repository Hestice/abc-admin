import { MigrationInterface, QueryRunner } from "typeorm";

export class FixRoleEnum1743322870014 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if the enum exists
        const enumExists = await queryRunner.query(`
            SELECT EXISTS (
                SELECT 1 FROM pg_type WHERE typname = 'users_role_enum'
            ) as enum_exists
        `);
        
        if (enumExists[0]?.enum_exists) {
            // Create a new enum type with only ADMIN
            await queryRunner.query(`CREATE TYPE users_role_enum_new AS ENUM ('ADMIN')`);
            
            // Update table to use the new type, converting all roles to ADMIN
            await queryRunner.query(`
                ALTER TABLE "users" 
                ALTER COLUMN "role" TYPE users_role_enum_new 
                USING 'ADMIN'::users_role_enum_new
            `);
            
            // Drop old type
            await queryRunner.query(`DROP TYPE users_role_enum`);
            
            // Rename new type to the original name
            await queryRunner.query(`ALTER TYPE users_role_enum_new RENAME TO users_role_enum`);
        } else {
            // If the enum doesn't exist yet, create it with just ADMIN
            await queryRunner.query(`CREATE TYPE users_role_enum AS ENUM ('ADMIN')`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // In down migration, we'll restore the original set of roles
        const enumExists = await queryRunner.query(`
            SELECT EXISTS (
                SELECT 1 FROM pg_type WHERE typname = 'users_role_enum'
            ) as enum_exists
        `);
        
        if (enumExists[0]?.enum_exists) {
            // Create a new enum type with the original set of roles
            await queryRunner.query(`CREATE TYPE users_role_enum_new AS ENUM ('ADMIN', 'DOCTOR', 'PATIENT')`);
            
            // Update table to use the new type
            await queryRunner.query(`
                ALTER TABLE "users" 
                ALTER COLUMN "role" TYPE users_role_enum_new 
                USING "role"::text::users_role_enum_new
            `);
            
            // Drop old type
            await queryRunner.query(`DROP TYPE users_role_enum`);
            
            // Rename new type to the original name
            await queryRunner.query(`ALTER TYPE users_role_enum_new RENAME TO users_role_enum`);
        }
    }
}
