import express from 'express';
import auth, { UserRole } from '../../middleware/auth';
import { authController } from './auth.controller';

const router = express.Router();

router.get('/users', auth(UserRole.ADMIN), authController.getAllUser);
router.get('/users/me', auth(UserRole.STUDENT), authController.getMyProfile);
router.patch(
  '/users/me',
  auth(UserRole.STUDENT),
  authController.updateMyProfile
);
router.patch(
  '/users/:userId',
  auth(UserRole.ADMIN),
  authController.updateUserStatus
);

export const authRouter = router;
