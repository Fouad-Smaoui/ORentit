import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { Button } from './ui/button';

interface Item {
  id: string;
  name: string;
  description: string;
  category: string;
  price_per_day: number;
  location: string;
  location_id: string | null;
  latitude: number | null;
  longitude: number | null;
  image_url: string;
  owner_id: string;
  profiles: {
    username: string;
    avatar_url: string | null;
  };
}

interface ItemCardProps {
  item: Item;
}

export function ItemCard({ item }: ItemCardProps) {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    const fallbackUrl = `https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop`;
    if (target.src !== fallbackUrl) {
      target.src = fallbackUrl;
    }
  };

  return (
    <div className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <Link to={`/items/${item.id}`} className="block">
        <div className="relative aspect-w-16 aspect-h-9">
          <img
            src={item.image_url || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop'}
            alt={item.name}
            onError={handleImageError}
            className="w-full h-full object-cover rounded-t-lg"
          />
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
              {item.name}
            </h3>
            <span className="text-lg font-bold text-primary">${item.price_per_day}/day</span>
          </div>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-500 text-sm">
              <MapPin size={16} className="mr-1" />
              <span>{item.location}</span>
            </div>
            <Button variant="secondary" size="sm">
              View Details
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default ItemCard; 