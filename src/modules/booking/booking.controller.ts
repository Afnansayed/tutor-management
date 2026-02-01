import { NextFunction, Request, Response } from 'express';
import { bookingService } from './booking.service';

const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.body.student_id = user_id;
    const result = await bookingService.createBooking(req.body);
    res.status(201).json({
      message: 'Booking created successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const getAllBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await bookingService.getAllBookings();
    res.status(200).json({
      message: 'Bookings retrieved successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const getTutorBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tutor_id = req.user?.id;
    if (!tutor_id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const result = await bookingService.getTutorBookings(tutor_id);
    res.status(200).json({
      message: 'Tutor bookings retrieved successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const getStudentBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tutor_id = req.user?.id;
    if (!tutor_id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const result = await bookingService.getStudentBookings(tutor_id);
    res.status(200).json({
      message: 'Student bookings retrieved successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const updateBookingStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookingId = req.params.bookingId;
    if (!bookingId) {
      return res.status(400).json({ message: 'Booking ID is required' });
    }
    const { status } = req.body;

    const result = await bookingService.updateBookingStatus(
      bookingId as string,
      status
    );
    res.status(200).json({
      message: 'Booking status updated successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const bookingController = {
  createBooking,
  getAllBookings,
  getTutorBookings,
  getStudentBookings,
  updateBookingStatus,
};
