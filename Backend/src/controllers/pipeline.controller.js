import PipelineServices from '../services/pipelines.services.js';

class PipelineController {
  // ========== PIPELINE CRUD ==========

  async getAllPipelines(req, res) {
    try {
      const pipelines = await PipelineServices.getAllPipelines();
      res.json({ success: true, data: pipelines });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async createPipeline(req, res) {
    try {
      const pipeline = await PipelineServices.createPipeline(req.body);
      res.status(201).json({ success: true, data: pipeline });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async updatePipeline(req, res) {
    try {
      const pipeline = await PipelineServices.updatePipeline(req.params.id, req.body);
      res.json({ success: true, data: pipeline });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async deletePipeline(req, res) {
    try {
      await PipelineServices.deletePipeline(req.params.id);
      res.json({ success: true, message: 'Pipeline deleted successfully' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // ========== STAGE CRUD ==========

  async getStages(req, res) {
    try {
      const stages = await PipelineServices.getStages(req.params.pipelineId);
      res.json({ success: true, data: stages });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async createStage(req, res) {
    try {
      const stage = await PipelineServices.createStage({
        name: req.body.name,
        pipelineId: req.params.pipelineId,
        color: req.body.color
      });
      res.status(201).json({ success: true, data: stage });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async updateStage(req, res) {
    try {
      const stage = await PipelineServices.updateStage(req.params.stageId, req.body);
      res.json({ success: true, data: stage });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async deleteStage(req, res) {
    try {
      await PipelineServices.deleteStage(req.params.stageId);
      res.json({ success: true, message: 'Stage deleted successfully' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async reorderStage(req, res) {
    try {
      const stage = await PipelineServices.reorderStage(req.params.stageId, req.body.order);
      res.json({ success: true, data: stage });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // ========== KANBAN ==========

  async getKanban(req, res) {
    try {
      const pipelineId = req.params.pipelineId || req.query.pipelineId;
      const data = await PipelineServices.getKanbanData(pipelineId || null);
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Drag & Drop - Move lead to new stage
  async updateLeadStage(req, res) {
    try {
      const { leadId, stageId } = req.body;
      const lead = await PipelineServices.updateLeadStage(leadId, stageId);
      res.json({ success: true, lead });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

export default new PipelineController();