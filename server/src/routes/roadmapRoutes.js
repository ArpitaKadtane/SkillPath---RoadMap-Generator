import express from 'express';
import protect from '../middleware/authMiddleware.js';
import { generateRoadmap, createRoadmap, getMyRoadmaps, getMyRoadmapById, deleteRoadmap, updateTaskStatus } from '../controllers/roadmapController.js';

const router = express.Router();

router.post('/generate', protect, generateRoadmap);
router.post('/', protect, createRoadmap);
router.get('/', protect, getMyRoadmaps);
router.get('/:id', protect, getMyRoadmapById);
router.delete('/:id', protect, deleteRoadmap);
router.patch('/tasks/:id', protect, updateTaskStatus);

export default router;
