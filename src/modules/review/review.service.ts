import e from 'express';
import { Reviews } from '../../../generated/prisma/client';
import { prisma } from '../../lib/prisma';

const createReview = async (
  data: Omit<Reviews, 'id' | 'createdAt' | 'updatedAt' | 'isApproved'>
) => {
  console.log({ data });
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
  const result = await prisma.reviews.create({
    data: {
      ...data,
      student_id: existingBooking.student_id,
      tutor_id: existingBooking.tutor_id,
    },
  });
  return result;
};

export const reviewService = {
  createReview,
};
