import express, { Application } from 'express';
import authRouter from './routers/auth.router';
import errorHandler from './controllers/error.controller';

const app: Application = express();
app.use(express.json({ limit: '10kb' }));
app.use('/api/v1/auth', authRouter);
app.use('*', errorHandler);

export { app };
