import express from 'express';
const router=express.Router();
import UserController from '../controllers/user.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import upload from '../middleware/multer.js';

router.get('/profile', UserController.getProfile);
router.get('/me', UserController.getProfile);
// router.put('/profile/avatar', avatarUpload.single('avatar'), UserController.uploadAvatar);
router.get('/', UserController.getAll);
router.post('/', UserController.create);
router.put('/:id', UserController.update);


// Existing routes (example)
router.put('/user/profile', authMiddleware, upload.single('profileImage'), UserController.updateProfile);

// NEW ROUTE: must match frontend URL
router.put('/profile/avatar', authMiddleware, upload.single('avatar'), UserController.updateAvatar);


export default router;