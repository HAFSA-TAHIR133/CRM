import express from 'express';
import TaskController from '../controllers/task.controllers.js';
// import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', TaskController.create);
router.get('/', TaskController.getAll);
router.put('/:id', TaskController.update);
router.delete('/:id', TaskController.delete);
router.put('/:id/complete', TaskController.complete);

export default router;