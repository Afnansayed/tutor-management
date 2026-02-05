import { Response } from 'express';
import { prisma } from '../../lib/prisma';
import { TutorProfileWhereInput } from '../../../generated/prisma/models';

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

const getTutorProfiles = async ({
  search,
  page,
  limit,
  skip,
  sortBy,
  sortOrder,
}: {
  search: string | undefined;
  limit: number;
  page: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
}) => {
  const andConditions: TutorProfileWhereInput[] = [];

  if (search) {
    andConditions.push({
      OR: [
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        {
          categories: {
            some: {
              category: { name: { contains: search, mode: 'insensitive' } },
            },
          },
        },
      ],
    });
  }

  const result = await prisma.tutorProfile.findMany({
    where: {
      AND: andConditions,
    },
    take: limit,
    skip,
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
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const totalCount = await prisma.tutorProfile.count();
  return {
    meta: {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    },
    data: result.map(profile => ({
      ...profile,
      categories: profile.categories.map(cat => cat.category),
    })),
  };
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
              id: true,
              name: true,
              sub_code: true,
            },
          },
        },
      },
      user: {
        select: {
          id: true,
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

const updateTutorProfile = async (
  profileId: string,
  data: Partial<CreateTutor & { name?: string; email?: string }>
) => {
  const { categoryIds, name, email, user_id, ...rest } = data;
  const result = await prisma.tutorProfile.update({
    where: {
      id: profileId,
    },
    data: {
      ...rest,
      user: {
        update: {
          ...(name && { name }),
          ...(email && { email }),
        },
      },
      ...(categoryIds && {
        categories: {
          deleteMany: {},
          create: categoryIds.map(id => ({
            category: {
              connect: { id: id },
            },
          })),
        },
      }),
    },
    include: {
      categories: {
        include: {
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

export const tutorService = {
  createTutorProfile,
  getTutorProfiles,
  getMyProfile,
  getProfileById,
  updateTutorProfile,
};
