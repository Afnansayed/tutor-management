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
const deleteCategory = async (category_id: string) => {
  const result = await prisma.categories.delete({
    where: {
      id: category_id,
    },
  });
  return result;
};

export const categoryService = {
  createCategory,
  getCategory,
  deleteCategory,
};
