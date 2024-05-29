import { IUserService } from '../../interfaces/user.interface';
import { Model } from 'mongoose';
import { IUser } from '../../interfaces/user.interface';
import { inject, injectable } from 'tsyringe';

@injectable()
class UserService implements IUserService {
  private userModel: Model<IUser>;
  constructor(@inject('UserModel') _userModel: Model<IUser>) {
    this.userModel = _userModel;
  }

  async createOne(data: Partial<IUser>): Promise<IUser> {
    return await this.userModel.create(data);
  }

  async findOne(params: string | object, lean: boolean): Promise<IUser | null> {
    if (typeof params === 'string') {
      if (lean) return await this.userModel.findById(params).lean();
      return await this.userModel.findById(params).select('+password_changed_at');
    }
    if (typeof params === 'object') {
      if (lean) return await this.userModel.findOne(params).lean();

      return await this.userModel.findOne(params).select('+password +is_email_active +is_active +activation_secret');
    }
    return null;
  }

  async updateOne(): Promise<void> {}

  async deleteOne(email: String): Promise<void> {
    await this.userModel.deleteOne({ email });
  }

  async findOneAndUpdate(filter: object, update: object) {
    return await this.userModel.findOneAndUpdate(filter, update, {
      new: true
    });
  }
}

export default UserService;
