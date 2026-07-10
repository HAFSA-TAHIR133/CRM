import express from 'express';
const router = express.Router();
import PipelineController from '../controllers/pipeline.controller.js';
import { authorize } from '../middleware/authMiddleware.js';

// Pipeline CRUD (Admin only for create/update/delete)
router.get('/', PipelineController.getAllPipelines);
router.post('/', authorize('admin'), PipelineController.createPipeline);
router.put('/:id', authorize('admin'), PipelineController.updatePipeline);
router.delete('/:id', authorize('admin'), PipelineController.deletePipeline);

// Stage CRUD within a pipeline
router.get('/:pipelineId/stages', PipelineController.getStages);
router.post('/:pipelineId/stages', authorize('admin'), PipelineController.createStage);
router.put('/stages/:stageId', authorize('admin'), PipelineController.updateStage);
router.delete('/stages/:stageId', authorize('admin'), PipelineController.deleteStage);
router.put('/stages/:stageId/reorder', authorize('admin'), PipelineController.reorderStage);

// Kanban
router.get('/:pipelineId/kanban', PipelineController.getKanban);

// Drag & Drop - Move lead to new stage
router.patch('/leads/:leadId/stage', PipelineController.updateLeadStage);

export default router;