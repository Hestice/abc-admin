import { MigrationInterface, QueryRunner } from 'typeorm';

export class ExposuresTable1766570779705 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Step 1: Check and create enum types if they don't exist
    // Check if category enum exists (might be named patients_category_enum)
    const categoryEnumExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 FROM pg_type 
        WHERE typname IN ('category_enum', 'patients_category_enum')
      ) as exists
    `);

    if (!categoryEnumExists[0]?.exists) {
      await queryRunner.query(`
        CREATE TYPE "category_enum" AS ENUM ('1', '2', '3')
      `);
    }

    // Check if status enum exists
    const statusEnumExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 FROM pg_type 
        WHERE typname = 'status_enum'
      ) as exists
    `);

    if (!statusEnumExists[0]?.exists) {
      await queryRunner.query(`
        CREATE TYPE "status_enum" AS ENUM ('alive', 'dead', 'unknown', 'lost')
      `);
    }

    // Determine which category enum type to use
    const categoryEnumType = await queryRunner.query(`
      SELECT typname 
      FROM pg_type 
      WHERE typname IN ('category_enum', 'patients_category_enum')
      LIMIT 1
    `);
    const categoryTypeName = categoryEnumType[0]?.typname || 'category_enum';

    // Step 2: Create exposures table
    await queryRunner.query(`
      CREATE TABLE "exposures" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "patientId" uuid NOT NULL,
        "category" "${categoryTypeName}" NOT NULL,
        "bodyPartsAffected" character varying NOT NULL,
        "placeOfExposure" character varying NOT NULL,
        "dateOfExposure" date NOT NULL,
        "isExposureAtHome" boolean NOT NULL,
        "sourceOfExposure" character varying NOT NULL,
        "animalStatus" "status_enum" NOT NULL DEFAULT 'unknown',
        "isWoundCleaned" boolean NOT NULL,
        "antiTetanusGiven" boolean NOT NULL,
        "dateOfAntiTetanus" date,
        "briefHistory" character varying NOT NULL,
        "allergy" character varying NOT NULL,
        "medications" character varying NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_exposures" PRIMARY KEY ("id")
      )
    `);

    // Step 3: Add foreign key constraint from exposures to patients
    await queryRunner.query(`
      ALTER TABLE "exposures"
      ADD CONSTRAINT "FK_exposures_patient"
      FOREIGN KEY ("patientId")
      REFERENCES "patients"("id")
      ON DELETE CASCADE
      ON UPDATE NO ACTION
    `);

    // Step 4: Migrate data from patients table to exposures table
    // Create one exposure per patient with all exposure-related fields
    await queryRunner.query(`
      INSERT INTO "exposures" (
        "id",
        "patientId",
        "category",
        "bodyPartsAffected",
        "placeOfExposure",
        "dateOfExposure",
        "isExposureAtHome",
        "sourceOfExposure",
        "animalStatus",
        "isWoundCleaned",
        "antiTetanusGiven",
        "dateOfAntiTetanus",
        "briefHistory",
        "allergy",
        "medications",
        "createdAt",
        "updatedAt"
      )
      SELECT
        uuid_generate_v4(),
        "id" as "patientId",
        "category"::text::"${categoryTypeName}",
        "bodyPartsAffected",
        "placeOfExposure",
        "dateOfExposure",
        "isExposureAtHome",
        "sourceOfExposure",
        "animalStatus"::text::"status_enum",
        "isWoundCleaned",
        "antiTetanusGiven",
        "dateOfAntiTetanus",
        "briefHistory",
        "allergy",
        "medications",
        "createdAt",
        "updatedAt"
      FROM "patients"
      WHERE "category" IS NOT NULL
    `);

    // Step 5: Add exposureId column to schedules table
    await queryRunner.query(`
      ALTER TABLE "schedules"
      ADD COLUMN "exposureId" uuid
    `);

    // Step 6: Populate exposureId in schedules based on existing patientId
    // Match schedules to exposures by patientId
    await queryRunner.query(`
      UPDATE "schedules" s
      SET "exposureId" = e."id"
      FROM "exposures" e
      WHERE s."patientId" = e."patientId"
    `);

    // Step 7: Make exposureId NOT NULL after populating it
    await queryRunner.query(`
      ALTER TABLE "schedules"
      ALTER COLUMN "exposureId" SET NOT NULL
    `);

    // Step 8: Drop the old foreign key constraint from schedules to patients
    await queryRunner.query(`
      ALTER TABLE "schedules"
      DROP CONSTRAINT IF EXISTS "FK_schedules_patient"
    `);

    // Also try to find and drop any auto-generated foreign key constraints
    const fkConstraints = await queryRunner.query(`
      SELECT conname
      FROM pg_constraint
      WHERE conrelid = 'schedules'::regclass
      AND contype = 'f'
      AND confrelid = 'patients'::regclass
    `);

    for (const constraint of fkConstraints) {
      await queryRunner.query(`
        ALTER TABLE "schedules"
        DROP CONSTRAINT IF EXISTS "${constraint.conname}"
      `);
    }

    // Step 9: Add foreign key constraint from schedules to exposures
    await queryRunner.query(`
      ALTER TABLE "schedules"
      ADD CONSTRAINT "FK_schedules_exposure"
      FOREIGN KEY ("exposureId")
      REFERENCES "exposures"("id")
      ON DELETE CASCADE
      ON UPDATE NO ACTION
    `);

    // Step 10: Remove exposure columns from patients table
    await queryRunner.query(`
      ALTER TABLE "patients"
      DROP COLUMN IF EXISTS "category",
      DROP COLUMN IF EXISTS "bodyPartsAffected",
      DROP COLUMN IF EXISTS "placeOfExposure",
      DROP COLUMN IF EXISTS "dateOfExposure",
      DROP COLUMN IF EXISTS "isExposureAtHome",
      DROP COLUMN IF EXISTS "sourceOfExposure",
      DROP COLUMN IF EXISTS "animalStatus",
      DROP COLUMN IF EXISTS "isWoundCleaned",
      DROP COLUMN IF EXISTS "antiTetanusGiven",
      DROP COLUMN IF EXISTS "dateOfAntiTetanus",
      DROP COLUMN IF EXISTS "briefHistory",
      DROP COLUMN IF EXISTS "allergy",
      DROP COLUMN IF EXISTS "medications"
    `);

    // Step 11: Remove patientId column from schedules table
    await queryRunner.query(`
      ALTER TABLE "schedules"
      DROP COLUMN IF EXISTS "patientId"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Step 1: Add patientId column back to schedules table
    await queryRunner.query(`
      ALTER TABLE "schedules"
      ADD COLUMN "patientId" uuid
    `);

    // Step 2: Populate patientId from exposure relationship
    await queryRunner.query(`
      UPDATE "schedules" s
      SET "patientId" = e."patientId"
      FROM "exposures" e
      WHERE s."exposureId" = e."id"
    `);

    // Step 3: Make patientId NOT NULL
    await queryRunner.query(`
      ALTER TABLE "schedules"
      ALTER COLUMN "patientId" SET NOT NULL
    `);

    // Step 4: Drop foreign key constraint from schedules to exposures
    await queryRunner.query(`
      ALTER TABLE "schedules"
      DROP CONSTRAINT IF EXISTS "FK_schedules_exposure"
    `);

    // Step 5: Add foreign key constraint from schedules to patients
    await queryRunner.query(`
      ALTER TABLE "schedules"
      ADD CONSTRAINT "FK_schedules_patient"
      FOREIGN KEY ("patientId")
      REFERENCES "patients"("id")
      ON DELETE CASCADE
      ON UPDATE NO ACTION
    `);

    // Step 6: Add exposure columns back to patients table
    // Determine which category enum type to use (might be patients_category_enum)
    const categoryEnumTypeDown = await queryRunner.query(`
      SELECT typname 
      FROM pg_type 
      WHERE typname IN ('category_enum', 'patients_category_enum')
      LIMIT 1
    `);
    const categoryTypeNameDown =
      categoryEnumTypeDown[0]?.typname || 'category_enum';

    await queryRunner.query(`
      ALTER TABLE "patients"
      ADD COLUMN "category" "${categoryTypeNameDown}",
      ADD COLUMN "bodyPartsAffected" character varying,
      ADD COLUMN "placeOfExposure" character varying,
      ADD COLUMN "dateOfExposure" date,
      ADD COLUMN "isExposureAtHome" boolean,
      ADD COLUMN "sourceOfExposure" character varying,
      ADD COLUMN "animalStatus" "status_enum" DEFAULT 'unknown',
      ADD COLUMN "isWoundCleaned" boolean,
      ADD COLUMN "antiTetanusGiven" boolean,
      ADD COLUMN "dateOfAntiTetanus" date,
      ADD COLUMN "briefHistory" character varying,
      ADD COLUMN "allergy" character varying,
      ADD COLUMN "medications" character varying
    `);

    // Step 7: Migrate data back from exposures to patients
    // Use the most recent exposure per patient
    await queryRunner.query(`
      UPDATE "patients" p
      SET
        "category" = e."category",
        "bodyPartsAffected" = e."bodyPartsAffected",
        "placeOfExposure" = e."placeOfExposure",
        "dateOfExposure" = e."dateOfExposure",
        "isExposureAtHome" = e."isExposureAtHome",
        "sourceOfExposure" = e."sourceOfExposure",
        "animalStatus" = e."animalStatus",
        "isWoundCleaned" = e."isWoundCleaned",
        "antiTetanusGiven" = e."antiTetanusGiven",
        "dateOfAntiTetanus" = e."dateOfAntiTetanus",
        "briefHistory" = e."briefHistory",
        "allergy" = e."allergy",
        "medications" = e."medications"
      FROM (
        SELECT DISTINCT ON ("patientId") *
        FROM "exposures"
        ORDER BY "patientId", "createdAt" DESC
      ) e
      WHERE p."id" = e."patientId"
    `);

    // Step 8: Make exposure columns NOT NULL where possible
    await queryRunner.query(`
      ALTER TABLE "patients"
      ALTER COLUMN "category" SET NOT NULL,
      ALTER COLUMN "bodyPartsAffected" SET NOT NULL,
      ALTER COLUMN "placeOfExposure" SET NOT NULL,
      ALTER COLUMN "dateOfExposure" SET NOT NULL,
      ALTER COLUMN "isExposureAtHome" SET NOT NULL,
      ALTER COLUMN "sourceOfExposure" SET NOT NULL,
      ALTER COLUMN "animalStatus" SET NOT NULL,
      ALTER COLUMN "isWoundCleaned" SET NOT NULL,
      ALTER COLUMN "antiTetanusGiven" SET NOT NULL,
      ALTER COLUMN "briefHistory" SET NOT NULL,
      ALTER COLUMN "allergy" SET NOT NULL,
      ALTER COLUMN "medications" SET NOT NULL
    `);

    // Step 9: Remove exposureId column from schedules
    await queryRunner.query(`
      ALTER TABLE "schedules"
      DROP COLUMN IF EXISTS "exposureId"
    `);

    // Step 10: Drop exposures table
    await queryRunner.query(`
      DROP TABLE IF EXISTS "exposures"
    `);

    // Note: We don't drop the enum types as they might be used elsewhere
    // If you need to drop them, uncomment:
    // await queryRunner.query(`DROP TYPE IF EXISTS "category_enum"`);
    // await queryRunner.query(`DROP TYPE IF EXISTS "status_enum"`);
  }
}
