import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Calendar } from 'lucide-react';
import { uploadImage, createItem, supabase } from '../lib/supabase';

interface FormData {
  name: string;
  description: string;
  price_per_day: number;
  category: string;
  location: string;
  startDate: string;
  endDate: string;
}

const ListItem: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    price_per_day: 0,
    category: '',
    location: '',
    startDate: '',
    endDate: ''
  });

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (!session || error) {
        console.error('Authentication error:', error);
        setError('You must be logged in to list items');
        navigate('/login');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }
      setError('');
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.name || !formData.price_per_day || !formData.category || !formData.startDate || !formData.endDate || !formData.location) {
        setError('Please fill in all required fields');
        return;
      }

      if (!imageFile) {
        setError('Please select an image');
        return;
      }

      // Upload image first
      const imageUrl = await uploadImage(imageFile);
      console.log('Image uploaded successfully:', imageUrl);

      // Create item with the image URL
      const result = await createItem({
        name: formData.name.trim(),
        description: formData.description.trim(),
        price_per_day: parseFloat(formData.price_per_day.toString()),
        category: formData.category,
        location: formData.location.trim(),
        image_url: imageUrl,
        status: 'available',
        start_date: formData.startDate,
        end_date: formData.endDate,
      });

      console.log('Item created successfully:', result);
      navigate('/');
    } catch (error) {
      console.error('Error in form submission:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  // Get today's date in YYYY-MM-DD format for min date attribute
  const today = new Date().toISOString().split('T')[0];

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">List New Item</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Item Image
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-lg"
              />
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Location
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter the item's location"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Price per day ($)
            </label>
            <input
              type="number"
              value={formData.price_per_day}
              onChange={(e) => setFormData({ ...formData, price_per_day: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a category</option>
              <option value="electronics">Electronics</option>
              <option value="tools">Tools</option>
              <option value="sports">Sports Equipment</option>
              <option value="clothing">Clothing</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Available From
            </label>
            <div className="relative">
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                min={today}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
            <p className="mt-1 text-sm text-gray-500">{formatDate(formData.startDate)}</p>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Available Until
            </label>
            <div className="relative">
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                min={formData.startDate}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
            <p className="mt-1 text-sm text-gray-500">{formatDate(formData.endDate)}</p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'List Item'}
        </button>
      </form>
    </div>
  );
};

export default ListItem;