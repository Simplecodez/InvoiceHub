import { ObjectId } from 'mongodb';
import { Document } from 'mongodb';
import { Request } from 'express';

export interface IUser extends Document {
  _id: ObjectId;
  first_name: string;
  last_name: string;
  business_name: string;
  email?: string;
  is_active?: boolean;
  role?: string;
  password?: string;
  password_confirm: string;
  activation_secret?: string;
  activation_token_expire?: Date;
  password_changed_at?: Date;
  password_reset_token?: string;
  password_reset_expires_in?: Date;
}

export interface IUserRequest extends Request {
  user: IUser;
}

export interface IUserService {
  createOne(data: Partial<IUser>): Promise<IUser>;
  findOne(params: string | object, lean: boolean): Promise<IUser | null>;
  findAll(queryObj: object): Promise<IUser[]>;
  updateOne(): Promise<void>;
  deleteOne(email: string): Promise<void>;
  findOneAndUpdate(filter: object, update: object): Promise<IUser | null>;
}
