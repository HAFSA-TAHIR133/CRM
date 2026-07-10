import LeadController from '../controllers/lead.controllers.js';
import express from 'express';
const router=express.Router();

router.post('/',LeadController.create);
router.get('/', LeadController.getAll);
router.get('/:id', LeadController.getOne);
router.put('/:id', LeadController.update);
router.delete('/:id', LeadController.delete);
router.put('/:id/assign', LeadController.assignLead);

export default router;


