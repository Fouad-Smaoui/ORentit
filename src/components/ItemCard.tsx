import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';
import { calculateDistance, getUserLocation, formatDistance } from '../lib/location';

interface Item {
  id: string;
  name: string;
  description: string;
  category: string;
  price_per_day: number;
  location: string;
  location_id: string;
  image_url: string;
  owner_id: string;
  profiles: {
    username: string;
    avatar_url: string | null;
  };
  locations: {
    latitude: number;
    longitude: number;
  };
}

interface ItemCardProps {
  item: Item;
  style?: React.CSSProperties;
  className?: string;
  compact?: boolean;
}

export function ItemCard({ item, style, className = '', compact = false }: ItemCardProps) {
  const [distance, setDistance] = useState<number | null>(null);

  useEffect(() => {
    async function getDistance() {
      if (item.locations?.latitude && item.locations?.longitude) {
        try {
          const position = await getUserLocation();
          const dist = calculateDistance(
            position.coords.latitude,
            position.coords.longitude,
            item.locations.latitude,
            item.locations.longitude
          );
          setDistance(dist);
        } catch (error) {
          console.error('Error getting location:', error);
        }
      }
    }
    getDistance();
  }, [item.locations?.latitude, item.locations?.longitude]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    const fallbackUrl = `https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop`;
    if (target.src !== fallbackUrl) {
      target.src = fallbackUrl;
    }
  };

  return (
    <motion.div
      className={`group bg-white rounded-lg shadow-soft hover:shadow-elevated transition-shadow duration-300 h-full flex flex-col ${className}`}
      style={style}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
    >
      <Link to={`/items/${item.id}`} className="flex flex-col flex-1">
        <div className={`flex-shrink-0 overflow-hidden ${compact ? 'relative h-24 sm:h-28' : 'relative h-48'}`}>
          <img
            src={item.image_url || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop'}
            alt={item.name}
            onError={handleImageError}
            className="w-full h-full object-cover rounded-t-lg transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </div>
        <div className={`flex flex-col flex-1 ${compact ? 'p-3' : 'p-4'}`}>
          <div className="flex items-center justify-between mb-1">
            <h3 className={`font-semibold text-gray-900 group-hover:text-primary transition-colors truncate ${compact ? 'text-sm' : 'text-lg'}`}>
              {item.name}
            </h3>
            <span className={`font-bold text-primary flex-shrink-0 ml-2 ${compact ? 'text-sm' : 'text-lg'}`}>
              ${item.price_per_day}/day
            </span>
          </div>
          {!compact && <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>}
          <div className="flex items-center justify-between mt-auto pt-2">
            <div className="flex items-center text-gray-500 text-sm truncate">
              <MapPin size={14} className="mr-1 flex-shrink-0" />
              <span className="truncate">{item.location}</span>
              {distance !== null && !compact && (
                <span className="ml-1 text-gray-400">• {formatDistance(distance)} away</span>
              )}
            </div>
            {!compact && (
              <Button variant="secondary" size="sm">
                View Details
              </Button>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default ItemCard; 