import { NextFunction, Request, Response } from 'express';
import { categoryService } from './category.service';

const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //   const authorId = req.user?.id;
    //   if (!authorId) {
    //     return res.status(401).json({ message: 'Unauthorized' });
    //   }
    //   req.body.authorId = authorId;
    const result = await categoryService.createCategory(req.body);
    res.status(201).json({
      message: 'Category create successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await categoryService.getCategory();
    res.status(200).json({
      message: 'Category retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const category_id = req.body.id;
  try {
    const result = await categoryService.deleteCategory(category_id);
    res.status(200).json({
      message: 'Category deleted successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const categoryController = {
  createCategory,
  getCategory,
  deleteCategory,
};
