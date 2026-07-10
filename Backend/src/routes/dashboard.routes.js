import express from 'express';
import { getDashboardMetrics } from '../controllers/dashboard.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js'; // Imported your existing middleware

const router = express.Router();

// Protect the route so only authenticated users can access their metrics
router.get('/metrics', authMiddleware, getDashboardMetrics);

export default router;