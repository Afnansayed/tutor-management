import express from 'express';
import { categoryController } from './category.controller';
import auth, { UserRole } from '../../middleware/auth';

const router = express.Router();

router.post(
  '/category',
  auth(UserRole.ADMIN),
  categoryController.createCategory
);

router.get(
  '/category',
  auth(UserRole.ADMIN, UserRole.TUTOR),
  categoryController.getCategory
);

router.get(
  '/category/:category_id',
  auth(UserRole.ADMIN, UserRole.TUTOR),
  categoryController.getCategoryById
);

router.patch(
  '/category/:category_id',
  auth(UserRole.ADMIN),
  categoryController.updateCategory
);

export const categoryRouter = router;
