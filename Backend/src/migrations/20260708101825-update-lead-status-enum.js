'use strict';

export const up = async (queryInterface, Sequelize) => {
  // Create the new enum
  await queryInterface.sequelize.query(`
    CREATE TYPE "enum_Leads_status_new" AS ENUM (
      'new',
      'contacted',
      'qualified',
      'proposal',
      'won',
      'lost'
    );
  `);

  // Remove the old default
  await queryInterface.sequelize.query(`
    ALTER TABLE "Leads"
    ALTER COLUMN "status" DROP DEFAULT;
  `);

  // Convert the column
  await queryInterface.sequelize.query(`
    ALTER TABLE "Leads"
    ALTER COLUMN "status"
    TYPE "enum_Leads_status_new"
    USING (
      CASE
        WHEN status::text = 'open' THEN 'new'::"enum_Leads_status_new"
        WHEN status::text = 'closed' THEN 'won'::"enum_Leads_status_new"
        ELSE 'new'::"enum_Leads_status_new"
      END
    );
  `);

  // Set the new default
  await queryInterface.sequelize.query(`
    ALTER TABLE "Leads"
    ALTER COLUMN "status"
    SET DEFAULT 'new';
  `);

  // Drop old enum
  await queryInterface.sequelize.query(`
    DROP TYPE "enum_Leads_status";
  `);

  // Rename new enum
  await queryInterface.sequelize.query(`
    ALTER TYPE "enum_Leads_status_new"
    RENAME TO "enum_Leads_status";
  `);
};

export const down = async (queryInterface, Sequelize) => {
  // Create old enum
  await queryInterface.sequelize.query(`
    CREATE TYPE "enum_Leads_status_old" AS ENUM (
      'open',
      'closed'
    );
  `);

  // Convert values back
  await queryInterface.sequelize.query(`
    ALTER TABLE "Leads"
    ALTER COLUMN "status"
    TYPE "enum_Leads_status_old"
    USING (
      CASE
        WHEN status::text IN ('new','contacted','qualified','proposal') THEN 'open'::"enum_Leads_status_old"
        WHEN status::text IN ('won','lost') THEN 'closed'::"enum_Leads_status_old"
        ELSE 'open'::"enum_Leads_status_old"
      END
    );
  `);

  // Drop renamed original enum
  await queryInterface.sequelize.query(`
    DROP TYPE "enum_Leads_status";
  `);

  // Rename old enum to the original name
  await queryInterface.sequelize.query(`
    ALTER TYPE "enum_Leads_status_old"
    RENAME TO "enum_Leads_status";
  `);
};