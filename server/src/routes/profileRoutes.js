import express from 'express';
import { createOrUpdateProfile, getProfile, updateProfile } from '../controllers/profileController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createOrUpdateProfile);
router.get('/', protect, getProfile);
router.put('/', protect, updateProfile);

export default router;
