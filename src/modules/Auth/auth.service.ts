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

const getMyProfile = async (user_id: string) => {
  const result = await prisma.user.findUnique({
    where: {
      id: user_id,
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
  });

  return result;
};

const updateMyProfile = async (
  user_id: string,
  payload: { name?: string; image?: string }
) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      id: user_id,
    },
  });

  if (!isUserExists) {
    throw new Error('User not found!');
  }

  const result = await prisma.user.update({
    where: {
      id: user_id,
    },
    data: payload,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      status: true,
      updatedAt: true,
    },
  });

  return result;
};

export const authService = {
  getAllUser,
  updateUserStatus,
  getMyProfile,
  updateMyProfile,
};
