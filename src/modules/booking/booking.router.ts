import express from 'express';
import { bookingController } from './booking.controller';
import auth, { UserRole } from '../../middleware/auth';

const router = express.Router();

router.post(
  '/booking',
  auth(UserRole.STUDENT, UserRole.ADMIN),
  bookingController.createBooking
);

router.get('/bookings', auth(UserRole.ADMIN), bookingController.getAllBookings);

router.get(
  '/bookings/tutor',
  auth(UserRole.TUTOR),
  bookingController.getTutorBookings
);

router.get(
  '/bookings/student',
  auth(UserRole.STUDENT),
  bookingController.getStudentBookings
);

router.patch(
  '/booking/:bookingId/status',
  auth(UserRole.TUTOR, UserRole.STUDENT, UserRole.ADMIN),
  bookingController.updateBookingStatus
);

export const bookingRouter = router;
