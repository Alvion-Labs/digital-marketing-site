import { model, models, Schema, type InferSchemaType, type Model } from 'mongoose';

const privacyPolicySchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: 'default' },
    contentHTML: { type: String, default: '' },
    contactEmail: { type: String, trim: true, default: '' },
    contactWebsite: { type: String, trim: true, default: '' },
    effectiveDate: { type: String, trim: true, default: '' },
    intro: { type: String, default: '' },
  },
  {
    timestamps: true,
    collection: 'privacy_policies',
  }
);

export type PrivacyPolicy = InferSchemaType<typeof privacyPolicySchema>;

const PrivacyPolicyModel =
  (models.PrivacyPolicy as Model<PrivacyPolicy>) || model<PrivacyPolicy>('PrivacyPolicy', privacyPolicySchema);

export default PrivacyPolicyModel;
