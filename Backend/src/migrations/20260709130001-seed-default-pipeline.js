export const up = async (queryInterface) => {
  const [[{ count }]] = await queryInterface.sequelize.query(
    'SELECT COUNT(*)::int AS count FROM "Pipelines"'
  );

  if (count > 0) return;

  const now = new Date();

  await queryInterface.bulkInsert('Pipelines', [{
    name: 'Sales Pipeline',
    description: 'Default sales pipeline',
    createdAt: now,
    updatedAt: now
  }]);

  const [[pipeline]] = await queryInterface.sequelize.query(
    `SELECT id FROM "Pipelines" WHERE name = 'Sales Pipeline' ORDER BY id DESC LIMIT 1`
  );

  const pipelineId = pipeline.id;

  await queryInterface.bulkInsert('Stages', [
    { pipelineId, name: 'New Leads', order: 1, color: '#66b2b2', createdAt: now, updatedAt: now },
    { pipelineId, name: 'Contacted', order: 2, color: '#008080', createdAt: now, updatedAt: now },
    { pipelineId, name: 'Qualified', order: 3, color: '#f59e0b', createdAt: now, updatedAt: now },
    { pipelineId, name: 'Converted', order: 4, color: '#10b981', createdAt: now, updatedAt: now }
  ]);
};

export const down = async (queryInterface) => {
  await queryInterface.bulkDelete('Stages', null, {});
  await queryInterface.bulkDelete('Pipelines', { name: 'Sales Pipeline' }, {});
};
