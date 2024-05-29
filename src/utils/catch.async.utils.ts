import { Request, Response, NextFunction } from 'express';
import { IUserRequest } from '../interfaces/user.interface';

export const catchAsync = (
  func: (req: Request | IUserRequest, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request | IUserRequest, res: Response, next: NextFunction) => {
    func(req, res, next).catch(next);
  };
};
