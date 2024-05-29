import { IUser } from './user.interface';

export interface IEmail {
  sendWelcome(userData: Partial<IUser>, url: string): Promise<void>;
  sendResetPassword(userData: IUser, otp: string): Promise<void>;
}
