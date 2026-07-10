import TaskService from '../services/task.services.js';

class TaskController {
  async create(req, res) {
    try {
      const creatorId = req.user.id; // From auth middleware
      const task = await TaskService.createTask(req.body, creatorId);
      res.status(201).json({ success: true, data: task });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async getAll(req, res) {
    try {
      const tasks = await TaskService.getAllTasks(req.query);
      res.json({ success: true, data: tasks });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async update(req, res) {
    try {
      const task = await TaskService.updateTask(req.params.id, req.body);
      res.json({ success: true, data: task });
    } catch (err) {
      const statusCode = err.message === 'Task not found' ? 404 : 400;
      res.status(statusCode).json({ success: false, message: err.message });
    }
  }

  async delete(req, res) {
    try {
      await TaskService.deleteTask(req.params.id);
      res.json({ success: true, message: 'Task deleted successfully' });
    } catch (err) {
      const statusCode = err.message === 'Task not found' ? 404 : 400;
      res.status(statusCode).json({ success: false, message: err.message });
    }
  }

  async complete(req, res) {
    try {
      const task = await TaskService.completeTask(req.params.id);
      res.json({ success: true, data: task });
    } catch (err) {
      const statusCode = err.message === 'Task not found' ? 404 : 400;
      res.status(statusCode).json({ success: false, message: err.message });
    }
  }
}

export default new TaskController();