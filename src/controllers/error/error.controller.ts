import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../utils/app.error.utils';
import { JsonWebTokenError } from 'jsonwebtoken';

const handleJWTError = (): AppError => new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = (): AppError => new AppError('Your token has expired! Please log in again.', 401);

const handleValidationError = (err: any): AppError => {
  let message = err.message;
  const formattedError = new AppError(message, 400);
  return formattedError;
};

const handleDuplicateDB = (err: any): AppError => {
  let message;
  if (Object.keys(err.keyValue)[0] === 'email') {
    message = `Email already exists.`;
  } else if (Object.keys(err.keyValue)[0] === 'display_name') {
    message = `Display name already exist.`;
  }
  return new AppError(message as string, 400);
};

const handleInvalidInputDB = (err: any): AppError => {
  const message = 'Invalid parameter or query string. Please check and try again.';
  return new AppError(message, 400);
};

const handleSyntaxError = (): AppError => new AppError('Invalid JSON syntax. Please check your request body and try again.', 400);

const sendError = (err: AppError, req: Request, res: Response) => {
  // console.error('error', err);
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }
  // Log the error
  console.error('error', err);
  // Send generic message.
  return res.status(500).json({
    status: 'error',
    message: 'Sorry, an error occurred, but we are fixing it. Please try again later.'
  });
};

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  let error = err;
  if (error.name === 'JsonWebTokenError') error = handleJWTError();
  if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
  if (error.name === 'SyntaxError') error = handleSyntaxError();
  if (error.code === 11000) error = handleDuplicateDB(error);
  if (error.code === '22P02') error = handleInvalidInputDB(error);
  if (error.name === 'ValidationError' && error.isJoi) error = handleValidationError(error);
  sendError(error, req, res);
};

export default errorHandler;
