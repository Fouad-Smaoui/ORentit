import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogIn, LogOut, User } from 'lucide-react';
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
      // Force reload after a short delay to ensure state is cleared
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
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-primary-500 text-2xl font-bold">ORentit</span>
            </Link>
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
              className="text-gray-700 hover:text-primary-500 px-3 py-2 rounded-md text-sm font-medium"
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
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/search"
              className="text-gray-700 hover:text-primary-500 block px-3 py-2 rounded-md text-base font-medium"
            >
              Browse
            </Link>
            <Link
              to="/list-item"
              className="text-gray-700 hover:text-primary-500 block px-3 py-2 rounded-md text-base font-medium"
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