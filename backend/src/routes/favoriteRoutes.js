import express from 'express';
import {
  addToFavorites,
  removeFromFavorites,
  getFavorites,
} from '../controllers/favoriteController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getFavorites);
router.post('/:pgId', protect, addToFavorites);
router.delete('/:pgId', protect, removeFromFavorites);

export default router;