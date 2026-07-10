// src/services/dashboard.services.js
import { Op } from 'sequelize';
import db from '../models/index.js';

export const getDashboardMetricsService = async (user) => {
  const { role, id } = user || {};
  const isAdmin = role === "admin";

  // 1. Total Leads Count
  const totalLeads = await db.Lead.count({ 
    where: isAdmin ? {} : { assignedTo: id } 
  });

  // 2. Pipeline Value Sum (Using the clean TEXT cast logic)
  const pipelineSum = await db.Lead.sum('expectedValue', { 
    where: db.sequelize.where(
      db.sequelize.cast(db.sequelize.col('status'), 'TEXT'),
      { [Op.notIn]: ['won', 'lost'] }
    )
  }) || 0;

  // 3. Overdue Tasks Count (Removed optional chaining to ensure variable initializes)
  let overdueTasks = 0;
  if (db.Task) {
    overdueTasks = await db.Task.count({
      where: {
        ...(isAdmin ? {} : { assignedTo: id }),
        status: { [Op.ne]: 'completed' }, // 👈 Change 'Completed' to lowercase 'completed'
        dueDate: { [Op.lt]: new Date() }
      }
    });
  }

  // 4. Compile and Return Matrix Payload
  return {
    totalLeads,
    pipelineValue: isAdmin ? `$${(pipelineSum / 1000000).toFixed(2)}M` : `$${pipelineSum.toLocaleString()}`,
    overdueTasks,
    conversionRate: "64%",
  };
};