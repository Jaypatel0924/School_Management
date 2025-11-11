import express from 'express';
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  getNoteById,
  updateTodoStatus
} from '../controllers/noteController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, getNotes)
  .post(protect, createNote);

router.route('/:id')
  .get(protect, getNoteById)
  .put(protect, updateNote)
  .delete(protect, deleteNote);

router.route('/:id/status')
  .patch(protect, updateTodoStatus);

export default router;