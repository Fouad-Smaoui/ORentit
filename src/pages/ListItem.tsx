import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, MapPin, Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { supabase } from '../lib/supabase';
import { uploadFile } from '@uploadcare/upload-client';

const ListItem = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'vehicles',
    pricePerDay: '',
    location: '',
    photos: [] as string[],
  });
  const [availabilityRange, setAvailabilityRange] = useState<[Date | null, Date | null]>([null, null]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const result = await uploadFile(file, {
          publicKey: 'demopublickey',
          store: 'auto',
          metadata: {
            subsystem: 'uploader',
            purpose: 'item-photo'
          }
        });
        return result.cdnUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...uploadedUrls]
      }));
    } catch (err) {
      setError('Failed to upload photos. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .single();

      if (!profile) throw new Error('Profile not found');

      // Insert item
      const { data: item, error: itemError } = await supabase
        .from('items')
        .insert({
          owner_id: profile.id,
          name: formData.name,
          description: formData.description,
          category: formData.category,
          price_per_day: parseFloat(formData.pricePerDay),
          location: formData.location,
          photos: formData.photos,
        })
        .select()
        .single();

      if (itemError) throw itemError;

      // Insert availability if dates are selected
      if (availabilityRange[0] && availabilityRange[1]) {
        const { error: availError } = await supabase
          .from('availability')
          .insert({
            item_id: item.id,
            start_date: availabilityRange[0].toISOString(),
            end_date: availabilityRange[1].toISOString(),
          });

        if (availError) throw availError;
      }

      navigate(`/items/${item.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">List Your Item</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6 text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Item Name
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="vehicles">Vehicles</option>
            <option value="leisure">Leisure</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Price per Day ($)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            required
            value={formData.pricePerDay}
            onChange={(e) => setFormData(prev => ({ ...prev, pricePerDay: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <div className="mt-1 relative">
            <MapPin className="absolute top-3 left-3 text-gray-400" size={18} />
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="Enter address"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Availability
          </label>
          <div className="mt-1 relative">
            <Calendar className="absolute top-3 left-3 text-gray-400" size={18} />
            <DatePicker
              selectsRange
              startDate={availabilityRange[0]}
              endDate={availabilityRange[1]}
              onChange={(update) => setAvailabilityRange(update)}
              className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholderText="Select availability dates"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Photos
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="photos"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                >
                  <span>Upload files</span>
                  <input
                    id="photos"
                    name="photos"
                    type="file"
                    multiple
                    accept="image/*"
                    className="sr-only"
                    onChange={handlePhotoUpload}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
            </div>
          </div>
          {formData.photos.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              {formData.photos.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Upload ${index + 1}`}
                  className="h-24 w-full object-cover rounded-md"
                />
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            'Create Listing'
          )}
        </button>
      </form>
    </div>
  );
};

export default ListItem;