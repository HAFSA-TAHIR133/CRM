import AuthController from '../controllers/auth.controllers.js';
import validate from '../middleware/validate.js';
import authValidator from '../validators/authValidator.js';
import express from 'express';
const router=express.Router();

router.post('/signup', validate(authValidator.signup),AuthController.register );
router.post('/login', validate(authValidator.login), AuthController.login);
router.post('/refresh', AuthController.refresh); 

export default router;