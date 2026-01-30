import express, { Application } from 'express';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth';
import cors from 'cors';
import errorHandler from './middleware/globalErrorHandler';
import { tutorProfileRouter } from './modules/Tutor/tutor.router';
import { categoryRouter } from './modules/category/category.router';
import { tutorScheduleRouter } from './modules/tutorSchedule/tutorSchedule.router';

const app: Application = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.APP_URL || 'http://localhost:3000',
    credentials: true,
  })
);

app.get('/', (req, res) => {
  res.send('Welcome to the Prisma tutor management App!');
});

app.all('/api/auth/*splat', toNodeHandler(auth));

//category
app.use('/api/v1', categoryRouter);
//tutor profile
app.use('/api/v1', tutorProfileRouter);
// tutor schedule
app.use('/api/v1', tutorScheduleRouter);

// error handler
app.use(errorHandler);

export default app;
