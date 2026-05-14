import { connectToDatabase } from '@/lib/mongodb';
import PrivacyPolicyModel from '@/lib/models/PrivacyPolicy';

export type PrivacyPolicyData = {
  contentHTML: string;
  contactEmail?: string;
  contactWebsite?: string;
  effectiveDate?: string;
  intro?: string;
  updatedAt?: Date | string | null;
};

const defaultContent = `
  <p>This Privacy Policy explains how Alvion Digital Marketing collects, uses, and protects your information.</p>
  <h2>Information We Collect</h2>
  <p>We may collect personal information you provide through forms, email, or other direct contact methods.</p>
  <h2>How We Use Information</h2>
  <p>We use information to provide services, respond to inquiries, improve our website, and communicate updates.</p>
  <h2>Contact</h2>
  <p>If you have questions, contact us through the details provided on our website.</p>
`;

export async function getPrivacyPolicy(): Promise<PrivacyPolicyData> {
  try {
    await connectToDatabase();
    const policy = await PrivacyPolicyModel.findOne({ key: 'default' }).lean();

    return {
      contentHTML: policy?.contentHTML || defaultContent,
      contactEmail: policy?.contactEmail || '',
      contactWebsite: policy?.contactWebsite || '',
      effectiveDate: policy?.effectiveDate || '',
      intro: policy?.intro || '',
      updatedAt: policy?.updatedAt || null,
    };
  } catch (error) {
    return {
      contentHTML: defaultContent,
      contactEmail: '',
      contactWebsite: '',
      effectiveDate: '',
      intro: '',
      updatedAt: null,
    };
  }
}
