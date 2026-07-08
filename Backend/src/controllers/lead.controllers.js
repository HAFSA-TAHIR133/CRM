import LeadService from '../services/lead.services.js';

class LeadController {
  async create(req, res) {
    try {
      const lead = await LeadService.createLead(req.body);
      res.status(201).json({ success: true, lead });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const result = await LeadService.getAllLeads(req.query);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getOne(req, res) {
    try {
      const lead = await LeadService.getLeadById(req.params.id);
      if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
      res.json({ success: true, lead });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async update(req, res) {
    try {
      const lead = await LeadService.updateLead(req.params.id, req.body);
      res.json({ success: true, lead });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async delete(req, res) {
    try {
      await LeadService.deleteLead(req.params.id);
      res.json({ success: true, message: 'Lead deleted successfully' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  

};

export default new LeadController();