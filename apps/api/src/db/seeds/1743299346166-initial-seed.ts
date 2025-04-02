import { MigrationInterface, QueryRunner } from "typeorm";
import * as bcrypt from "bcrypt";
import { UserRole } from "@abc-admin/enums";

export class InitialSeed1743299346166 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
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
            ON CONFLICT (username) DO NOTHING;
        `);
        
        console.log('Admin user seed completed');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "users" WHERE username = 'administrator'`);
        console.log('Admin user removed');
    }
}
