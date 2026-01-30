import { Response } from 'express';
import { prisma } from '../../lib/prisma';

interface CreateTutor {
  user_id: string;
  bio: string;
  profile_picture?: string | null;
  hourly_rate: number;
  categoryIds: string[];
}

const createTutorProfile = async (data: CreateTutor, res: Response) => {
  const { categoryIds, ...profileData } = data;

  if (!categoryIds || !Array.isArray(categoryIds) || categoryIds.length === 0) {
    return res.status(400).json({
      message:
        'At least one category must be provided as an array categoryIds[]',
    });
  }

  const result = await prisma.tutorProfile.create({
    data: {
      ...profileData,
      categories: {
        create: categoryIds.map(id => ({
          category: {
            connect: { id: id },
          },
        })),
      },
    },
    include: {
      categories: true,
    },
  });
  return result;
};

const getTutorProfiles = async () => {
  const result = await prisma.tutorProfile.findMany({
    include: {
      categories: {
        select: {
          category: {
            select: {
              name: true,
              sub_code: true,
            },
          },
        },
      },
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });
  return result;
};
const getMyProfile = async (user_id: string) => {
  const result = await prisma.tutorProfile.findUnique({
    where: {
      user_id: user_id,
    },
    include: {
      categories: {
        select: {
          category: {
            select: {
              name: true,
              sub_code: true,
            },
          },
        },
      },
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });
  return result
    ? {
        ...result,
        categories: result.categories.map(cat => cat.category),
      }
    : null;
};
const getProfileById = async (profile_id: string) => {
  const result = await prisma.tutorProfile.findUnique({
    where: {
      id: profile_id,
    },
    include: {
      categories: {
        select: {
          category: {
            select: {
              name: true,
              sub_code: true,
            },
          },
        },
      },
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });
  return result
    ? {
        ...result,
        categories: result.categories.map(cat => cat.category),
      }
    : null;
};

export const tutorService = {
  createTutorProfile,
  getTutorProfiles,
  getMyProfile,
  getProfileById,
};
