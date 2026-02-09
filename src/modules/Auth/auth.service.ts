import { Role, Status } from '../../../generated/prisma/enums';
import { prisma } from '../../lib/prisma';

const getAllUser = async (role?: Role) => {
  return await prisma.user.findMany({
    where: {
      ...(role ? { role: role } : {}),
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      status: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

const updateUserStatus = async (userId: string, status: Status) => {
  const existUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existUser) {
    throw new Error('User not found');
  }

  return await prisma.user.update({
    where: { id: userId },
    data: { status },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
    },
  });
};

export const authService = {
  getAllUser,
  updateUserStatus,
};
