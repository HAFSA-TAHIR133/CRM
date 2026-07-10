import db from '../models/index.js';
import bcrypt from 'bcryptjs';
import { uploadToCloudinary } from '../utils/cloudinary.js';

class UserService  {
  async getProfile(userId) {
    if (!userId) throw new Error('User not found');
    const user = await db.User.findByPk(userId, {
      attributes: { exclude: ['password', 'resetToken', 'resetTokenExpiry'] }
    });
    if (!user) throw new Error('User not found');
    return user;
  }

  async updateUserProfile(userId, body, file) {
    const { firstName, lastName, phone } = body;

    const user = await db.User.findByPk(userId);
    if (!user) return null;

    let profileImage = user.profileImage;

    if (file) {
      const result = await uploadToCloudinary(file.path);
      profileImage = result.secure_url;
    }

    await user.update({
      firstName: firstName ?? user.firstName,
      lastName: lastName ?? user.lastName,
      phone: phone ?? user.phone,
      profileImage,
    });

    await user.reload();
    return user.toJSON();
  }

  // NEW: Avatar-only update (updates 'avatar' column)
  async updateUserAvatar(userId, file) {
    if (!file) {
      // Optionally allow removing avatar if no file is sent
      // For now, we require a file.
      throw new Error("No image file provided");
    }

    const user = await db.User.findByPk(userId);
    if (!user) return null;

    const result = await uploadToCloudinary(file.path);
    const avatarUrl = result.secure_url;

    await user.update({
      avatar: avatarUrl,
    });

    await user.reload();
    return user.toJSON();
  }



  // async updateAvatar(userId, filename) {
  //   const user = await db.User.findByPk(userId);
  //   if (!user) throw new Error('User not found');
  //   const avatarUrl = `/uploads/avatars/${filename}`;
  //   await user.update({ avatar: avatarUrl });
  //   const userResponse = user.toJSON();
  //   delete userResponse.password;
  //   delete userResponse.resetToken;
  //   delete userResponse.resetTokenExpiry;
  //   return userResponse;
  // }

  async getAllUsers() {
    return await db.User.findAll({
      attributes: { exclude: ['password', 'refreshToken'] },
      order: [['createdAt', 'DESC']]
    });
  }

  async createUser(data) {
    const existingUser = await db.User.findOne({ where: { email: data.email } });
    if (existingUser) throw new Error('User with this email already exists');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password || 'default123', salt);

    return await db.User.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role || 'user'
    });
  }

  async updateUser(id, data) {
    const user = await db.User.findByPk(id);
    if (!user) throw new Error('User not found');

    const allowedFields = ['name', 'email', 'role', 'status', 'avatar'];
    const updateData = {};
    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updateData[field] = data[field];
      }
    }

    return await user.update(updateData);
  }

  async toggleUserStatus(id, status) {
    const user = await db.User.findByPk(id);
    if (!user) throw new Error('User not found');
    return await user.update({ status: status ? 'Active' : 'Inactive' });
  }
};

export default new UserService();