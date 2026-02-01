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

const getAllReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await reviewService.getAllReviews();
    res.status(200).json({
      message: 'Reviews retrieved successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getTutorReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tutor_id = req.params.tutor_id;
    if (!tutor_id) {
      throw new Error('Tutor ID is required');
    }
    const result = await reviewService.getTutorReviews(tutor_id as string);
    res.status(200).json({
      message: 'Tutor reviews retrieved successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updateReviewStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const review_id = req.params.review_id;
    if (!review_id) {
      throw new Error('Review ID is required');
    }
    const result = await reviewService.updateReviewStatus(
      review_id as string,
      req.body.isApproved
    );
    res.status(200).json({
      message: 'Review status updated successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updateReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const review_id = req.params.review_id;
    const student_id = req.user?.id;
    if (!review_id) {
      throw new Error('Review ID is required');
    }
    if (!student_id) {
      throw new Error('Unauthorized');
    }
    const result = await reviewService.updateReview(
      review_id as string,
      student_id as string,
      req.body
    );
    res.status(200).json({
      message: 'Review updated successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deleteReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const review_id = req.params.review_id;
    if (!review_id) {
      throw new Error('Review ID is required');
    }
    const result = await reviewService.deleteReview(review_id as string);
    res.status(200).json({
      message: 'Review deleted successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const reviewController = {
  createReview,
  getAllReviews,
  getTutorReviews,
  updateReviewStatus,
  updateReview,
  deleteReview,
};
