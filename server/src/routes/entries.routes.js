import express from 'express';
import {
  createEntry,
  getEntries,
  getEntry,
  updateEntry,
  deleteEntry,
  getMoodStats
} from '../controllers/entries.controller.js';
import { verifyToken, isOwner } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Routes that don't require ownership verification
router.post('/', createEntry);
router.get('/', getEntries);
router.get('/stats', getMoodStats);

// Routes that require ownership verification
router.get('/:id', getEntry);
router.put('/:id', isOwner, updateEntry);
router.delete('/:id', isOwner, deleteEntry);

export default router;
