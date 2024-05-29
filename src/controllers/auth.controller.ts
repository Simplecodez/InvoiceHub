import { Request, Response, NextFunction, response } from "express";
import { IEmail } from "../interfaces/email-interface";
import { IUser, IUserService } from "../interfaces/user.interface";
import { catchAsync } from "../utils/catch.async.utils";
import { userSignUpValidationSchema } from "../validators/user.validator";
import Utils from "../utils/user.utils";
import { MongoServerError } from "mongodb";
import { IBusiness, IBusinessService } from "../interfaces/business.interface";

class UserRegistrationService {
  private userService: IUserService;
  private businessService: IBusinessService;
  private email: IEmail;

  constructor(
    _userService: IUserService,
    _businessService: IBusinessService,
    _email: IEmail
  ) {
    this.userService = _userService;
    this.businessService = _businessService;
    this.email = _email;
  }

  private extractRegistrationData(req: Request) {
    const {
      first_name,
      last_name,
      email,
      business_name,
      password,
      password_confirm,
    } = req.body;
    const fieldToValidate: Partial<IUser | IBusiness> = {
      first_name,
      business_name,
      last_name,
      email,
      password,
      password_confirm,
    };
    return fieldToValidate;
  }

  private async sendEmail(
    userData: Partial<IUser>,
    otp: string,
    next: NextFunction
  ) {
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
    return catchAsync(
      async (req: Request, res: Response, next: NextFunction) => {
        const extractedUserData = this.extractRegistrationData(req);
        await userSignUpValidationSchema.validateAsync(extractedUserData);
        const { activationURL, activationTokenExpire, activationToken } =
          Utils.generateActivationTokenAndURL(req);
        const newUser: Partial<IUser> = {
          ...extractedUserData,
          activation_secret: activationToken,
          activation_token_expire: activationTokenExpire,
        };
        const createdUser = await this.userService.createOne(newUser);
        await this.businessService.createOne({
          business_name: newUser.business_name,
          user: createdUser._id,
        });
        await this.sendEmail(newUser, activationURL, next);

        res.status(200).json({
          status: "success",
          message:
            "Signup was successful, please check your email for your activation link.",
        });
      }
    );
  }
}

export default UserRegistrationService;
