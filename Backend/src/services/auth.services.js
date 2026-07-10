import db from '../models/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto, { randomUUID } from "crypto";
import {generateAccessToken,generateRefreshToken} from '../utils/jwt.js';

class AuthenticateServices {
  // 1. REGISTER
  async register(userData) {
    const { name, email, password, role = 'user' } = userData;

    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await db.User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    const userResponse = user.toJSON();
    delete userResponse.password;

    return userResponse;
  }

  // 2. LOGIN
  async login(email, password) {
    const user = await db.User.findOne({ where: { email } });
    if (!user) throw new Error('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    // Decode refresh token to get its exact expiration date
    const decodedRefresh = jwt.decode(refreshToken);
    const expiresAt = new Date(decodedRefresh.exp * 1000);

    // Save this session in the database
    await db.Session.create({
      sessionId: randomUUID(),
      userId: user.id,
      refreshToken,
      expiresAt,
    });

    const userData = user.toJSON();
    delete userData.password;

    return { user: userData, accessToken, refreshToken };
  }

  // 3. AUTOMATIC REFRESH TOKEN (Checks Session Table)
  async refreshToken(oldRefreshToken) {
    if (!oldRefreshToken) throw new Error('No refresh token provided');

    // Verify token validity
    let decoded;
    try {
      decoded = jwt.verify(oldRefreshToken, env.jwtRefreshSecret);
    } catch (err) {
      throw new Error('Invalid or expired refresh token');
    }

    // Look for the active session in the database
    const session = await db.Session.findOne({ where: { refreshToken: oldRefreshToken } });
    
    // IF THE SESSION IS DELETED (e.g., Logged out from another device), REJECT!
    if (!session) {
      throw new Error('Session has been revoked. Please log in again.');
    }

    const user = await db.User.findByPk(decoded.id);
    if (!user) throw new Error('User not found');

    // Generate brand new pair
    const newAccessToken = await generateAccessToken(user);
    const newRefreshToken = await generateRefreshToken(user);
    const decodedRefresh = jwt.decode(newRefreshToken);
    const expiresAt = new Date(decodedRefresh.exp * 1000);

    // Update current session record with the new token details
    await session.update({
      refreshToken: newRefreshToken,
      expiresAt,
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  // 4. LOGOUT FROM ALL DEVICES
  async logoutFromAllDevices(userId) {
    await db.Session.destroy({
      where: { userId }
    });
    
    return { success: true, message: 'Logged out successfully from all devices.' };
  }

  async forgotPassword(email) {
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      return { success: true, message: 'If that email exists, a reset link has been sent.' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

    await user.update({ resetToken, resetTokenExpiry });

    return {
      success: true,
      message: 'If that email exists, a reset link has been sent.',
      resetToken,
      resetUrl: `/reset-password?token=${resetToken}`
    };
  }

  async resetPassword(token, newPassword) {
    const user = await db.User.findOne({
      where: {
        resetToken: token,
        resetTokenExpiry: { [db.Sequelize.Op.gt]: new Date() }
      }
    });

    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await user.update({
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null
    });

    return { success: true, message: 'Password reset successfully' };
  }
}

export default new AuthenticateServices();