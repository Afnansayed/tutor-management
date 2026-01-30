import express from 'express';
import { tutorController } from './tutor.controller';
import auth, { UserRole } from '../../middleware/auth';

const router = express.Router();

router.post(
  '/tutor-profile',
  auth(UserRole.TUTOR),
  tutorController.createTutorProfile
);
router.get('/tutor-profile', tutorController.getAllTutorProfiles);
router.get(
  '/tutor-profile/me',
  auth(UserRole.TUTOR),
  tutorController.getMyProfile
);

router.get('/tutor-profile/:profileId', tutorController.getProfileById);

export const tutorProfileRouter = router;
