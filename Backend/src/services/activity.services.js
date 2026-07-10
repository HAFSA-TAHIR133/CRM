import db from '../models/index.js';

/**
 * Fetches all tracking logs related to a specific lead
 * @param {number} leadId 
 */
export const getActivitiesByLeadIdService = async (leadId) => {
  return await db.Activity.findAll({
    where: { leadId: Number(leadId) },
    include: [
      {
        model: db.User,
        as: 'user',
        attributes: ['id', 'name'] // Drops bulky password hashes from the timeline payload
      }
    ],
    order: [['createdAt', 'DESC']] // Most recent logs appear at the top of the timeline
  });
};

/**
 * Helper Service to create an audit log from other actions (e.g., inside Lead Controllers)
 */
export const createActivityLogService = async ({ leadId, userId, action, description }) => {
  return await db.Activity.create({ leadId, userId, action, description });
};