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
const getCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { category_id } = req.params;
    if (!category_id) {
      throw new Error('Category ID is required');
    }

    const result = await categoryService.getCategoryById(category_id as string);
    res.status(200).json({
      message: 'Category retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { category_id } = req.params;
  if (!category_id) {
    throw new Error('Category ID is required');
  }
  try {
    const result = await categoryService.updateCategory(
      category_id as string,
      req.body
    );
    res.status(200).json({
      message: 'Category updated successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const categoryController = {
  createCategory,
  getCategory,
  getCategoryById,
  updateCategory,
};
