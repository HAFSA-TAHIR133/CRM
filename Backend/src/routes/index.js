import express from 'express';
import authRoutes from './auth.routes.js';
import leadRoutes from './lead.routes.js';
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/leads',leadRoutes);
// app.use('/api/leads', require('./routes/leadRoutes'));
// app.use('/api/pipelines', require('./routes/pipelineRoutes'));
// app.use('/api/tasks', require('./routes/taskRoutes'));

export default router;