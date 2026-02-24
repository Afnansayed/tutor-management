import { NextFunction, Request, Response } from 'express';
import { AnalyticsService } from './analytics.service';

const getAnalytics = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await AnalyticsService.getAdminAnalyticsSummary();
        res.status(200).json({
            success: true,
            message: 'Admin analytics fetched successfully!',
            data: result,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const AnalyticsController = {
    getAnalytics,
};
