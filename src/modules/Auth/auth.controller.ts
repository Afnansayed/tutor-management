import { NextFunction, Request, Response } from 'express';
import { authService } from './auth.service';
import { Role } from '../../../generated/prisma/enums';

const getAllUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role } = req.query;
    const result = await authService.getAllUser(role as Role);
    res.status(200).json({
      message: 'Users retrieved successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updateUserStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const result = await authService.updateUserStatus(userId as string, status);

    res.status(200).json({
      success: true,
      message: `User status updated to ${status} successfully`,
      data: result,
    });
  } catch (error: any) {
    console.log(error);
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
      return res.status(400).json({ message: 'User ID is required' });
    }
    const result = await authService.getMyProfile(userId);
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'My profile retrieved successfully',
      data: result,
    });
  } catch (error: any) {
    console.log(error);
    next(error);
  }
};

const updateMyProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    const payload = req.body;
    const result = await authService.updateMyProfile(userId, payload);
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Profile updated successfully',
      data: result,
    });
  } catch (error: any) {
    console.log(error);
    next(error);
  }
};

export const authController = {
  getAllUser,
  updateUserStatus,
  updateMyProfile,
  getMyProfile,
};
