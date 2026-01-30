import { Categories } from '../../../generated/prisma/client';
import { prisma } from '../../lib/prisma';

const createCategory = async (
  data: Omit<Categories, 'id' | 'createdAt' | 'updatedAt'>
) => {
  const result = await prisma.categories.create({
    data,
  });
  return result;
};

const getCategory = async () => {
  const result = await prisma.categories.findMany();
  return result;
};

const getCategoryById = async (category_id: string) => {
  const result = await prisma.categories.findUnique({
    where: {
      id: category_id,
    },
  });
  return result;
};

const updateCategory = async (
  category_id: string,
  data: Partial<Categories>
) => {
  const result = await prisma.categories.update({
    where: {
      id: category_id,
    },
    data,
  });
  return result;
};

export const categoryService = {
  createCategory,
  getCategory,
  getCategoryById,
  updateCategory,
};
