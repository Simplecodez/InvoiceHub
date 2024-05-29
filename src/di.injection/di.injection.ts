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
import UserRegistrationService from '../controllers/auth.controller';

container.register<Model<IUser>>('UserModel', { useValue: User });
container.register<Model<IBusiness>>('BusinessModel', { useValue: Business });
container.register<IUserService>('UserService', { useClass: UserService });
container.register<IBusinessService>('BusinessService', { useClass: BusinessService });
container.register<UserRegistrationService>('UserRegistrationService', UserRegistrationService);
container.register<IEmail>('IEmail', { useClass: Email });
