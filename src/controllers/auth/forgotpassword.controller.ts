import { NextFunction, Request, Response } from 'express';
import { IUser, IUserRequest, IUserService } from '../../interfaces/user.interface';
import { catchAsync } from '../../utils/catch.async.utils';
import { AppError } from '../../utils/app.error.utils';
import validator from 'validator';
import { IEmail } from '../../interfaces/email-interface';
import Utils from '../../utils/user.utils';
import { inject, injectable } from 'tsyringe';

@injectable()
class ForgotPasswordController {
  private static PASSWORD_RESET_EXPIRATION_TIME = 15 * 60 * 1000;

  constructor(
    @inject('UserService') private readonly userService: IUserService,
    @inject('Email') private readonly email: IEmail
  ) {}

  protected validateInput(email: string) {
    if (!email) throw new AppError('Please provide an email.', 400);
    if (!validator.isEmail(email)) throw new AppError('Invalid email', 400);
    return email;
  }

  private async fetchUser(email: string) {
    const user = await this.userService.findOne({ email }, false);
    if (!user) throw new AppError('If the email is associated with an account, you will receive a message with your reset token.', 200);
    return user;
  }

  private async updateFieldsForForgotPassword(user: IUser) {
    const { secret, otp } = Utils.generateActivationOTP();
    user.password_reset_token = secret;
    user.password_reset_expires_in = new Date(Date.now() + ForgotPasswordController.PASSWORD_RESET_EXPIRATION_TIME);
    await user.save();
    return otp;
  }

  private async sendEmail(user: IUser, otp: string) {
    try {
      await this.email.sendResetPassword(user, otp);
    } catch (error) {
      user.password_reset_token = undefined;
      user.password_reset_expires_in = undefined;
      await user.save();
      throw error;
    }
  }

  forgotPassword() {
    return catchAsync(async (req: IUserRequest | Request, res: Response, next: NextFunction) => {
      const email = this.validateInput(req.body.email);
      const user = await this.fetchUser(email);
      const otp = await this.updateFieldsForForgotPassword(user);
      await this.sendEmail(user, otp);
      console.log(otp);
      res.status(200).json({
        status: 'success',
        message: 'Please check your email your a reset token.'
      });
    });
  }
}

export default ForgotPasswordController;
