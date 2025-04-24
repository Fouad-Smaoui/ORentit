import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { MapPin } from 'lucide-react';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

interface LocationSelectProps {
  onLocationSelect: (location: Location | null) => void;
  defaultValue?: string;
  className?: string;
}

export default function LocationSelect({ onLocationSelect, defaultValue = '', className = '' }: LocationSelectProps) {
  const [searchTerm, setSearchTerm] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Close dropdown when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    async function fetchLocations() {
      if (searchTerm.length >= 1) {
        setError(null);
        console.log('Fetching locations for:', searchTerm);
        
        try {
          const { data, error } = await supabase
            .from('locations')
            .select('*')
            .ilike('name', `${searchTerm}%`)
            .limit(5);

          if (error) {
            console.error('Error fetching locations:', error);
            setError('Failed to fetch locations');
            return;
          }

          console.log('Locations fetched:', data);
          setSuggestions(data || []);
          setIsOpen(true);
        } catch (err) {
          console.error('Error in fetchLocations:', err);
          setError('An error occurred while fetching locations');
        }
      } else {
        setSuggestions([]);
        setIsOpen(false);
      }
    }

    const timeoutId = setTimeout(fetchLocations, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleSelect = (location: Location) => {
    setSelectedLocation(location);
    setSearchTerm(location.name);
    setIsOpen(false);
    onLocationSelect(location);
  };

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (!e.target.value) {
              onLocationSelect(null);
              setSelectedLocation(null);
            }
          }}
          placeholder="Enter city name"
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && (
        <div className="absolute z-10 w-full mt-1 bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg">
          {error}
        </div>
      )}

      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
          {suggestions.map((location) => (
            <li
              key={location.id}
              onClick={() => handleSelect(location)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
            >
              <MapPin size={16} className="mr-2 text-gray-400" />
              {location.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 