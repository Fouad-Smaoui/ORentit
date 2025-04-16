import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface UserItem {
  id: string;
  title: string;
  price: number;
  status: 'active' | 'rented';
  imageUrl?: string;
}

const Dashboard: React.FC = () => {
  const [userItems, setUserItems] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch user's items from backend
    const fetchUserItems = async () => {
      try {
        setLoading(true);
        // Simulated data - replace with actual API call
        const mockItems: UserItem[] = [
          {
            id: '1',
            title: 'Sample Item 1',
            price: 99.99,
            status: 'active',
            imageUrl: 'https://via.placeholder.com/150'
          },
          {
            id: '2',
            title: 'Sample Item 2',
            price: 149.99,
            status: 'rented',
            imageUrl: 'https://via.placeholder.com/150'
          }
        ];
        setUserItems(mockItems);
      } catch (error) {
        console.error('Error fetching user items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserItems();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Dashboard</h1>
        <Link
          to="/list-item"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          List New Item
        </Link>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      ) : userItems.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">No Items Listed</h2>
          <p className="text-gray-500 mb-6">You haven't listed any items yet.</p>
          <Link
            to="/list-item"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            List Your First Item
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-4">${item.price.toFixed(2)}</p>
                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      item.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                  <Link
                    to={`/items/${item.id}`}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard; 