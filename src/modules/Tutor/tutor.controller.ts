import { NextFunction, Request, Response } from "express";
import { tutorService } from "./tutor.service";

const createTutorProfile = async (req: Request, res: Response , next: NextFunction) => {
    try {
    //   const authorId = req.user?.id;
    //   if (!authorId) {
    //     return res.status(401).json({ message: 'Unauthorized' });
    //   }
    //   req.body.authorId = authorId;
      const result = await tutorService.createTutorProfile(req.body);
      res.status(201).json({
        message: 'Tutor profile create successfully',
        data: result,
      });
    } catch (error) {
        next(error);
    }
  };
const getAllTutorProfiles = async (req: Request, res: Response , next: NextFunction) => {
    try {
    //   const authorId = req.user?.id;
    //   if (!authorId) {
    //     return res.status(401).json({ message: 'Unauthorized' });
    //   }
    //   req.body.authorId = authorId;
      const result = await tutorService.getTutorProfiles();
      res.status(201).json({
        message: 'Tutor profiles retrieved successfully',
        data: result,
      });
    } catch (error) {
        next(error);
    }
  };


  export const tutorController ={
    createTutorProfile,
    getAllTutorProfiles
  }
