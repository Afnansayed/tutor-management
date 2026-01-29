import express from 'express';
import { categoryController } from './category.controller';
import auth, { UserRole } from '../../middleware/auth';

const router = express.Router();

router.post(
  '/category',
  auth(UserRole.ADMIN),
  categoryController.createCategory
);

router.get('/category', auth(UserRole.ADMIN), categoryController.getCategory);
router.delete(
  '/category:id',
  auth(UserRole.ADMIN),
  categoryController.deleteCategory
);

export const categoryRouter = router;
