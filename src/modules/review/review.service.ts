import { Reviews } from '../../../generated/prisma/client';
import { prisma } from '../../lib/prisma';

const createReview = async (
  data: Omit<Reviews, 'id' | 'createdAt' | 'updatedAt' | 'isApproved'>
) => {
  const { rating, ...rest } = data;
  if (Number(rating) < 1 || Number(rating) > 5) {
    throw new Error('Rating must be between 1 and 5');
  }

  const existingBooking = await prisma.bookings.findUnique({
    where: {
      id: data.booking_id,
    },
    include: {
      review: true,
    },
  });

  if (!existingBooking) {
    throw new Error('Booking not found');
  }

  if (existingBooking.review) {
    throw new Error('Review already exists for this booking');
  }

  if (existingBooking.status !== 'COMPLETED') {
    throw new Error(
      'You can only review a booking after it has been completed.'
    );
  }

  const result = await prisma.reviews.create({
    data: {
      ...rest,
      rating: Number(rating),
      student_id: existingBooking.student_id,
      tutor_id: existingBooking.tutor_id,
    },
  });
  return result;
};

const getAllReviews = async () => {
  const result = await prisma.reviews.findMany({
    include: {
      student: {
        select: {
          name: true,
          image: true,
        },
      },
      tutor: {
        select: {
          id: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' },
  });
  return result;
};
const getTutorReviews = async (tutor_id: string) => {
  const result = await prisma.reviews.findMany({
    where: {
      tutor_id,
      isApproved: true,
    },
    include: {
      student: {
        select: {
          name: true,
          image: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  return result;
};

const updateReview = async (
  review_id: string,
  student_id: string,
  data: { rating?: number; comment?: string }
) => {
  if (data.rating !== undefined) {
    if (Number(data.rating) < 1 || Number(data.rating) > 5) {
      throw new Error('Rating must be between 1 and 5');
    }
  }

  const isOwner = await prisma.reviews.findUnique({
    where: { id: review_id, student_id: student_id },
  });


  if (!isOwner) {
    throw new Error('You are not authorized to edit this review.');
  }

  return await prisma.reviews.update({
    where: { id: review_id },
    data,
  });
};

const updateReviewStatus = async (review_id: string, isApproved: boolean) => {
  return await prisma.reviews.update({
    where: { id: review_id },
    data: { isApproved },
  });
};

const deleteReview = async (review_id: string) => {
  return await prisma.reviews.delete({
    where: { id: review_id },
  });
};

export const reviewService = {
  createReview,
  getAllReviews,
  getTutorReviews,
  updateReview,
  updateReviewStatus,
  deleteReview,
};
