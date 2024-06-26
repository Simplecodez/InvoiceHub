import { NextFunction, Request, Response } from 'express';
import { IEmail } from '../../interfaces/email-interface';
import { IUser, IUserRequest, IUserService } from '../../interfaces/user.interface';
import { catchAsync } from '../../utils/catch.async.utils';
import { resetPasswordSchema } from '../../validators/user.validator';
import { AppError } from '../../utils/app.error.utils';
import Utils from '../../utils/user.utils';
import { inject, injectable } from 'tsyringe';

@injectable()
class PasswordResetController {
  private userService: IUserService;

  constructor(@inject('UserService') _userService: IUserService, @inject('Email') _email: IEmail) {
    this.userService = _userService;
  }

  private verifyToken(otp: string) {
    if (!otp) throw new AppError('Please check your email for a valid OTP.', 400);
    return Utils.verifyOTP(otp);
  }

  private async fetchUser(secret: string) {
    const user = await this.userService.findOne(
      {
        password_reset_token: secret,
        password_reset_expires_in: { $gt: Date.now() }
      },
      false
    );
    if (!user) throw new AppError('Invalid token or expired token, click resend.', 400);
    return user;
  }

  private async save(user: IUser, password: string) {
    user.password = password;
    user.password_reset_token = undefined;
    user.password_reset_expires_in = undefined;
    await user.save();
  }

  verifyResetToken() {
    return catchAsync(async (req: IUserRequest | Request, res: Response, next: NextFunction) => {
      const { otp } = req.body;
      const secret = this.verifyToken(otp);
      await this.fetchUser(secret);
      return res.status(200).json({
        status: 'success',
        message: 'Token verified!',
        token: otp
      });
    });
  }

  resetPassword() {
    return catchAsync(async (req: IUserRequest | Request, res: Response, next: NextFunction) => {
      const { otp, password, password_confirm } = req.body;
      await resetPasswordSchema.validateAsync({ password, password_confirm });
      const secret = this.verifyToken(otp as string);
      const user = await this.fetchUser(secret);
      this.save(user, password);
      res.status(200).json({
        status: 'success',
        message: 'Password reset was successful, sign in now.'
      });
    });
  }
}

export default VerifyTokenAndResetPassword;
