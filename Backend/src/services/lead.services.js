import db from '../models/index.js';

class LeadService {
  async createLead(data) {
    if (!data.pipelineId || !data.stageId) {
      const pipeline = await db.Pipeline.findOne({
        include: [{
          model: db.Stage,
          as: 'stages',
          separate: true,
          order: [['order', 'ASC']]
        }],
        order: [['createdAt', 'ASC']]
      });

      if (pipeline) {
        data.pipelineId = data.pipelineId || pipeline.id;
        const firstStage = pipeline.stages?.[0] || await db.Stage.findOne({
          where: { pipelineId: pipeline.id },
          order: [['order', 'ASC']]
        });
        data.stageId = data.stageId || firstStage?.id;
      }
    }

    return await db.Lead.create(data);
  }

  async getAllLeads({ page = 1, limit = 10, search = '' }) {
    const offset = (page - 1) * limit;
    
    // Fixed: Search across name, contactInfo, and leadSource instead of just name
    const where = search ? {
      [db.Sequelize.Op.or]: [
        { name: { [db.Sequelize.Op.like]: `%${search}%` } },
        { contactInfo: { [db.Sequelize.Op.like]: `%${search}%` } },
        { leadSource: { [db.Sequelize.Op.like]: `%${search}%` } }
      ]
    } : {};

    return await db.Lead.findAndCountAll({
      where,
      include: [
        { model: db.User, as: 'assignedUser', attributes: ['id', 'name', 'email'] },
        { model: db.Pipeline, as: 'pipeline', attributes: ['id', 'name'] },
        { model: db.Stage, as: 'stage', attributes: ['id', 'name', 'color'] }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });
  }

  async getLeadById(id) {
    return await db.Lead.findByPk(id, {
      include: ['assignedUser', 'pipeline', 'stage']
    });
  }

  async updateLead(id, data) {
    const lead = await db.Lead.findByPk(id);
    if (!lead) throw new Error('Lead not found');
    return await lead.update(data);
  }

  async deleteLead(id) {
    const lead = await db.Lead.findByPk(id);
    if (!lead) throw new Error('Lead not found');
    await lead.destroy();
    return true;
  }

  // lead and activity
  async assignLeadToUser(leadId, userId, assigningUserId) {
    const lead = await db.Lead.findByPk(leadId);
    if (!lead) {
      throw new Error('Lead not found');
    }

    // Update the assignment
    await lead.update({ assignedTo: userId });

    // Create the history audit trail log
    await db.Activity.create({
      leadId: lead.id,
      userId: assigningUserId,
      action: 'Lead Assigned',
      description: `Assigned to User ID: ${userId}`
    });

    return lead;
  }
}

export default new LeadService();
