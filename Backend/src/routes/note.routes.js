import express from 'express';
import { getNotes, createNote } from '../controllers/note.controller.js';
import { upload } from '../config/multer.js';

const router = express.Router();


router.route('/').get(getNotes)
  .post(upload.single('file'), createNote); // 'file' matches the FormData key

export default router;