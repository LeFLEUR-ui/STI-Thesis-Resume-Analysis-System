import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, LogOut, User, Settings, Building2 } from 'lucide-react';

const Header = () => {
  const brandPink = "#D10043";
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsAdminOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/signin');
  };

  const navItems = [
    {
      label: 'Dashboard',
      sublabel: 'Analytics & Overview',
      path: '/hrdashboard',
      icon: <Building2 size={16} />
    },
    {
      label: 'Screening',
      sublabel: 'Review Applications',
      path: '/screening',
      badge: 89,
      icon: <User size={16} />
    },
    {
      label: 'Jobs',
      sublabel: 'Manage Positions',
      path: '/jobmanagement',
      icon: <Settings size={16} />
    }
  ];

  return (
    <header className="bg-white border-b border-gray-100 px-4 md:px-10 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Section */}
        <div 
          className="flex items-center space-x-3 cursor-pointer shrink-0" 
          onClick={() => navigate('/hrdashboard')}
        >
          <img src="/src/assets/logo.png" alt="Logo" className="h-8 w-8 object-contain" />
          <div className="hidden md:block">
            <h1 className="text-sm font-bold leading-tight text-gray-900">HR Portal</h1>
            <p className="text-[10px] text-gray-400">Resume Analysis System</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-2">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                style={isActive ? { backgroundColor: brandPink } : {}}
                className={`px-5 py-2 rounded-xl transition-all flex flex-col items-center justify-center min-w-[130px] hover:shadow-sm ${
                  isActive ? 'text-white' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {item.icon}
                  <span className="text-xs font-bold">{item.label}</span>
                </div>
                <span className={`text-[9px] ${isActive ? 'opacity-80' : 'text-gray-400'}`}>
                  {item.sublabel}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Right Section: Admin Dropdown & Mobile Toggle */}
        <div className="flex items-center space-x-3 relative" ref={dropdownRef}>
          
          {/* Admin Dropdown Trigger */}
          <div 
            onClick={() => setIsAdminOpen(!isAdminOpen)}
            className={`hidden sm:flex items-center space-x-2 border px-3 py-1.5 rounded-xl transition-all cursor-pointer group ${
                isAdminOpen ? 'border-pink-200 bg-pink-50' : 'border-gray-200 hover:shadow-sm'
            }`}
          >
            <div className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
                isAdminOpen ? 'bg-white' : 'bg-gray-100 group-hover:bg-pink-50'
            }`}>
              <User className={`h-4 w-4 ${isAdminOpen ? 'text-[#D10043]' : 'text-gray-400 group-hover:text-[#D10043]'}`} />
            </div>
            <span className="text-xs font-bold text-gray-700">HR Admin</span>
            <ChevronDown size={14} className={`text-gray-400 transition-transform ${isAdminOpen ? 'rotate-180' : ''}`} />
          </div>

          {/* Actual Dropdown Menu */}
          {isAdminOpen && (
            <div className="absolute right-0 top-[110%] w-48 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-2 border-b border-gray-50 mb-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Account Management</p>
              </div>
              <button className="w-full flex items-center space-x-3 px-4 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                <Settings size={14} />
                <span>Profile Settings</span>
              </button>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut size={14} />
                <span>Logout Session</span>
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-[100%] left-0 w-full bg-white border-b border-gray-100 py-4 px-4 space-y-2 shadow-xl">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={index}
                onClick={() => {
                  navigate(item.path);
                  setIsMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                  isActive ? 'bg-pink-50 text-[#D10043]' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-4">
                  {item.icon}
                  <div className="text-left">
                    <p className="text-sm font-bold">{item.label}</p>
                    <p className="text-[10px] opacity-70">{item.sublabel}</p>
                  </div>
                </div>
              </button>
            );
          })}
          
          {/* Mobile Logout */}
          <div className="border-t border-gray-50 pt-2 mt-2">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center space-x-4 p-4 text-red-500 font-bold"
            >
               <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                 <LogOut size={16} />
               </div>
               <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;