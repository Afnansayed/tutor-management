import express, { Application } from 'express';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth';
import cors from 'cors';
import errorHandler from './middleware/globalErrorHandler';
import { tutorProfileRouter } from './modules/Tutor/tutor.router';
import { categoryRouter } from './modules/category/category.router';
import { tutorScheduleRouter } from './modules/tutorSchedule/tutorSchedule.router';
import { bookingRouter } from './modules/booking/booking.router';
import { reviewRouter } from './modules/review/review.router';
import { notFound } from './middleware/notFound';
import { authRouter } from './modules/Auth/auth.router';
import cookieParser from 'cookie-parser';
import { analyticsRouter } from './modules/analytics/analytics.route';

const app: Application = express();

const allowedOrigins = [
  process.env.APP_URL || "http://localhost:3000",
  process.env.PROD_APP_URL, // Production frontend URL
  "http://localhost:3000",
  "http://localhost:4000",
  "http://localhost:5000",
].filter(Boolean); // Remove undefined values

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      // Check if origin is in allowedOrigins or matches Vercel preview pattern
      const isAllowed =
        allowedOrigins.includes(origin) ||
        /^https:\/\/tutor-management-client-two.*\.vercel\.app$/.test(origin) ||
        /^https:\/\/.*\.vercel\.app$/.test(origin); // Any Vercel deployment

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
  }),
);

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Welcome to the Prisma tutor management App!');
});

app.all('/api/auth/*splat', toNodeHandler(auth));

// auth
app.use('/api/v1', authRouter);
//category
app.use('/api/v1', categoryRouter);
//tutor profile
app.use('/api/v1', tutorProfileRouter);
// tutor schedule
app.use('/api/v1', tutorScheduleRouter);
// tutor booking
app.use('/api/v1', bookingRouter);
// review booking
app.use('/api/v1', reviewRouter);
// analytics
app.use('/api/v1', analyticsRouter);

// error handler
app.use(errorHandler);

//not found route
app.use(notFound);

export default app;
