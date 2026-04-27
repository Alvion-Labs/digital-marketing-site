import { model, models, Schema, type InferSchemaType, type Model } from 'mongoose';

const leadSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 160,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 5000,
    },
    source: {
      type: String,
      default: 'website',
      trim: true,
    },
    status: {
      type: String,
      default: 'new',
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: 'leads',
  }
);

export type Lead = InferSchemaType<typeof leadSchema>;

const LeadModel = (models.Lead as Model<Lead>) || model<Lead>('Lead', leadSchema);

export default LeadModel;
