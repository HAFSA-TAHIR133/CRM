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

  async updateProfile(req, res) {
    try {
      console.log("Updating user ID:", req.user?.id);
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          message: "Unauthorized user",
        });
      }

      const userId = req.user.id;

      const updatedUser = await UserService.updateUserProfile(
        userId,
        req.body,
        req.file
      );

      if (!updatedUser) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      return res.json({
        success: true,
        message: "Profile updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Failed to update profile",
      });
    }
  }

  // NEW: Avatar-only update
  async updateAvatar(req, res) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          message: "Unauthorized user",
        });
      }

      // Optionally, ensure the ID in URL matches the token:
      // const urlUserId = req.params.id;
      // if (String(urlUserId) !== String(req.user.id)) {
      //   return res.status(403).json({ message: "Forbidden" });
      // }

      const userId = req.user.id;

      const updatedUser = await UserService.updateUserAvatar(
        userId,
        req.file
      );

      if (!updatedUser) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      return res.json({
        success: true,
        message: "Avatar updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Failed to update avatar",
      });
    }
  }
  // async uploadAvatar(req, res) {
  //   try {
  //     if (!req.file) {
  //       return res.status(400).json({ success: false, message: 'No image file provided' });
  //     }
  //     const user = await UserService.updateAvatar(req.user.id, req.file.filename);
  //     res.json({ success: true, data: user, message: 'Avatar updated successfully' });
  //   } catch (error) {
  //     res.status(400).json({ success: false, message: error.message });
  //   }
  // }

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