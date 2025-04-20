import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSexEnum1745148775770 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create a new type with all values
    await queryRunner.query(`
            CREATE TYPE "patients_sex_enum_new" AS ENUM('male', 'female', 'other');
        `);

    // Update the column to use the new type
    // First create a new column with the new type
    await queryRunner.query(`
            ALTER TABLE "patients" 
            ADD COLUMN "sex_new" "patients_sex_enum_new" NULL;
        `);

    // Copy data from old column to new column
    await queryRunner.query(`
            UPDATE "patients" 
            SET "sex_new" = "sex"::"text"::"patients_sex_enum_new";
        `);

    // Drop old column
    await queryRunner.query(`
            ALTER TABLE "patients" DROP COLUMN "sex";
        `);

    // Rename new column to the original name
    await queryRunner.query(`
            ALTER TABLE "patients" 
            RENAME COLUMN "sex_new" TO "sex";
        `);

    // Make the column NOT NULL if it was originally
    await queryRunner.query(`
            ALTER TABLE "patients" 
            ALTER COLUMN "sex" SET NOT NULL;
        `);

    // Drop the old enum type
    await queryRunner.query(`
            DROP TYPE "patients_sex_enum";
        `);

    // Rename the new enum type to the original name
    await queryRunner.query(`
            ALTER TYPE "patients_sex_enum_new" 
            RENAME TO "patients_sex_enum";
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Create a new type with original values
    await queryRunner.query(`
            CREATE TYPE "patients_sex_enum_old" AS ENUM('male', 'female');
        `);

    // Create a new column with the old type
    await queryRunner.query(`
            ALTER TABLE "patients" 
            ADD COLUMN "sex_old" "patients_sex_enum_old" NULL;
        `);

    // Copy data, handling the 'other' values by converting them to NULL or a default value
    await queryRunner.query(`
            UPDATE "patients" 
            SET "sex_old" = 
                CASE 
                    WHEN "sex" IN ('male', 'female') THEN "sex"::"text"::"patients_sex_enum_old"
                    ELSE 'male'::"patients_sex_enum_old" -- Default to 'male' for 'other' values
                END;
        `);

    // Drop old column
    await queryRunner.query(`
            ALTER TABLE "patients" DROP COLUMN "sex";
        `);

    // Rename new column to the original name
    await queryRunner.query(`
            ALTER TABLE "patients" 
            RENAME COLUMN "sex_old" TO "sex";
        `);

    // Make the column NOT NULL
    await queryRunner.query(`
            ALTER TABLE "patients" 
            ALTER COLUMN "sex" SET NOT NULL;
        `);

    // Drop the new enum type
    await queryRunner.query(`
            DROP TYPE "patients_sex_enum";
        `);

    // Rename the old enum type to the original name
    await queryRunner.query(`
            ALTER TYPE "patients_sex_enum_old" 
            RENAME TO "patients_sex_enum";
        `);
  }
}
