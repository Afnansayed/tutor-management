import { TutorProfile } from '../../../generated/prisma/client';
import { prisma } from '../../lib/prisma';


interface CreateTutor {
  user_id: string;
  bio: string;
  profile_picture?: string | null;
  hourly_rate: number;
  categoryIds: string[];
}

const createTutorProfile = async (
  data: CreateTutor,
) => {
const { categoryIds, ...profileData } = data;

  const result = await prisma.tutorProfile.create({
    data: {
      ...profileData,
      categories: {
        create: categoryIds.map((id) => ({
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
      categories:{
        select: {
          category:{
            select: {
              name: true,
              sub_code: true
            }
          }
        }
      }
    },
  });
  return result;
};
// const getTutorProfilesById = async (user_id: string) => {
//   const result = await prisma.tutorProfile.findUnique({
//     where: {

//     },
//   });
//   return result;
// };

const deleteTutorProfiles = async (tutor_id: string) => {
  const result = await prisma.tutorProfile.delete({
    where: {
      id: tutor_id,
    },
  });
  return result;
};

export const tutorService = {
  createTutorProfile,
  getTutorProfiles
};
