import express from 'express';
import auth, { UserRole } from '../../middleware/auth';
import { tutorScheduleController } from './tutorSchedule.controller';

const router = express.Router();

router.post(
  '/tutor-schedule',
  auth(UserRole.TUTOR),
  tutorScheduleController.createTutorSchedule
);
router.get(
  '/tutor-schedule/me',
  auth(UserRole.TUTOR),
  tutorScheduleController.getMySchedule
);

router.get(
  '/tutor-schedule/:scheduleId',
  auth(UserRole.TUTOR),
  tutorScheduleController.getTutorScheduleById
);
router.patch(
  '/tutor-schedule/:scheduleId',
  auth(UserRole.TUTOR),
  tutorScheduleController.updateTutorSchedule
);
router.delete(
  '/tutor-schedule/:scheduleId',
  auth(UserRole.TUTOR, UserRole.ADMIN),
  tutorScheduleController.deleteTutorSchedule
);

export const tutorScheduleRouter = router;
