import express from 'express';
import { reviewController } from './review.controller';
import auth, { UserRole } from '../../middleware/auth';

const router = express.Router();

router.post('/review', auth(UserRole.STUDENT), reviewController.createReview);

router.get('/review', reviewController.getAllReviews);

router.get('/review/tutor',auth(UserRole.TUTOR), reviewController.getTutorReviews);

router.patch(
  '/review/:review_id/status',
  auth(UserRole.ADMIN),
  reviewController.updateReviewStatus
);

router.patch(
  '/review/:review_id',
  auth(UserRole.STUDENT),
  reviewController.updateReview
);

router.delete(
  '/review/:review_id',
  auth(UserRole.STUDENT, UserRole.ADMIN),
  reviewController.deleteReview
);

export const reviewRouter = router;
