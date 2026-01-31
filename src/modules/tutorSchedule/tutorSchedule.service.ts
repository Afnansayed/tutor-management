import { TutorSchedule } from '../../../generated/prisma/client';
import { prisma } from '../../lib/prisma';

const createTutorSchedule = (
  data: Omit<
    TutorSchedule,
    'id' | 'created_at' | 'updated_at' | 'isAvailable' | 'isActive'
  >
) => {
  const result = prisma.tutorSchedule.create({
    data: data,
  });

  return result;
};

const getMySchedule = async (user_id: string) => {
  const result = await prisma.tutorSchedule.findMany({
    where: {
      tutor_id: user_id,
    },
  });
  return result;
};

const getTutorScheduleById = async (scheduleId: string) => {
  return await prisma.tutorSchedule.findUnique({
    where: { id: scheduleId },
  });
};

const updateTutorSchedule = async (
  scheduleId: string,
  data: Partial<
    Omit<TutorSchedule, 'id' | 'tutor_id' | 'created_at' | 'updated_at'>
  >
) => {
  return await prisma.tutorSchedule.update({
    where: { id: scheduleId },
    data,
  });
};


const updateTutorScheduleAvailability = async (scheduleId: string, isAvailable: boolean) => {
  return await prisma.tutorSchedule.update({
    where: { id: scheduleId },
    data: { isAvailable },
  });
};

const deleteTutorSchedule = async (scheduleId: string) => {
  return await prisma.tutorSchedule.delete({
    where: { id: scheduleId },
  });
};

export const tutorScheduleService = {
  createTutorSchedule,
  getMySchedule,
  getTutorScheduleById,
  updateTutorSchedule,
  deleteTutorSchedule,
  updateTutorScheduleAvailability,
};
