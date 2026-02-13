import { NextFunction, Request, Response } from 'express';
import { tutorScheduleService } from './tutorSchedule.service';
import { prisma } from '../../lib/prisma';

const createTutorSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tutorId = req.user?.id;
    if (!tutorId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.body.tutor_id = tutorId;
    const result = await tutorScheduleService.createTutorSchedule(req.body);
    res.status(201).json({
      message: 'Tutor schedule created successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getMySchedule = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tutorId = req.user?.id;
    if (!tutorId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const result = await tutorScheduleService.getMySchedule(tutorId);
    res.status(201).json({
      message: 'Tutor schedule retrieved successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const getScheduleByTutorUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tutorUserId = req?.params?.tutorUserId;
    if (!tutorUserId) {
      return res.status(401).json({ message: 'Tutor user id is required' });
    }
    const result = await tutorScheduleService.getMySchedule(
      tutorUserId as string
    );
    res.status(201).json({
      message: 'Tutor schedule retrieved successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getTutorScheduleById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const scheduleId = req.params.scheduleId;
    if (!scheduleId) {
      return res.status(400).json({ message: 'Schedule ID is required' });
    }
    const result = await tutorScheduleService.getTutorScheduleById(
      scheduleId as string
    );
    res.status(201).json({
      message: 'Tutor schedule retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateTutorSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const scheduleId = req.params.scheduleId;
    if (!scheduleId) {
      return res.status(400).json({ message: 'Schedule ID is required' });
    }
    const result = await tutorScheduleService.updateTutorSchedule(
      scheduleId as string,
      req.body
    );
    res.status(201).json({
      message: 'Tutor schedule updated successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const updateTutorScheduleAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const scheduleId = req.params.scheduleId;
    if (!scheduleId) {
      return res.status(400).json({ message: 'Schedule ID is required' });
    }
    const result = await tutorScheduleService.updateTutorScheduleAvailability(
      scheduleId as string,
      req.body.isAvailable
    );
    res.status(200).json({
      message: 'Tutor schedule availability updated successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const deleteTutorSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const scheduleId = req.params.scheduleId;
    if (!scheduleId) {
      return res.status(400).json({ message: 'Schedule ID is required' });
    }
    const result = await tutorScheduleService.deleteTutorSchedule(
      scheduleId as string
    );
    res.status(200).json({
      message: 'Tutor schedule deleted successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const tutorScheduleController = {
  createTutorSchedule,
  getMySchedule,
  getTutorScheduleById,
  updateTutorSchedule,
  deleteTutorSchedule,
  updateTutorScheduleAvailability,
  getScheduleByTutorUserId,
};
