export const up = async (queryInterface) => {
  await queryInterface.sequelize.query(`
    UPDATE "Leads"
    SET "stageId" = (
      SELECT id FROM "Stages" ORDER BY "order" ASC LIMIT 1
    ),
    "pipelineId" = COALESCE(
      "pipelineId",
      (SELECT id FROM "Pipelines" ORDER BY id ASC LIMIT 1)
    )
    WHERE "stageId" IS NULL
  `);
};

export const down = async () => {};
