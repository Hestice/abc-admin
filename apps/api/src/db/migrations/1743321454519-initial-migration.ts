import { MigrationInterface, QueryRunner } from "typeorm";
import { UserRole } from "@abc-admin/enums";

export class InitialMigration1743321454519 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create patients table for record keeping
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "patients" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "firstName" varchar NOT NULL,
                "middleName" varchar,
                "lastName" varchar NOT NULL,
                "dateOfBirth" date NOT NULL,
                "sex" varchar NOT NULL,
                "address" varchar NOT NULL,
                "email" varchar,
                "managedById" uuid,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "fk_patient_managed_by" FOREIGN KEY ("managedById") REFERENCES "users"("id")
            )
        `);
        
        console.log('Created patients table');

        // Migrate data from patient_profiles if it exists
        const profilesExist = await queryRunner.hasTable('patient_profiles');
        if (profilesExist) {
            try {
                // Try to migrate the data
                await queryRunner.query(`
                    INSERT INTO "patients" (
                        "id", "firstName", "middleName", "lastName", "dateOfBirth", 
                        "sex", "address", "createdAt", "updatedAt"
                    )
                    SELECT 
                        id, "firstName", "middleName", "lastName", "dateOfBirth",
                        sex, address, "createdAt", "updatedAt"
                    FROM "patient_profiles"
                    ON CONFLICT (id) DO NOTHING
                `);
                
                console.log('Migrated data from patient_profiles to patients');
                
                // Drop the old table
                await queryRunner.query(`DROP TABLE "patient_profiles"`);
                console.log('Dropped patient_profiles table');
            } catch (error) {
                console.log('Error migrating data:', error);
                // Continue with migration even if data migration fails
            }
        }

        // Create initial admin user if no users exist
        const userCount = await queryRunner.query(`
            SELECT COUNT(*) FROM "users"
        `);
        
        if (userCount[0].count === '0') {
            const bcrypt = require('bcrypt');
            const hashedPassword = await bcrypt.hash("Admin123!", 10);
            
            await queryRunner.query(`
                INSERT INTO "users" (
                    id, 
                    username, 
                    email, 
                    password, 
                    role, 
                    "isActive", 
                    "createdAt", 
                    "updatedAt"
                ) 
                VALUES (
                    uuid_generate_v4(), 
                    'administrator', 
                    'admin@abc.com', 
                    '${hashedPassword}', 
                    '${UserRole.ADMIN}', 
                    true,
                    NOW(), 
                    NOW()
                )
            `);
            
            console.log('Created initial admin user');
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop the patients table if migration needs to be reverted
        await queryRunner.query(`
            DROP TABLE IF EXISTS "patients"
        `);
        
        // We're not recreating patient_profiles in down migration since we're moving away from that structure
    }
}
