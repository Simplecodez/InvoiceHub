import { ObjectId } from 'mongodb';

export interface IBusiness {
  business_name: string;
  business_address: string;
  business_description: string;
  user: ObjectId;
  is_active: boolean;
  type: string;
  created_at: Date;
}

export interface IBusinessService {
  createOne(data: Partial<IBusiness>): Promise<IBusiness>;
  findOne(params: string | object, lean: boolean): Promise<IBusiness | null>;
  updateOne(): Promise<void>;
  deleteOne(email: string): Promise<void>;
  findOneAndUpdate(filter: object, update: object): Promise<IBusiness | null>;
}
