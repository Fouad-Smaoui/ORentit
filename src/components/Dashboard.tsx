import { useState } from 'react';
import { 
  Home, 
  Package, 
  Calendar, 
  Settings, 
  Bell, 
  User,
  ChevronDown,
  Search
} from 'lucide-react';

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

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
          <div className="max-w-2xl mb-8">
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

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatCard
              title="Active Listings"
              value="12"
              change="+2"
              isPositive={true}
            />
            <StatCard
              title="Total Bookings"
              value="48"
              change="+12%"
              isPositive={true}
            />
            <StatCard
              title="Revenue"
              value="$2,450"
              change="+8%"
              isPositive={true}
            />
            <StatCard
              title="Pending Requests"
              value="3"
              change="-1"
              isPositive={false}
            />
          </div>

          {/* Recent Activity */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="flow-root">
                <ul className="-mb-8">
                  {[1, 2, 3].map((item) => (
                    <li key={item}>
                      <div className="relative pb-8">
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center ring-8 ring-white">
                              <Package className="h-5 w-5 text-[#a100ff]" />
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-500">
                                New booking request for <span className="font-medium text-gray-900">Camera Lens 24-70mm</span>
                              </p>
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                              <time dateTime="2024-03-20">20 minutes ago</time>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 