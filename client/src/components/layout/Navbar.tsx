import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface NavbarProps {
  user?: {
    name: string;
    email: string;
    role: 'ADMIN' | 'MENTOR' | 'MENTEE';
    avatar?: string;
  };
}

export const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  const roleColors = {
    ADMIN: 'danger',
    MENTOR: 'primary',
    MENTEE: 'secondary',
  } as const;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">Mentorship Hub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                {/* Role-specific navigation */}
                {user.role === 'ADMIN' && (
                  <>
                    <Link to="/admin/users" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                      Users
                    </Link>
                    <Link to="/admin/matches" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                      Matches
                    </Link>
                    <Link to="/admin/sessions" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                      Sessions
                    </Link>
                  </>
                )}
                {user.role === 'MENTOR' && (
                  <>
                    <Link to="/availability" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                      Availability
                    </Link>
                    <Link to="/requests" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                      Requests
                    </Link>
                    <Link to="/sessions" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                      Sessions
                    </Link>
                  </>
                )}
                {user.role === 'MENTEE' && (
                  <>
                    <Link to="/mentors" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                      Find Mentors
                    </Link>
                    <Link to="/my-requests" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                      My Requests
                    </Link>
                    <Link to="/my-sessions" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                      Sessions
                    </Link>
                  </>
                )}
                
                {/* User Menu */}
                <div className="flex items-center space-x-4">
                  <Badge variant={roleColors[user.role]}>{user.role}</Badge>
                  <div className="relative group">
                    <button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                      <Avatar
                        src={user.avatar}
                        alt={user.name}
                        size="sm"
                      />
                      <span className="text-sm font-medium text-gray-700">{user.name}</span>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="py-1">
                        <Link
                          to="/profile/edit"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Edit Profile
                        </Link>
                        <hr className="my-1" />
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 animate-slideUp">
          <div className="px-4 pt-2 pb-3 space-y-1">
            {user ? (
              <>
                <div className="flex items-center space-x-3 px-3 py-2">
                  <Avatar
                    src={user.avatar}
                    alt={user.name}
                    size="md"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <Badge variant={roleColors[user.role]} className="ml-auto">{user.role}</Badge>
                </div>
                <hr className="my-2" />
                
                {/* Mobile navigation links */}
                {user.role === 'ADMIN' && (
                  <>
                    <Link to="/admin/users" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                      Users
                    </Link>
                    <Link to="/admin/matches" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                      Matches
                    </Link>
                    <Link to="/admin/sessions" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                      Sessions
                    </Link>
                  </>
                )}
                {user.role === 'MENTOR' && (
                  <>
                    <Link to="/availability" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                      Availability
                    </Link>
                    <Link to="/requests" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                      Requests
                    </Link>
                    <Link to="/sessions" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                      Sessions
                    </Link>
                  </>
                )}
                {user.role === 'MENTEE' && (
                  <>
                    <Link to="/mentors" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                      Find Mentors
                    </Link>
                    <Link to="/my-requests" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                      My Requests
                    </Link>
                    <Link to="/my-sessions" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                      Sessions
                    </Link>
                  </>
                )}
                
                <hr className="my-2" />
                <Link to="/profile/edit" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                  Edit Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                  Sign In
                </Link>
                <Link to="/register" className="block px-3 py-2 text-base font-medium text-primary-600 hover:bg-primary-50 rounded-lg">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};