import express from 'express';
import { getActivities } from '../controllers/activity.controller.js';

const router = express.Router();

// Maps route endpoint and attaches token authorization guard checks
router.get('/', getActivities);

export default router;