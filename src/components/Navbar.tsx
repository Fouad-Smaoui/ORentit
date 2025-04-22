import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogIn, LogOut, User, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center flex-1">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-primary-500 text-2xl font-bold">ORentit</span>
            </Link>
            
            {/* Search Bar */}
            <div className="ml-8 flex-1 max-w-lg hidden sm:block">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for anything to rent..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
              </form>
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
            <Link
              to="/search"
              className="text-gray-700 hover:text-primary-500 px-3 py-2 rounded-md text-sm font-medium"
            >
              Browse
            </Link>
            <Link
              to="/list-item"
              className="bg-[#a100ff] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-opacity-90 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              List Your Item
            </Link>
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-primary-500 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2"
                >
                  <User size={18} />
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="bg-primary-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-600 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSigningOut ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <LogOut size={18} />
                  )}
                  {isSigningOut ? 'Signing Out...' : 'Sign Out'}
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="bg-primary-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-600 flex items-center gap-2"
              >
                <LogIn size={18} />
                Sign In
              </Link>
            )}
          </div>

          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden">
          {/* Mobile Search Bar */}
          <div className="px-4 pt-2 pb-3">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for anything to rent..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </form>
          </div>
          
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/search"
              className="text-gray-700 hover:text-primary-500 block px-3 py-2 rounded-md text-base font-medium"
            >
              Browse
            </Link>
            <Link
              to="/list-item"
              className="bg-[#a100ff] text-white block px-3 py-2 rounded-lg text-base font-medium hover:bg-opacity-90 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              List Your Item
            </Link>
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-primary-500 block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2"
                >
                  <User size={18} />
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="w-full text-left bg-primary-500 text-white px-3 py-2 rounded-md text-base font-medium hover:bg-primary-600 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSigningOut ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <LogOut size={18} />
                  )}
                  {isSigningOut ? 'Signing Out...' : 'Sign Out'}
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="w-full text-left bg-primary-500 text-white px-3 py-2 rounded-md text-base font-medium hover:bg-primary-600 flex items-center gap-2"
              >
                <LogIn size={18} />
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;