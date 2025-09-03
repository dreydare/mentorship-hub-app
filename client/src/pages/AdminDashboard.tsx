import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { adminService } from '../services/adminService';
import type { AdminDashboardData } from '../services/adminService';
import type { User } from '../types/user';
import { useAuth } from '../contexts/AuthContext';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'sessions'>('overview');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<AdminDashboardData>({
    stats: {
      totalUsers: 0,
      totalMentors: 0,
      totalMentees: 0,
      totalSessions: 0,
      completedSessions: 0,
      revenue: 0,
      growthRate: 0
    },
    recentActivity: [],
    users: [],
    sessions: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to fetch admin dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = () => {
    // Since User type doesn't have status, we'll use a simple active status
    return <Badge variant="primary">Active</Badge>;
  };

  const getRoleBadge = (role: User['role']) => {
    switch (role) {
      case 'admin':
        return <Badge variant="default" className="border-purple-600 text-purple-600">Admin</Badge>;
      case 'mentor':
        return <Badge variant="primary" className="border-primary-600 text-primary-600">Mentor</Badge>;
      case 'mentee':
        return <Badge variant="secondary" className="border-secondary-600 text-secondary-600">Mentee</Badge>;
    }
  };

  const handleUserAction = (action: 'suspend' | 'activate' | 'delete', user: User) => {
    console.log(`${action} user:`, user);
    // Implement user management actions
    setShowUserModal(false);
  };

  return (
    <Layout user={user ? {
      name: user.name || user.email.split('@')[0],
      email: user.email,
      role: user.role.toUpperCase() as 'ADMIN' | 'MENTOR' | 'MENTEE',
      avatar: user.profilePicture
    } : undefined}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage users, sessions, and platform analytics</p>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-md transition-all ${
                activeTab === 'overview'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-md transition-all ${
                activeTab === 'users'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('sessions')}
              className={`px-4 py-2 rounded-md transition-all ${
                activeTab === 'sessions'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sessions
            </button>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Users</p>
                        <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.totalUsers.toLocaleString()}</p>
                        <p className="text-sm text-green-600 mt-1">
                          +{dashboardData.stats.growthRate}% from last month
                        </p>
                      </div>
                      <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Sessions</p>
                        <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.totalSessions.toLocaleString()}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {dashboardData.stats.completedSessions} completed
                        </p>
                      </div>
                      <div className="h-12 w-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Active Mentors</p>
                        <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.totalMentors}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {dashboardData.stats.totalUsers > 0 ? Math.round((dashboardData.stats.totalMentors / dashboardData.stats.totalUsers) * 100) : 0}% of users
                        </p>
                      </div>
                      <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Revenue</p>
                        <p className="text-2xl font-bold text-gray-900">${(dashboardData.stats.revenue / 1000).toFixed(1)}k</p>
                        <p className="text-sm text-green-600 mt-1">
                          +18.2% from last month
                        </p>
                      </div>
                      <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">New user registered</p>
                          <p className="text-sm text-gray-600">Emily Johnson joined as a mentee</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">2 hours ago</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Session completed</p>
                          <p className="text-sm text-gray-600">Sarah Chen completed a session with John Doe</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">4 hours ago</span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Payment received</p>
                          <p className="text-sm text-gray-600">$80 from Michael Rodriguez's session</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">6 hours ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>User Management</CardTitle>
                <Button size="sm">Add User</Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">User</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Role</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Joined</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center">
                            <div className="inline-flex items-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                              <span className="ml-2">Loading users...</span>
                            </div>
                          </td>
                        </tr>
                      ) : dashboardData.users.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-gray-500">
                            No users found
                          </td>
                        </tr>
                      ) : (
                        dashboardData.users.map((user) => (
                          <tr key={user.id} className="border-b hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <Avatar 
                                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=0ea5e9&color=fff`} 
                                  alt={user.name || 'User'} 
                                  size="sm" 
                                />
                                <span className="ml-3 font-medium text-gray-900">{user.name || 'Unknown User'}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-600">{user.email}</td>
                            <td className="py-3 px-4">{getRoleBadge(user.role)}</td>
                            <td className="py-3 px-4">{getStatusBadge()}</td>
                            <td className="py-3 px-4 text-gray-600">
                              {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              <button
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShowUserModal(true);
                                }}
                                className="text-primary-600 hover:text-primary-700 font-medium"
                              >
                                Manage
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sessions Tab */}
          {activeTab === 'sessions' && (
            <Card>
              <CardHeader>
                <CardTitle>Session Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Session Analytics</h3>
                  <p className="text-gray-600">
                    View and manage all platform sessions, including scheduled, completed, and cancelled sessions.
                  </p>
                  <Button className="mt-4">View All Sessions</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* User Management Modal */}
        {showUserModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 modal-backdrop">
            <Card className="w-full max-w-md animate-scaleIn">
              <CardHeader>
                <CardTitle>Manage User</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Avatar 
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.name || 'User')}&background=0ea5e9&color=fff`} 
                      alt={selectedUser.name || 'User'} 
                      size="lg" 
                    />
                    <div className="ml-4">
                      <h3 className="font-semibold text-gray-900">{selectedUser.name || 'Unknown User'}</h3>
                      <p className="text-sm text-gray-600">{selectedUser.email}</p>
                      <div className="flex gap-2 mt-1">
                        {getRoleBadge(selectedUser.role)}
                        {getStatusBadge()}
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600 mb-2">User Actions</p>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full text-orange-600 border-orange-600 hover:bg-orange-50"
                        onClick={() => handleUserAction('suspend', selectedUser)}
                      >
                        Suspend User
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full text-red-600 border-red-600 hover:bg-red-50"
                        onClick={() => handleUserAction('delete', selectedUser)}
                      >
                        Delete User
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowUserModal(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};