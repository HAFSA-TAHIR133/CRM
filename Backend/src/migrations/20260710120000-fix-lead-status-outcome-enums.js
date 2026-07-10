'use strict';

export const up = async (queryInterface, Sequelize) => {
  // Step 1: Create new status enum with 'open' and 'closed'
  await queryInterface.sequelize.query(`
    CREATE TYPE "enum_Leads_status_v2" AS ENUM ('open', 'closed');
  `);

  // Step 2: Drop default on status column
  await queryInterface.sequelize.query(`
    ALTER TABLE "Leads" ALTER COLUMN "status" DROP DEFAULT;
  `);

  // Step 3: Convert status column - map 'new','contacted','qualified','proposal' -> 'open', 'won','lost' -> 'closed'
  await queryInterface.sequelize.query(`
    ALTER TABLE "Leads"
    ALTER COLUMN "status"
    TYPE "enum_Leads_status_v2"
    USING (
      CASE
        WHEN status::text IN ('new', 'contacted', 'qualified', 'proposal') THEN 'open'::"enum_Leads_status_v2"
        WHEN status::text IN ('won', 'lost') THEN 'closed'::"enum_Leads_status_v2"
        ELSE 'open'::"enum_Leads_status_v2"
      END
    );
  `);

  // Step 4: Set default
  await queryInterface.sequelize.query(`
    ALTER TABLE "Leads" ALTER COLUMN "status" SET DEFAULT 'open';
  `);

  // Step 5: Drop old enum
  await queryInterface.sequelize.query(`
    DROP TYPE IF EXISTS "enum_Leads_status";
  `);

  // Step 6: Rename new enum
  await queryInterface.sequelize.query(`
    ALTER TYPE "enum_Leads_status_v2" RENAME TO "enum_Leads_status";
  `);

  // Step 7: Create outcome column if not exists
  const outcomeColumnExists = await queryInterface.sequelize.query(`
    SELECT column_name FROM information_schema.columns 
    WHERE table_name = 'Leads' AND column_name = 'outcome'
  `);
  
  // Check if outcome column exists and has wrong type
  const outcomeTypeResult = await queryInterface.sequelize.query(`
    SELECT data_type, udt_name FROM information_schema.columns 
    WHERE table_name = 'Leads' AND column_name = 'outcome'
  `);
  
  if (outcomeTypeResult[0] && outcomeTypeResult[0].length > 0) {
    const currentType = outcomeTypeResult[0][0].udt_name;
    // If outcome is of type enum_Leads_status (old style), we need to fix it
    if (currentType && currentType.includes('status')) {
      // Drop and recreate outcome
      await queryInterface.sequelize.query(`
        ALTER TABLE "Leads" ALTER COLUMN "outcome" DROP DEFAULT;
      `);
      await queryInterface.sequelize.query(`
        ALTER TABLE "Leads" ALTER COLUMN "outcome" TYPE VARCHAR(255);
      `);
      await queryInterface.sequelize.query(`
        DROP TYPE IF EXISTS "enum_Leads_outcome";
      `);
      await queryInterface.sequelize.query(`
        CREATE TYPE "enum_Leads_outcome" AS ENUM ('won', 'lost');
      `);
      await queryInterface.sequelize.query(`
        ALTER TABLE "Leads" ALTER COLUMN "outcome" TYPE "enum_Leads_outcome" 
        USING (
          CASE 
            WHEN outcome::text IN ('won', 'win') THEN 'won'::"enum_Leads_outcome"
            WHEN outcome::text IN ('lost', 'lose') THEN 'lost'::"enum_Leads_outcome"
            ELSE NULL
          END
        );
      `);
    }
  }
};

export const down = async (queryInterface, Sequelize) => {
  // Revert status back to old enum
  await queryInterface.sequelize.query(`
    CREATE TYPE "enum_Leads_status_old" AS ENUM (
      'new', 'contacted', 'qualified', 'proposal', 'won', 'lost'
    );
  `);

  await queryInterface.sequelize.query(`
    ALTER TABLE "Leads" ALTER COLUMN "status" DROP DEFAULT;
  `);

  await queryInterface.sequelize.query(`
    ALTER TABLE "Leads"
    ALTER COLUMN "status"
    TYPE "enum_Leads_status_old"
    USING (
      CASE
        WHEN status::text = 'open' THEN 'new'::"enum_Leads_status_old"
        WHEN status::text = 'closed' THEN 'won'::"enum_Leads_status_old"
        ELSE 'new'::"enum_Leads_status_old"
      END
    );
  `);

  await queryInterface.sequelize.query(`
    ALTER TABLE "Leads" ALTER COLUMN "status" SET DEFAULT 'new';
  `);

  await queryInterface.sequelize.query(`
    DROP TYPE IF EXISTS "enum_Leads_status";
  `);

  await queryInterface.sequelize.query(`
    ALTER TYPE "enum_Leads_status_old" RENAME TO "enum_Leads_status";
  `);
};