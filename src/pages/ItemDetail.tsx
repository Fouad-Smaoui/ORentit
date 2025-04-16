import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface Item {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
}

const ItemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch item details from your backend
    const fetchItem = async () => {
      try {
        // Simulated API call
        setLoading(true);
        // Replace this with actual API call
        const mockItem: Item = {
          id: id || '',
          title: 'Sample Item',
          description: 'This is a sample item description.',
          price: 99.99,
          imageUrl: 'https://via.placeholder.com/400'
        };
        setItem(mockItem);
      } catch (error) {
        console.error('Error fetching item:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Item not found</h2>
          <p className="text-gray-600">The item you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{item.title}</h1>
        {item.imageUrl && (
          <div className="mb-6">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
        )}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-700 mb-4">{item.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">${item.price.toFixed(2)}</span>
            <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Contact Owner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail; 