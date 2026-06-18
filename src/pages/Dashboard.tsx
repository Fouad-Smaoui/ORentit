import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  Package, 
  Calendar, 
  Settings, 
  Bell, 
  User,
  Search,
  Plus
} from 'lucide-react';
import { getUserItems, getOwnerBookingStats } from '../lib/supabase';

interface UserItem {
  id: string;
  name: string;
  price_per_day: number;
  status: 'available' | 'rented' | 'unavailable';
  image_url?: string;
}

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
}

const StatCard = ({ title, value, change, isPositive }: StatCardProps) => (
  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    <div className="mt-2 flex items-baseline">
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
      {change && (
        <span className={`ml-2 text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {change}
        </span>
      )}
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const [userItems, setUserItems] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [stats, setStats] = useState({ totalBookings: 0, pendingRequests: 0, revenue: 0 });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [items, bookingStats] = await Promise.all([
          getUserItems(),
          getOwnerBookingStats(),
        ]);
        setUserItems(items || []);
        setStats(bookingStats);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setUserItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 fixed w-full z-10">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <span className="sr-only">Open sidebar</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="ml-4 flex items-center">
                <h1 className="text-xl font-bold text-[#a100ff]">ORentit</h1>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <button className="relative p-1 rounded-full text-gray-400 hover:text-gray-500">
                  <span className="sr-only">View notifications</span>
                  <Bell className="h-6 w-6" />
                </button>
              </div>
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <button className="flex text-sm rounded-full focus:outline-none">
                    <User className="h-8 w-8 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-0 w-64 bg-white border-r border-gray-200 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out pt-16`}>
        <div className="h-full px-3 py-4 overflow-y-auto">
          <nav className="space-y-1">
            <a href="#" className="flex items-center px-2 py-2 text-sm font-medium text-[#a100ff] bg-purple-50 rounded-md">
              <Home className="mr-3 h-5 w-5" />
              Dashboard
            </a>
            <a href="#" className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:text-[#a100ff] hover:bg-purple-50 rounded-md">
              <Package className="mr-3 h-5 w-5" />
              My Listings
            </a>
            <a href="#" className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:text-[#a100ff] hover:bg-purple-50 rounded-md">
              <Calendar className="mr-3 h-5 w-5" />
              Bookings
            </a>
            <a href="#" className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:text-[#a100ff] hover:bg-purple-50 rounded-md">
              <Settings className="mr-3 h-5 w-5" />
              Settings
            </a>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className={`pt-16 ${isSidebarOpen ? 'pl-64' : 'pl-0'} transition-all duration-200 ease-in-out`}>
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Search Bar */}
          <div className="flex justify-between items-center mb-8">
            <div className="max-w-xl flex-1 mr-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#a100ff] focus:border-[#a100ff] sm:text-sm"
                  placeholder="Search listings, bookings, or users..."
                />
              </div>
            </div>
            <Link
              to="/list-item"
              className="inline-flex items-center px-4 py-2 bg-[#a100ff] text-white rounded-lg hover:bg-[#8a00d4] focus:outline-none focus:ring-2 focus:ring-[#a100ff]"
            >
              <Plus className="h-5 w-5 mr-2" />
              List New Item
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatCard
              title="Active Listings"
              value={userItems.filter(item => item.status === 'available').length}
              change=""
              isPositive={true}
            />
            <StatCard
              title="Total Bookings"
              value={stats.totalBookings}
              change=""
              isPositive={true}
            />
            <StatCard
              title="Revenue"
              value={`$${stats.revenue.toFixed(2)}`}
              change=""
              isPositive={true}
            />
            <StatCard
              title="Pending Requests"
              value={stats.pendingRequests}
              change=""
              isPositive={false}
            />
          </div>

          {/* Items Grid */}
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          ) : userItems.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">No Items Listed</h2>
              <p className="text-gray-500 mb-6">You haven't listed any items yet.</p>
              <Link
                to="/list-item"
                className="inline-flex items-center px-6 py-3 bg-[#a100ff] text-white rounded-lg hover:bg-[#8a00d4] focus:outline-none focus:ring-2 focus:ring-[#a100ff]"
              >
                <Plus className="h-5 w-5 mr-2" />
                List Your First Item
              </Link>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">My Listings</h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userItems.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-4">
                        <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                        <p className="text-gray-600 mb-4">${item.price_per_day.toFixed(2)}</p>
                        <div className="flex items-center justify-between">
                          <span
                            className={`px-3 py-1 rounded-full text-sm bg-green-100 text-green-800`}
                          >
                            Active
                          </span>
                          <Link
                            to={`/items/${item.id}`}
                            className="text-[#a100ff] hover:text-[#8a00d4]"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 