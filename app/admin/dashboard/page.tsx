import { checkAdminAuth } from '@/lib/admin';
import { getAllBlogPosts } from '@/lib/blog';
import LeadModel from '@/lib/models/Lead';
import { connectToDatabase } from '@/lib/mongodb';

async function getStats() {
  try {
    await connectToDatabase();
    const leadsCount = await LeadModel.countDocuments();
    const blogs = await getAllBlogPosts();
    const blogCount = blogs.length;
    
    return { leadsCount, blogCount };
  } catch (error) {
    return { leadsCount: 0, blogCount: 0 };
  }
}

export default async function AdminDashboard() {
  await checkAdminAuth();
  const { leadsCount, blogCount } = await getStats();

  const statCards = [
    { label: 'Total Leads', value: leadsCount, color: 'from-blue-500 to-blue-600', icon: '👥' },
    { label: 'Blog Posts', value: blogCount, color: 'from-purple-500 to-purple-600', icon: '📝' },
    { label: 'Active Users', value: 0, color: 'from-green-500 to-green-600', icon: '✅' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-600 text-sm font-medium">{card.label}</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{card.value}</p>
              </div>
              <div className={`text-3xl bg-linear-to-br ${card.color} text-white w-12 h-12 rounded-xl flex items-center justify-center`}>
                {card.icon}
              </div>
            </div>
            <div className={`h-1 rounded-full bg-linear-to-r ${card.color}`} />
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <a href="/admin/leads" className="text-accent-to hover:underline">
                → View all leads
              </a>
            </li>
            <li>
              <a href="/admin/analytics" className="text-accent-to hover:underline">
                → View analytics
              </a>
            </li>
            <li>
              <a href="/admin/blogs" className="text-accent-to hover:underline">
                → Manage blogs
              </a>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Database</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">API</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
