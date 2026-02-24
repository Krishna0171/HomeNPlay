import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import homeNPlayLogo from '../assets/HomeNPlay.png';

interface NavbarProps {
  cartCount: number;
  onShopClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onShopClick
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [_, setShowUserMenu] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Support', path: '/contact' },
  ];

  const handleLinkClick = (path: string) => {
    if (path === '/shop') {
      if (onShopClick) {
        onShopClick();
      } else {
        navigate('/');
      }
    } else {
      navigate(path);
    }
  };

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className="flex items-center cursor-pointer flex-shrink-0"
            onClick={() => {
              navigate('/');
              setShowUserMenu(false);
            }}
          >
            <div className="flex items-center bg-white rounded-xl px-2 py-1 hover:shadow-md transition-shadow">
              <img
                src={homeNPlayLogo}
                alt="HomeNPlay"
                className="h-20 w-auto object-contain"
              />
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8 ml-10">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleLinkClick(link.path)}
                className={`text-sm font-semibold transition-all hover:text-indigo-600 relative py-1 ${isActive(link.path) || (link.path === '/shop' && location.pathname === '/')
                  ? 'text-indigo-600'
                  : 'text-slate-600'
                  }`}
              >
                <span className="flex items-center">
                  {link.name}
                </span>
                {(isActive(link.path)) && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full animate-in fade-in slide-in-from-bottom-1" />
                )}
              </button>
            ))}
          </div>

          <div className="flex-1"></div>

          {/* Action Icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={() => navigate('/cart')}
              className={`relative p-2 rounded-full transition-colors ${location.pathname === '/cart' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                }`}
            >
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 h-5 w-5 bg-indigo-600 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white font-bold animate-in zoom-in">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
