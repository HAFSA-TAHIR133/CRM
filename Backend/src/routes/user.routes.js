import express from 'express';
const router=express.Router();
import UserController from '../controllers/user.controller.js';
import { avatarUpload } from '../config/avatarMulter.js';

router.get('/profile', UserController.getProfile);
router.get('/me', UserController.getProfile);
router.put('/profile/avatar', avatarUpload.single('avatar'), UserController.uploadAvatar);
router.get('/', UserController.getAll);
router.post('/', UserController.create);
router.put('/:id', UserController.update);

export default router;