import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { useAuth } from '../contexts/AuthContext';
import { requestService } from '../services/requestService';
import type { MentorshipRequest } from '../types/request';

export const RequestsPage: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<MentorshipRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('sent');
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, [user]);

  const fetchRequests = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const data = await requestService.getMyRequests(user.role);
      setRequests(data);
    } catch (error) {
      setError('Failed to load requests');
      console.error('Error fetching requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestAction = async (requestId: string, action: 'accepted' | 'rejected') => {
    try {
      setProcessingId(requestId);
      await requestService.updateRequestStatus(requestId, { status: action });
      await fetchRequests(); // Refresh the list
    } catch (error) {
      setError('Failed to update request');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: MentorshipRequest['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="default">Pending</Badge>;
      case 'accepted':
        return <Badge variant="primary">Accepted</Badge>;
      case 'rejected':
        return <Badge variant="danger">Rejected</Badge>;
      default:
        return null;
    }
  };

  // Filter requests based on user role and tab
  const filteredRequests = requests.filter(() => {
    if (user?.role === 'mentee') {
      return activeTab === 'sent'; // Mentees only see sent requests
    } else if (user?.role === 'mentor') {
      return activeTab === 'received'; // Mentors only see received requests
    }
    return false;
  });

  const isMentee = user?.role === 'mentee';

  return (
    <Layout user={user ? {
      name: user.name || user.email.split('@')[0],
      email: user.email,
      role: user.role.toUpperCase() as 'ADMIN' | 'MENTOR' | 'MENTEE',
      avatar: user.profilePicture
    } : undefined}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Mentorship Requests</h1>
            <p className="text-gray-600 mt-2">
              {isMentee ? 'View your sent mentorship requests' : 'Manage incoming mentorship requests'}
            </p>
          </div>

          {/* Tabs - Only show if user is mentor */}
          {!isMentee && (
            <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
              <button
                onClick={() => setActiveTab('received')}
                className={`px-4 py-2 rounded-md transition-all ${
                  activeTab === 'received'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Received Requests
              </button>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                        <div className="ml-4">
                          <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-48"></div>
                        </div>
                      </div>
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredRequests.length === 0 ? (
            // Empty State
            <Card className="text-center py-12">
              <CardContent>
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No {activeTab === 'sent' ? 'sent' : 'received'} requests
                </h3>
                <p className="text-gray-600">
                  {isMentee 
                    ? "You haven't sent any mentorship requests yet."
                    : "You don't have any pending mentorship requests."}
                </p>
              </CardContent>
            </Card>
          ) : (
            // Requests List
            <div className="space-y-4">
              {filteredRequests.map((request) => {
                const otherUser = isMentee ? request.mentor : request.mentee;
                const isPending = request.status === 'pending';
                const isProcessing = processingId === request.id;

                return (
                  <Card key={request.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <Avatar
                            src={otherUser?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser?.name || 'User')}&background=d946ef&color=fff`}
                            alt={otherUser?.name || 'User'}
                            size="lg"
                          />
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {otherUser?.name || 'Unknown User'}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {isMentee ? 'Mentor' : 'Mentee'}
                            </p>
                            {request.message && (
                              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-700 italic">"{request.message}"</p>
                              </div>
                            )}
                            <p className="text-xs text-gray-500 mt-2">
                              Sent on {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          {getStatusBadge(request.status)}
                          {!isMentee && isPending && (
                            <div className="flex gap-2 mt-2">
                              <Button
                                size="sm"
                                variant="primary"
                                onClick={() => handleRequestAction(request.id, 'accepted')}
                                disabled={isProcessing}
                              >
                                {isProcessing ? 'Processing...' : 'Accept'}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRequestAction(request.id, 'rejected')}
                                disabled={isProcessing}
                              >
                                Decline
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};