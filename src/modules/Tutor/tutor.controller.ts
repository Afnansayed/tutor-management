import { NextFunction, Request, Response } from 'express';
import { tutorService } from './tutor.service';
import paginationSortingHelpers from '../../helpers/paginationSortingHelper';

const createTutorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    console.log({ userId });
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.body.user_id = userId;
    const result = await tutorService.createTutorProfile(req.body, res);
    res.status(201).json({
      message: 'Tutor profile create successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getAllTutorProfiles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const search = req.query.search as string | undefined;
  const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelpers(
    req.query
  );

  try {
    const result = await tutorService.getTutorProfiles({
      search,
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
    });
    res.status(201).json({
      message: 'Tutor profiles retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getMyProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const result = await tutorService.getMyProfile(userId);
    res.status(201).json({
      message: 'My profile retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getProfileById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const profileId = req.params.profileId;
    if (!profileId) {
      return res.status(400).json({ message: 'Profile ID is required' });
    }
    const result = await tutorService.getProfileById(profileId as string);
    res.status(201).json({
      message: 'Profile retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const updateTutorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const profileId = req.params.profileId;
    if (!profileId) {
      return res.status(400).json({ message: 'Profile ID is required' });
    }
    const result = await tutorService.updateTutorProfile(
      profileId as string,
      req.body
    );
    res.status(201).json({
      message: 'Profile updated successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const tutorController = {
  createTutorProfile,
  getAllTutorProfiles,
  getMyProfile,
  getProfileById,
  updateTutorProfile,
};
