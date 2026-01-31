import { Response } from "express";
import { Bookings } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createBooking = async (
  data: Omit<Bookings, "id" | "created_at" | "updated_at" |"total_price"|"status">
) => {
  const {
    tutor_id,
    schedule_id,
    booking_date,
  } = data;
  const scheduleExists = await prisma.tutorSchedule.findUnique({
    where: { id: schedule_id},
    include: { tutor: true },
  });

  if (!scheduleExists || scheduleExists.tutor_id !== tutor_id) {
    throw new Error("The provided schedule does not exist for the specified tutor.");
  }

  if (!scheduleExists.isAvailable || !scheduleExists.isActive) {
     throw new Error("The provided schedule is not available for booking.");
    }

  if (booking_date < new Date()) {
    throw new Error("The booking date cannot be in the past.");
  }
  


  const startTime = new Date(scheduleExists.start_time).getTime();
  const endTime = new Date(scheduleExists.end_time).getTime();
  const totalHours = (endTime - startTime) / ( 1000 * 60 * 60);

  if (totalHours <= 0) {
    throw new Error("Invalid schedule times: end time must be after start time.");
  }

  const calculatedTotalPrice = (scheduleExists.tutor.hourly_rate || 0) * totalHours;  

    const result = await prisma.$transaction(async (tx) => {
      const newBooking = await tx.bookings.create({
        data: {
          ...data,
          total_price: Number(calculatedTotalPrice.toFixed(2)),
          session_link: `https://meet.google.com/dqb-rxmh-xgw`,
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

// const getTutorBookings = async (tutor_id: string) => {
//   return await prisma.bookings.findMany({
//     where: { tutor_id },
//     include: { student: true, tutor_schedule: true },
//     orderBy: { createdAt: 'desc' }
//   });
// };

export const bookingService = {
  createBooking,
//   getTutorBookings
};
