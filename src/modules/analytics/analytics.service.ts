import { BookingStatus } from '../../../generated/prisma/enums';
import { prisma } from '../../lib/prisma';
import { UserRole } from '../../middleware/auth';

export const getAdminAnalyticsSummary = async () => {
    //  total students
    const totalStudents = await prisma.user.count({
        where: { role: UserRole.STUDENT },
    });

    // total tutors
    const totalTutors = await prisma.user.count({
        where: { role: UserRole.TUTOR },
    });

    // total bookings
    const totalBookings = await prisma.bookings.count();

    // total revenue (only calculate for completed booking)
    const completedBookings = await prisma.bookings.aggregate({
        where: { status: BookingStatus.COMPLETED },
        _sum: { total_price: true },
    });
    const totalRevenue = completedBookings._sum.total_price || 0;

    // recent bookings
    const recentBookings = await prisma.bookings.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
            student: {
                select: { id: true, name: true, email: true },
            },
            tutor: {
                select: {
                    id: true,
                    user_id: true,
                    user: {
                        select: { name: true, email: true }
                    }
                }
            },
        },
    });

    // booking status grouping
    const bookingStatusGroups = await prisma.bookings.groupBy({
        by: ['status'],
        _count: { status: true },
    });

    const bookingStatus = bookingStatusGroups.reduce((acc: Record<string, number>, curr: any) => {
        acc[curr.status] = curr._count.status;
        return acc;
    }, {} as Record<string, number>);

    return {
        totalStudents,
        totalTutors,
        totalBookings,
        totalRevenue,
        recentBookings,
        bookingStatus,
    };
};

export const AnalyticsService = {
    getAdminAnalyticsSummary,
};
