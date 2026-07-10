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
      console.error(error);
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

  async assignLead(req, res) {
    try {
      const { userId } = req.body;
      const leadId = req.params.id;
      const assigningUserId = req.user.id; // Populated from your authentication middleware

      const updatedLead = await LeadService.assignLeadToUser(leadId, userId, assigningUserId);

      res.json({ 
        success: true, 
        lead: updatedLead 
      });
    } catch (error) {
      // Return a 404 if the service throws 'Lead not found', otherwise 400 for bad requests
      const statusCode = error.message === 'Lead not found' ? 404 : 400;
      res.status(statusCode).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

};

export default new LeadController();