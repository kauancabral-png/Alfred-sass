import { Router } from 'express';
import { protect } from '../middlewares/authMiddleware';
import { createCategory, getCategories, deleteCategory } from '../controllers/categoryController';

const router = Router();

router.use(protect);

router.post('/', createCategory);
router.get('/', getCategories);
router.delete('/:id', deleteCategory);

export default router;
