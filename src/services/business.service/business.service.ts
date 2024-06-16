import { Model } from 'mongoose';
import { IBusiness, IBusinessService } from '../../interfaces/business.interface';
import { inject, injectable } from 'tsyringe';

@injectable()
class BusinessService implements IBusinessService {
  private businessModel: Model<IBusiness>;
  constructor(@inject('BusinessModel') _businessModel: Model<IBusiness>) {
    this.businessModel = _businessModel;
  }

  async createOne(data: Partial<IBusiness>): Promise<IBusiness> {
    return await this.businessModel.create(data);
  }

  async findOne(params: string | object, lean: boolean): Promise<IBusiness | null> {
    if (typeof params === 'string') {
      if (lean) return await this.businessModel.findById(params).lean();
      return await this.businessModel.findById(params).select('+password_changed_at');
    }
    if (typeof params === 'object') {
      if (lean) return await this.businessModel.findOne(params).lean();

      return await this.businessModel.findOne(params).select('+password +is_email_active +is_active +activation_secret');
    }
    return null;
  }

  async findAll(queryObj: object) {
    return await this.businessModel.find(queryObj);
  }

  async updateOne(): Promise<void> {}

  async deleteOne(email: String): Promise<void> {
    await this.businessModel.deleteOne({ email });
  }

  async findOneAndUpdate(filter: object, update: object) {
    return await this.businessModel.findOneAndUpdate(filter, update, {
      new: true
    });
  }
}

export default BusinessService;
