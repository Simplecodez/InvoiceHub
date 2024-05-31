import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'tsyringe';
import { IUserService } from '../../interfaces/user.interface';
import { catchAsync } from '../../utils/catch.async.utils';
import Utils from '../../utils/user.utils';
import { AppError } from '../../utils/app.error.utils';

@injectable()
class UserActivationController {
  private userService: IUserService;
  constructor(@inject('UserService') _userService: IUserService) {
    this.userService = _userService;
  }

  activate() {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      const { activation_token } = req.params;
      const activationToken = Utils.verifyToken(activation_token);
      const user = await this.userService.findOne(
        {
          activation_secret: activationToken,
          activation_token_expire: { $gt: Date.now() }
        },
        false
      );
      if (!user) return next(new AppError('Invalid or expired token. Please regenerate activation token.', 400));
      user.activation_secret = undefined;
      user.activation_token_expire = undefined;
      user.is_active = true;
      await user.save({ validateBeforeSave: false });

      res.status(200).json({
        status: 'success',
        message: 'Account activation successful.'
      });
    });
  }
}

export default UserActivationController;
