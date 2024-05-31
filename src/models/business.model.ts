import { Schema, model } from 'mongoose';
import { IBusiness } from '../interfaces/business.interface';

const businessSchema = new Schema<IBusiness>({
  business_name: { type: String, unique: true },
  business_address: { type: String },
  business_description: { type: String },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  is_active: { type: Boolean, default: false },
  type: {
    type: String,
    enum: ['business', 'individual'],
    default: 'business'
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

const businessModel = model<IBusiness>('Business', businessSchema);
export default businessModel;
