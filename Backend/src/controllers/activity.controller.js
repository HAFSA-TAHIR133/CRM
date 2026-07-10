import { getActivitiesByLeadIdService } from '../services/activity.services.js';

export const getActivities = async (req, res) => {
  try {
    const { leadId } = req.query; // Matches your frontend: params: { leadId }

    if (!leadId) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing parameter: leadId is required to extract audit timeline tracks." 
      });
    }

    const activities = await getActivitiesByLeadIdService(leadId);
    
    // Return direct array data to accommodate the frontend Array.isArray verification checks
    return res.status(200).json(activities);
  } catch (error) {
    console.error(error);
    console.error("Activity Timeline Controller Error:", error.message);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error reconstructing audit history tracks." 
    });
  }
};