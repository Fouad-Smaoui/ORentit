import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogIn, LogOut, User, Car, Tent } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isSigningOut) return;
    
    try {
      setIsSigningOut(true);
      await signOut();
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Failed to sign out. Please try again.');
      setIsSigningOut(false);
    }
  };

  return (
    <nav className="bg-white shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-primary-500 text-2xl font-bold">ORentit</span>
            </Link>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link
              to="/items?category=vehicles"
              className="relative group flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 rounded-full border border-gray-200 hover:border-gray-300 transition-all duration-200 ease-out"
            >
              <Car className="h-5 w-5 text-gray-600 group-hover:text-[#a100ff] transition-colors duration-200" />
              <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap">
                Vehicles
              </span>
            </Link>
            <Link
              to="/items?category=leisure"
              className="relative group flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 rounded-full border border-gray-200 hover:border-gray-300 transition-all duration-200 ease-out"
            >
              <Tent className="h-5 w-5 text-gray-600 group-hover:text-[#a100ff] transition-colors duration-200" />
              <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap">
                Leisure
              </span>
            </Link>
            <div className="hidden sm:block">
              <Link
                to="/list-item"
                className="bg-[#a100ff] text-white px-8 py-3 rounded-full text-base font-medium hover:bg-opacity-90 transition-all duration-200 inline-flex items-center justify-center h-12"
              >
                List Your Item
              </Link>
            </div>
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 rounded-full border border-gray-200 hover:border-gray-300 transition-all duration-200"
                >
                  <User className="h-5 w-5 text-gray-600 hover:text-[#a100ff]" />
                </Link>
                <button
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 rounded-full border border-gray-200 hover:border-gray-300 transition-all duration-200"
                >
                  {isSigningOut ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                  ) : (
                    <LogOut className="h-5 w-5 text-gray-600 hover:text-[#a100ff]" />
                  )}
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="bg-[#a100ff] text-white px-8 py-3 rounded-full text-base font-medium hover:bg-opacity-90 transition-all duration-200 inline-flex items-center justify-center h-12"
              >
                Sign In
              </Link>
            )}

            {/* Mobile menu button - only for List Item */}
            <div className="sm:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-full text-gray-700 hover:text-[#a100ff] hover:bg-gray-100 focus:outline-none"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu - only for List Item */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3">
            <Link
              to="/list-item"
              className="bg-[#a100ff] text-white block px-4 py-3 rounded-lg text-base font-medium hover:bg-opacity-90"
            >
              List Your Item
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;