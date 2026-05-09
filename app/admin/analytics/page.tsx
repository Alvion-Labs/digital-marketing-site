import { checkAdminAuth } from '@/lib/admin';
import LeadModel from '@/lib/models/Lead';
import { connectToDatabase } from '@/lib/mongodb';

async function getLeadStatusCounts() {
  try {
    await connectToDatabase();
    const agg = await LeadModel.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const counts: Record<string, number> = {
      new: 0,
      in_discussion: 0,
      converted: 0,
      bounced: 0,
    };

    let total = 0;
    agg.forEach((row: any) => {
      const key = row._id || 'new';
      const c = row.count || 0;
      total += c;
      if (Object.prototype.hasOwnProperty.call(counts, key)) counts[key] = c;
      else counts[key] = (counts[key] || 0) + c;
    });

    return { counts, total };
  } catch (error) {
    console.error('Failed to aggregate lead statuses:', error);
    return { counts: { new: 0, in_discussion: 0, converted: 0, bounced: 0 }, total: 0 };
  }
}

export default async function Analytics() {
  await checkAdminAuth();
  const { counts, total } = await getLeadStatusCounts();

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics</h2>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Lead Pipeline</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-gray-600 text-sm font-medium">Total Leads</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{total}</p>
          </div>

          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-blue-700 text-sm font-medium">New</p>
            <p className="text-2xl font-bold text-blue-900 mt-2">{counts.new}</p>
          </div>

          <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100">
            <p className="text-yellow-700 text-sm font-medium">In Discussion</p>
            <p className="text-2xl font-bold text-yellow-900 mt-2">{counts.in_discussion}</p>
          </div>

          <div className="p-4 bg-green-50 rounded-xl border border-green-100">
            <p className="text-green-700 text-sm font-medium">Converted</p>
            <p className="text-2xl font-bold text-green-900 mt-2">{counts.converted}</p>
          </div>

          <div className="p-4 bg-red-50 rounded-xl border border-red-100">
            <p className="text-red-700 text-sm font-medium">Bounced</p>
            <p className="text-2xl font-bold text-red-900 mt-2">{counts.bounced}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Traffic Source</h3>
          <div className="space-y-4">
            {[
              { name: 'Organic Search', value: 45, color: 'bg-blue-500' },
              { name: 'Direct', value: 30, color: 'bg-purple-500' },
              { name: 'Social Media', value: 15, color: 'bg-pink-500' },
              { name: 'Referral', value: 10, color: 'bg-green-500' },
            ].map((source) => (
              <div key={source.name}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">{source.name}</span>
                  <span className="text-sm font-bold text-gray-900">{source.value}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className={`${source.color} h-2 rounded-full`} style={{ width: `${source.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Top Pages</h3>
          <div className="space-y-3">
            {[
              { path: '/', views: 1200 },
              { path: '/blog', views: 542 },
              { path: '/#services', views: 380 },
              { path: '/#contact', views: 320 },
            ].map((page) => (
              <div key={page.path} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700 font-medium">{page.path}</span>
                <span className="text-sm font-bold text-gray-900">{page.views}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
