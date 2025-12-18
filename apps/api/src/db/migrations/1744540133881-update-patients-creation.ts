import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatePatientsCreation1744540133881 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if the enum type exists before creating it
    const enumExists = await queryRunner.query(`
      SELECT 1 FROM pg_type 
      JOIN pg_namespace ON pg_namespace.oid = pg_type.typnamespace 
      WHERE typname = 'patients_category_enum' AND nspname = 'public'
    `);

    if (enumExists.length === 0) {
      await queryRunner.query(
        `CREATE TYPE "public"."patients_category_enum" AS ENUM('1', '2', '3')`
      );
    }

    // Helper function to check if column exists
    const columnExists = async (columnName: string): Promise<boolean> => {
      const result = await queryRunner.query(`
        SELECT EXISTS (
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = 'patients' 
          AND column_name = '${columnName}'
        ) as exists
      `);
      return result[0]?.exists || false;
    };

    // Add new columns with appropriate default values (only if they don't exist)
    if (!(await columnExists('category'))) {
      await queryRunner.query(
        `ALTER TABLE "patients" ADD "category" "public"."patients_category_enum" NULL`
      );
      await queryRunner.query(`UPDATE "patients" SET "category" = '1'`);
      await queryRunner.query(
        `ALTER TABLE "patients" ALTER COLUMN "category" SET NOT NULL`
      );
    }

    if (!(await columnExists('bodyPartsAffected'))) {
      await queryRunner.query(
        `ALTER TABLE "patients" ADD "bodyPartsAffected" character varying NULL`
      );
      await queryRunner.query(
        `UPDATE "patients" SET "bodyPartsAffected" = 'Unknown'`
      );
      await queryRunner.query(
        `ALTER TABLE "patients" ALTER COLUMN "bodyPartsAffected" SET NOT NULL`
      );
    }

    if (!(await columnExists('placeOfExposure'))) {
      await queryRunner.query(
        `ALTER TABLE "patients" ADD "placeOfExposure" character varying NULL`
      );
      await queryRunner.query(
        `UPDATE "patients" SET "placeOfExposure" = 'Unknown'`
      );
      await queryRunner.query(
        `ALTER TABLE "patients" ALTER COLUMN "placeOfExposure" SET NOT NULL`
      );
    }

    if (!(await columnExists('dateOfExposure'))) {
      await queryRunner.query(
        `ALTER TABLE "patients" ADD "dateOfExposure" date NULL`
      );
      await queryRunner.query(
        `UPDATE "patients" SET "dateOfExposure" = CURRENT_DATE`
      );
      await queryRunner.query(
        `ALTER TABLE "patients" ALTER COLUMN "dateOfExposure" SET NOT NULL`
      );
    }

    if (!(await columnExists('isExposureAtHome'))) {
      await queryRunner.query(
        `ALTER TABLE "patients" ADD "isExposureAtHome" boolean NULL`
      );
      await queryRunner.query(
        `UPDATE "patients" SET "isExposureAtHome" = false`
      );
      await queryRunner.query(
        `ALTER TABLE "patients" ALTER COLUMN "isExposureAtHome" SET NOT NULL`
      );
    }

    if (!(await columnExists('sourceOfExposure'))) {
      await queryRunner.query(
        `ALTER TABLE "patients" ADD "sourceOfExposure" character varying NULL`
      );
      await queryRunner.query(
        `UPDATE "patients" SET "sourceOfExposure" = 'Unknown'`
      );
      await queryRunner.query(
        `ALTER TABLE "patients" ALTER COLUMN "sourceOfExposure" SET NOT NULL`
      );
    }

    if (!(await columnExists('isWoundCleaned'))) {
      await queryRunner.query(
        `ALTER TABLE "patients" ADD "isWoundCleaned" boolean NULL`
      );
      await queryRunner.query(`UPDATE "patients" SET "isWoundCleaned" = false`);
      await queryRunner.query(
        `ALTER TABLE "patients" ALTER COLUMN "isWoundCleaned" SET NOT NULL`
      );
    }

    if (!(await columnExists('antiTetanusGiven'))) {
      await queryRunner.query(
        `ALTER TABLE "patients" ADD "antiTetanusGiven" boolean NULL`
      );
      await queryRunner.query(
        `UPDATE "patients" SET "antiTetanusGiven" = false`
      );
      await queryRunner.query(
        `ALTER TABLE "patients" ALTER COLUMN "antiTetanusGiven" SET NOT NULL`
      );
    }

    if (!(await columnExists('dateOfAntiTetanus'))) {
      await queryRunner.query(
        `ALTER TABLE "patients" ADD "dateOfAntiTetanus" date NULL`
      );
    }

    if (!(await columnExists('briefHistory'))) {
      await queryRunner.query(
        `ALTER TABLE "patients" ADD "briefHistory" character varying NULL`
      );
      await queryRunner.query(
        `UPDATE "patients" SET "briefHistory" = 'No history provided'`
      );
      await queryRunner.query(
        `ALTER TABLE "patients" ALTER COLUMN "briefHistory" SET NOT NULL`
      );
    }

    if (!(await columnExists('allergy'))) {
      await queryRunner.query(
        `ALTER TABLE "patients" ADD "allergy" character varying NULL`
      );
      await queryRunner.query(`UPDATE "patients" SET "allergy" = 'none'`);
      await queryRunner.query(
        `ALTER TABLE "patients" ALTER COLUMN "allergy" SET NOT NULL`
      );
    }

    if (!(await columnExists('medications'))) {
      await queryRunner.query(
        `ALTER TABLE "patients" ADD "medications" character varying NULL`
      );
      await queryRunner.query(`UPDATE "patients" SET "medications" = 'none'`);
      await queryRunner.query(
        `ALTER TABLE "patients" ALTER COLUMN "medications" SET NOT NULL`
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop columns in reverse order
    await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "medications"`);
    await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "allergy"`);
    await queryRunner.query(
      `ALTER TABLE "patients" DROP COLUMN "briefHistory"`
    );
    await queryRunner.query(
      `ALTER TABLE "patients" DROP COLUMN "dateOfAntiTetanus"`
    );
    await queryRunner.query(
      `ALTER TABLE "patients" DROP COLUMN "antiTetanusGiven"`
    );
    await queryRunner.query(
      `ALTER TABLE "patients" DROP COLUMN "isWoundCleaned"`
    );
    await queryRunner.query(
      `ALTER TABLE "patients" DROP COLUMN "sourceOfExposure"`
    );
    await queryRunner.query(
      `ALTER TABLE "patients" DROP COLUMN "isExposureAtHome"`
    );
    await queryRunner.query(
      `ALTER TABLE "patients" DROP COLUMN "dateOfExposure"`
    );
    await queryRunner.query(
      `ALTER TABLE "patients" DROP COLUMN "placeOfExposure"`
    );
    await queryRunner.query(
      `ALTER TABLE "patients" DROP COLUMN "bodyPartsAffected"`
    );
    await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "category"`);

    // Drop the enum type if needed
    // Uncomment if you want to remove the enum type completely
    // await queryRunner.query(`DROP TYPE "public"."patients_category_enum"`);
  }
}
