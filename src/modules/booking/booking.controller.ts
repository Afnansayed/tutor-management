import { NextFunction, Request, Response } from "express";
import { bookingService } from "./booking.service";



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

export const bookingController = { 
    createBooking
};