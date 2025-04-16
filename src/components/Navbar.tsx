import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
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
                  className="bg-primary-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-600 flex items-center gap-2"
                >
                  <LogOut size={18} />
                  Sign Out
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
                  className="w-full text-left bg-primary-500 text-white px-3 py-2 rounded-md text-base font-medium hover:bg-primary-600 flex items-center gap-2"
                >
                  <LogOut size={18} />
                  Sign Out
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