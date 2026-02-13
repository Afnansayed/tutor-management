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

const app: Application = express();

app.set('trust proxy', 1);

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ['http://localhost:3000', process.env.APP_URL!],
    credentials: true,
  })
);

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

// error handler
app.use(errorHandler);

//not found route
app.use(notFound);

export default app;
