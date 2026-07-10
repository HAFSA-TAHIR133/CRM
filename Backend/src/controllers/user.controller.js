import UserService from '../services/user.services.js';

class UserController {
  async getProfile(req, res) {
    try {
      const user = await UserService.getProfile(req.user.id);
      res.json({ success: true, data: user });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  async uploadAvatar(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No image file provided' });
      }
      const user = await UserService.updateAvatar(req.user.id, req.file.filename);
      res.json({ success: true, data: user, message: 'Avatar updated successfully' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const users = await UserService.getAllUsers();
      res.json({ success: true, data: users });
    } catch (error) {
        console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async create(req, res) {
    try {
      const user = await UserService.createUser(req.body);
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async update(req, res) {
    try {
      const user = await UserService.updateUser(req.params.id, req.body);
      res.json({ success: true, data: user });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
};

export default new UserController();