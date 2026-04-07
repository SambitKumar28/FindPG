import express from 'express';
import {
  createPG,
  getAllPGs,
  getPGById,
  updatePG,
  deletePG,
} from '../controllers/pgController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.get('/', getAllPGs);
router.get('/:id', getPGById);

router.post('/', protect, authorizeRoles('owner', 'admin'), upload.array('images', 5), createPG);
router.put('/:id', protect, authorizeRoles('owner', 'admin'), updatePG);
router.delete('/:id', protect, authorizeRoles('owner', 'admin'), deletePG);


export default router;