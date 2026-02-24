import express from 'express';
import auth, { UserRole } from '../../middleware/auth';
import { AnalyticsController } from './analytics.controller';

const router = express.Router();

router.get(
    '/analytics',
    auth(UserRole.ADMIN),
    AnalyticsController.getAnalytics
);

export const analyticsRouter = router;
