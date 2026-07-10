import db from '../models/index.js';

class TaskService {
  async createTask(taskData, creatorId) {
    const { title, name, priority, assignedTo, leadId, dueDate } = taskData;

    const task = await db.Task.create({
      name: name || title,
      priority: priority ? priority.toLowerCase() : 'medium',
      dueDate: dueDate || null,
      assignedTo: assignedTo || creatorId,
      leadId: leadId || null,
    });

    if (task.leadId) {
      await db.Activity.create({
        leadId: task.leadId,
        userId: creatorId,
        action: 'Task Created',
        description: task.name
      });
    }

    return task;
  }

  async getAllTasks(filters) {
    const { leadId, status, priority } = filters;
    const where = {};
    
    if (leadId) where.leadId = leadId;
    if (status) where.status = status;
    if (priority) where.priority = priority;

    return await db.Task.findAll({ 
  where, 
  include: [{ model: db.User, as: 'assignedUser', attributes: ['id', 'name'] }] 
});
  }

  async updateTask(id, updateData) {
    const task = await db.Task.findByPk(id);
    if (!task) {
      throw new Error('Task not found');
    }
    
    await task.update(updateData);
    return task;
  }

  async deleteTask(id) {
    const deletedCount = await db.Task.destroy({ where: { id } });
    if (deletedCount === 0) {
      throw new Error('Task not found');
    }
    return true;
  }

  async completeTask(id) {
    const task = await db.Task.findByPk(id);
    if (!task) {
      throw new Error('Task not found');
    }
    
    await task.update({ status: 'completed' });
    return task;
  }
}

export default new TaskService();