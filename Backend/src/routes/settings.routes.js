import express from 'express';
const router = express.Router();

import SettingsController from '../controllers/settings.controller.js';

router.get('/', SettingsController.getSettings);
router.put('/', SettingsController.updateSettings);

export default router;