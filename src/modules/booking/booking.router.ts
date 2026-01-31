
import express  from 'express';
import { bookingController } from './booking.controller';
import auth, { UserRole } from '../../middleware/auth';




const router = express.Router();

router.post(
  '/booking',
  auth(UserRole.STUDENT, UserRole.ADMIN),
  bookingController.createBooking
);

export const bookingRouter = router;