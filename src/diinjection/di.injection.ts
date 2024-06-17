import { container } from 'tsyringe';
import { Model } from 'mongoose';
import User from '../models/user.model';
import Business from '../models/business.model';
import { IUser, IUserService } from '../interfaces/user.interface';
import { IBusiness, IBusinessService } from '../interfaces/business.interface';
import { IEmail } from '../interfaces/email-interface';
import Email from '../services/email.services/email.services';
import UserService from '../services/user.services/user.service';
import BusinessService from '../services/business.service/business.service';
import UserRegistrationController from '../controllers/auth/register.controller';
import UserActivationController from '../controllers/auth/activation.controller';
import UserSigninController from '../controllers/auth/signin.controller';
import ProtectUser from '../middlewares/auth/protect.middleware';
import ForgotPasswordController from '../controllers/auth/forgotpassword.controller';

// Models
container.register<Model<IUser>>('UserModel', { useValue: User });
container.register<Model<IBusiness>>('BusinessModel', { useValue: Business });
container.register<IUserService>('UserService', { useClass: UserService });
container.register<IBusinessService>('BusinessService', { useClass: BusinessService });
container.register<UserActivationController>('UserActivationController', UserActivationController);
container.register<UserRegistrationController>('UserRegistrationService', UserRegistrationController);
container.register<ForgotPasswordController>('ForgotPasswordController', { useClass: ForgotPasswordController });
container.register<UserSigninController>('UserSigninController', UserSigninController);
container.register<ProtectUser>('ProtectUser', ProtectUser);
container.register<IEmail>('Email', { useClass: Email });
