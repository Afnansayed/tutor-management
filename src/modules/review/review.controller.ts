import { NextFunction, Request, Response } from 'express';
import { reviewService } from './review.service';

const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await reviewService.createReview(req.body);
    res.status(201).json({
      message: 'Review created successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const reviewController = {
  createReview,
};
