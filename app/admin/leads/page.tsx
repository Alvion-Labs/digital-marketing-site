import { checkAdminAuth } from '@/lib/admin';
import LeadModel from '@/lib/models/Lead';
import { connectToDatabase } from '@/lib/mongodb';

async function getLeads() {
  try {
    await connectToDatabase();
    const leads = await LeadModel.find({}).sort({ createdAt: -1 }).limit(50).lean();
    return leads;
  } catch (error) {
    console.error('Failed to fetch leads:', error);
    return [];
  }
}

import LeadsTableClient from '@/components/admin/LeadsTableClient';

export default async function LeadsPage() {
  await checkAdminAuth();
  const leads = await getLeads();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Leads</h2>
        <span className="px-4 py-2 bg-accent-from/10 text-accent-from rounded-full text-sm font-semibold">
          Total: {leads.length}
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm p-6">
        {leads.length > 0 ? (
          <LeadsTableClient initial={leads as any} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No leads yet. When people submit the contact form, they'll appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
