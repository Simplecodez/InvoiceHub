import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'tsyringe';
import { IEmail } from '../../interfaces/email-interface';
import { IUser, IUserRequest, IUserService } from '../../interfaces/user.interface';
import { catchAsync } from '../../utils/catch.async.utils';
import { userSignUpValidationSchema } from '../../validators/user.validator';
import Utils from '../../utils/user.utils';
import { MongoServerError } from 'mongodb';
import { IBusiness, IBusinessService } from '../../interfaces/business.interface';
import { AppError } from '../../utils/app.error.utils';

@injectable()
class UserRegistrationController {
  constructor(
    @inject('UserService') private readonly userService: IUserService,
    @inject('BusinessService') private readonly businessService: IBusinessService,
    @inject('Email') private readonly email: IEmail
  ) {}

  private extractRegistrationData(req: Request) {
    const { first_name, last_name, email, business_name, password, password_confirm } = req.body;
    const fieldToValidate: Partial<IUser | IBusiness> = { first_name, business_name, last_name, email, password, password_confirm };
    return fieldToValidate;
  }

  private async sendEmail(userData: Partial<IUser>, otp: string) {
    try {
      await this.email.sendWelcome(userData, otp);
    } catch (error) {
      if (!(error instanceof MongoServerError)) {
        await this.userService.deleteOne(userData.email as string);
      }
      throw error;
    }
  }

  register() {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      const extractedUserData = this.extractRegistrationData(req);
      await userSignUpValidationSchema.validateAsync(extractedUserData);
      const { activationURL, activationTokenExpire, activationToken } = Utils.generateActivationTokenAndURL(req);
      const newUser: Partial<IUser> = { ...extractedUserData, activation_secret: activationToken, activation_token_expire: activationTokenExpire };

      const createdUser = await this.userService.createOne(newUser);
      await this.businessService.createOne({ business_name: newUser.business_name, user: createdUser._id });
      await this.sendEmail(newUser, activationURL);

      res.status(200).json({
        status: 'success',
        message: 'Signup was successful, please check your email for your activation link.'
      });
    });
  }

  resendActivationToken() {
    return catchAsync(async (req: Request | IUserRequest, res: Response, next: NextFunction) => {
      const userId = (req as IUserRequest).user._id;
      const user = await this.userService.findOne({ _id: userId }, false);
      if (!user) return next(new AppError('No user found!', 404));
      if (user.is_active) return next(new AppError('Account is active', 409));
      const { activationURL, activationTokenExpire, activationToken } = Utils.generateActivationTokenAndURL(req);
      user.activation_token_expire = activationTokenExpire;
      user.activation_secret = activationToken;
      await user.save();
      await this.sendEmail(user, activationURL);
      res.status(200).json({
        status: 'success',
        message: 'Activation token has been resent.'
      });
    });
  }
}

export default UserRegistrationController;
