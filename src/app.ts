import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import authRouter from './routers/auth.router';
import errorHandler from './controllers/error/error.controller';

const app: Application = express();

app.use(cookieParser());
app.use(express.json({ limit: '10kb' }));
app.use('/api/v1/auth', authRouter);
app.use('*', errorHandler);

export { app };
