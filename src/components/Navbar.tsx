import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, Car, Tent } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  // Badi-style nav: fully transparent over the hero at scroll position 0,
  // solid brand purple once you scroll, solid white on every other page
  // (which never has a photo hero behind the nav to begin with).
  const navMode: 'transparent' | 'purple' | 'white' = isHome ? (isScrolled ? 'purple' : 'transparent') : 'white';
  const isDark = navMode !== 'white';

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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

  const navBgClass = {
    transparent: 'bg-transparent',
    purple: 'bg-[#a100ff] shadow-elevated',
    white: `bg-white/95 backdrop-blur-sm border-b border-gray-100 ${isScrolled ? 'shadow-soft' : ''}`,
  }[navMode];

  const iconButtonClass = isDark
    ? 'flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 rounded-full border border-white/30 hover:border-white/60 hover:scale-105 hover:bg-white/15 transition-all duration-200'
    : 'flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 rounded-full border border-gray-200 hover:border-primary-200 hover:scale-105 hover:bg-primary-50/40 transition-all duration-200';

  const iconClass = isDark
    ? 'h-5 w-5 text-white transition-colors duration-200'
    : 'h-5 w-5 text-gray-600 group-hover:text-[#a100ff] transition-colors duration-200';

  // CTA pills invert to white-on-purple-text once the nav itself goes solid
  // purple — otherwise a purple button on a purple bar would disappear.
  const ctaClass =
    navMode === 'purple'
      ? 'bg-white text-primary-500 px-8 py-3 rounded-full text-base font-medium shadow-soft hover:shadow-elevated hover:bg-gray-50 hover:-translate-y-0.5 active:scale-95 active:translate-y-0 transition-all duration-200 inline-flex items-center justify-center h-12'
      : 'bg-[#a100ff] text-white px-8 py-3 rounded-full text-base font-medium shadow-soft hover:shadow-elevated hover:bg-opacity-90 hover:-translate-y-0.5 active:scale-95 active:translate-y-0 transition-all duration-200 inline-flex items-center justify-center h-12';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center transition-transform hover:scale-[1.03]">
              <span className={`text-2xl font-bold transition-colors duration-300 ${isDark ? 'text-white drop-shadow-sm' : 'text-primary-500'}`}>
                ORentit
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link to="/items?category=vehicles" className={`relative group ${iconButtonClass}`}>
              <Car className={iconClass} />
              <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap">
                Vehicles
              </span>
            </Link>
            <Link to="/items?category=leisure" className={`relative group ${iconButtonClass}`}>
              <Tent className={iconClass} />
              <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap">
                Leisure
              </span>
            </Link>
            <div className="hidden sm:block">
              <Link to="/list-item" className={ctaClass}>
                List Your Item
              </Link>
            </div>
            {user ? (
              <>
                <Link to="/dashboard" className={iconButtonClass}>
                  <User className={iconClass} />
                </Link>
                <Link to="/profile" className={iconButtonClass}>
                  <User className={iconClass} />
                </Link>
                <button onClick={handleSignOut} disabled={isSigningOut} className={iconButtonClass}>
                  {isSigningOut ? (
                    <div className={`animate-spin rounded-full h-4 w-4 border-b-2 ${isDark ? 'border-white' : 'border-gray-600'}`}></div>
                  ) : (
                    <LogOut className={iconClass} />
                  )}
                </button>
              </>
            ) : (
              <Link to="/auth" className={ctaClass}>
                Sign In
              </Link>
            )}

            {/* Mobile menu button - only for List Item */}
            <div className="sm:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`inline-flex items-center justify-center p-2 rounded-full focus:outline-none transition-colors duration-200 ${
                  isDark ? 'text-white hover:bg-white/15' : 'text-gray-700 hover:text-[#a100ff] hover:bg-gray-100'
                }`}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu - only for List Item */}
      {isOpen && (
        <div className="sm:hidden bg-white/95 backdrop-blur-sm">
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
