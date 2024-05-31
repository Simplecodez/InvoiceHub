import { Request, Response, NextFunction } from 'express';
import { injectable } from 'tsyringe';
import { IUserService } from '../../interfaces/user.interface';
import { IBusinessService } from '../../interfaces/business.interface';
import { catchAsync } from '../../utils/catch.async.utils';

@injectable()
class UserSigninController {
  private userService: IUserService;
  private businessService: IBusinessService;
  constructor(_userService: IUserService, _businessService: IBusinessService) {
    this.userService = _userService;
    this.businessService = _businessService;
  }

  signin() {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {});
  }
}
