import { Bookings, BookingStatus } from '../../../generated/prisma/client';
import parseTime from '../../helpers/parseTime';
import { prisma } from '../../lib/prisma';

const createBooking = async (
  data: Omit<
    Bookings,
    'id' | 'created_at' | 'updated_at' | 'total_price' | 'status'
  >
) => {
  const { tutor_id, schedule_id, booking_date, student_id } = data;
  const scheduleExists = await prisma.tutorSchedule.findUnique({
    where: { id: schedule_id },
    include: { tutor: true },
  });

  if (!scheduleExists || scheduleExists.tutor_id !== tutor_id) {
    throw new Error(
      'The provided schedule does not exist for the specified tutor.'
    );
  }

  if (!scheduleExists.isAvailable || !scheduleExists.isActive) {
    throw new Error('The provided schedule is not available for booking.');
  }

  if (booking_date < new Date()) {
    throw new Error('The booking date cannot be in the past.');
  }

  const startTime = parseTime(scheduleExists.start_time);
  const endTime = parseTime(scheduleExists.end_time);
  const totalHours = (endTime - startTime) / (1000 * 60 * 60);

  if (totalHours <= 0) {
    throw new Error(
      'Invalid schedule times: end time must be after start time.'
    );
  }
  const calculatedTotalPrice =
    (scheduleExists.tutor.hourly_rate || 0) * totalHours;

  const result = await prisma.$transaction(async tx => {
    const newBooking = await tx.bookings.create({
      data: {
        booking_date: new Date(booking_date),
        total_price: Number(calculatedTotalPrice) || 0,
        session_link: `https://meet.google.com/dqb-rxmh-xgw`,
        tutor: {
          connect: { user_id: tutor_id },
        },
        student: {
          connect: { id: student_id },
        },
        tutor_schedule: {
          connect: { id: schedule_id },
        },
      },
    });
    await tx.tutorSchedule.update({
      where: { id: schedule_id },
      data: { isAvailable: false },
    });
    return newBooking;
  });

  return result;
};

const getAllBookings = async () => {
  const result = await prisma.bookings.findMany({
    include: {
      student: true,
      tutor_schedule: true,
      tutor: {
        select: {
          profile_picture: true,
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  return result;
};
const getTutorBookings = async (tutor_id: string) => {
  const result = await prisma.bookings.findMany({
    where: { tutor_id },
    include: { student: true, tutor_schedule: true },
    orderBy: { createdAt: 'desc' },
  });
  return result;
};

const getStudentBookings = async (student_id: string) => {
  const result = await prisma.bookings.findMany({
    where: { student_id },
    include: {
      tutor: {
        select: {
          profile_picture: true,
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
      tutor_schedule: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  return result;
};

const getBookingById = async (booking_id: string) => {
  const result = await prisma.bookings.findUnique({
    where: { id: booking_id },
    include: {
      student: true,
      tutor: {
        select: {
          profile_picture: true,
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
      tutor_schedule: true,
      review: {
        select: {
          id: true,
          rating: true,
          comment: true,
          isApproved: true,
        },
      },
    },
  });
  return result;
};

const updateBookingStatus = async (
  bookingId: string,
  status: BookingStatus
) => {
  if (status === 'CANCELLED' || status === 'COMPLETED') {
    return await prisma.$transaction(async tx => {
      const booking = await tx.bookings.update({
        where: { id: bookingId },
        data: { status: status },
      });

      await tx.tutorSchedule.update({
        where: { id: booking.schedule_id },
        data: { isAvailable: true },
      });

      return booking;
    });
  }

  return await prisma.bookings.update({
    where: { id: bookingId },
    data: { status },
  });
};

export const bookingService = {
  createBooking,
  getAllBookings,
  getTutorBookings,
  getStudentBookings,
  updateBookingStatus,
  getBookingById,
};
