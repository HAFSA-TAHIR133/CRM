import express from 'express';
import authRoutes from './auth.routes.js';
import leadRoutes from './lead.routes.js';
import taskRoutes from './tasks.routes.js';
import {authMiddleware} from '../middleware/authMiddleware.js';
import dashboard from './dashboard.routes.js';
import pipelines from './pipeline.routes.js';
import settings from './settings.routes.js';
import users from './user.routes.js';
import activity  from './activity.routes.js';
import notes from './note.routes.js';
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/leads',authMiddleware,leadRoutes);
router.use('/tasks',authMiddleware,taskRoutes);
router.use('/dashboard',authMiddleware,dashboard);
router.use('/pipelines',authMiddleware,pipelines);

router.use('/users', authMiddleware,users);
router.use('/settings', authMiddleware,settings);
router.use('/activities', authMiddleware,activity);
router.use('/notes',authMiddleware,notes);


export default router;