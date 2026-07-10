import db from '../models/index.js';

class PipelineServices {
  // ========== PIPELINE CRUD ==========

  async getAllPipelines() {
    return await db.Pipeline.findAll({
      include: [{
        model: db.Stage,
        as: 'stages',
        order: [['order', 'ASC']]
      }],
      order: [['createdAt', 'DESC']]
    });
  }

  async createPipeline(data) {
    return await db.Pipeline.create({
      name: data.name,
      description: data.description || ''
    });
  }

  async updatePipeline(id, data) {
    const pipeline = await db.Pipeline.findByPk(id);
    if (!pipeline) throw new Error('Pipeline not found');
    return await pipeline.update({ name: data.name, description: data.description });
  }

  async deletePipeline(id) {
    const pipeline = await db.Pipeline.findByPk(id);
    if (!pipeline) throw new Error('Pipeline not found');
    // Delete all stages and leads associated with this pipeline
    await db.Stage.destroy({ where: { pipelineId: id } });
    await db.Lead.update({ pipelineId: null, stageId: null }, { where: { pipelineId: id } });
    await pipeline.destroy();
    return true;
  }

  // ========== STAGE CRUD ==========

  async getStages(pipelineId) {
    return await db.Stage.findAll({
      where: { pipelineId },
      order: [['order', 'ASC']]
    });
  }

  // async createStage(data) {
  //   // Get the max order for this pipeline to append at the end
  //   const maxOrder = await db.Stage.max('order', { where: { pipelineId: data.pipelineId } });
  //   return await db.Stage.create({
  //     name: data.name,
  //     pipelineId: data.pipelineId,
  //     order: (maxOrder || 0) + 1,
  //     color: data.color || '#3b82f6'
  //   });
  // }
  async createStage(data) {
  const { pipelineId, name, color } = data;

  // Explicitly compute max order
  const maxOrderRow = await db.Stage.findOne({
    where: { pipelineId },
    attributes: [[db.sequelize.fn('MAX', db.sequelize.col('order')), 'maxOrder']],
    raw: true,
  });

  const maxOrder = maxOrderRow?.maxOrder;
  const newOrder = typeof maxOrder === 'number' ? maxOrder + 1 : 1;

  return await db.Stage.create({
    name,
    pipelineId,
    color: color || '#3b82f6',
    order: newOrder,
  });
}

  async updateStage(id, data) {
    const stage = await db.Stage.findByPk(id);
    if (!stage) throw new Error('Stage not found');
    return await stage.update({
      name: data.name !== undefined ? data.name : stage.name,
      color: data.color !== undefined ? data.color : stage.color
    });
  }

  async deleteStage(id) {
    const stage = await db.Stage.findByPk(id);
    if (!stage) throw new Error('Stage not found');
    // Move leads in this stage to null stageId
    await db.Lead.update({ stageId: null }, { where: { stageId: id } });
    await stage.destroy();
    return true;
  }

  async reorderStage(id, newOrder) {
    const stage = await db.Stage.findByPk(id);
    if (!stage) throw new Error('Stage not found');
    return await stage.update({ order: newOrder });
  }

  // ========== KANBAN ==========

  async getKanbanData(pipelineId) {
    const where = pipelineId ? { id: pipelineId } : {};
    const pipelines = await db.Pipeline.findAll({
      where,
      include: [{
        model: db.Stage,
        as: 'stages',
        include: [{
          model: db.Lead,
          as: 'leads',
          include: [{
            model: db.User,
            as: 'assignedUser',
            attributes: ['id', 'name', 'email']
          }]
        }],
        order: [['order', 'ASC']]
      }],
      order: [['createdAt', 'ASC']]
    });

    // If a specific pipeline was requested, return just that one
    if (pipelineId) {
      return pipelines[0] || null;
    }
    return pipelines;
  }

  async updateLeadStage(leadId, stageId) {
    const lead = await db.Lead.findByPk(leadId);
    if (!lead) throw new Error('Lead not found');
    return await lead.update({ stageId });
  }
}

export default new PipelineServices();