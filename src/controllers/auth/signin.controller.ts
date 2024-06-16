import validator from 'validator';
import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'tsyringe';
import { IUser, IUserService } from '../../interfaces/user.interface';
import { IBusinessService } from '../../interfaces/business.interface';
import { catchAsync } from '../../utils/catch.async.utils';
import { AppError } from '../../utils/app.error.utils';
import Utils from '../../utils/user.utils';

@injectable()
class UserSigninController {
  private userService: IUserService;
  private businessService: IBusinessService;
  constructor(@inject('UserService') _userService: IUserService, @inject('BusinessService') _businessService: IBusinessService) {
    this.userService = _userService;
    this.businessService = _businessService;
  }

  private removeSensitiveData(userData: IUser) {
    delete userData._doc.password;
    delete userData._doc.is_active;
    delete userData._doc.email;
    return userData;
  }

  signin() {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      const { email, password } = req.body;
      if (!email || !password) return next(new AppError('Please provide an email and a password.', 400));
      if (!validator.isEmail(email)) return next(new AppError('Incorrect email or password.', 400));
      const user = await this.userService.findOne({ email }, false);
      if (!user || !(await Utils.verifyPassword(password, user.password as string))) return next(new AppError('Incorrect email or password.', 401));
      const businesses = await this.businessService.findAll({ user: user._id });

      const token = Utils.createSetJWTToken(user._id.toString(), res);
      res.setHeader('access-token', token);

      const notice = !user.is_active ? 'Please activate your account.' : null;
      const nonSensitiveUserData = this.removeSensitiveData(user);

      res.status(200).json({
        status: 'success',
        data: { you: nonSensitiveUserData, businesses },
        notice
      });
    });
  }
}

export default UserSigninController;
