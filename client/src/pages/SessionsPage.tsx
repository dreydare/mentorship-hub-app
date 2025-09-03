import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { useSession } from '../contexts/SessionContext';
import { useAuth } from '../contexts/AuthContext';
import { useMentor } from '../contexts/MentorContext';
import type { SessionRequest } from '../types/session';

export const SessionsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedMentorId, setSelectedMentorId] = useState('');
  const [selectedDuration, setSelectedDuration] = useState(30);
  const [sessionTopic, setSessionTopic] = useState('');
  const [bookingError, setBookingError] = useState('');

  const { user } = useAuth();
  const { sessions, isLoading, fetchUserSessions, createSession } = useSession();
  const { mentors, fetchMentors } = useMentor();

  useEffect(() => {
    if (user?.id) {
      fetchUserSessions(user.id);
    }
  }, [user]);

  useEffect(() => {
    // Fetch mentors for booking modal
    fetchMentors();
  }, []);

  const upcomingSessions = sessions.filter(s => s.status === 'pending' || s.status === 'confirmed');
  const pastSessions = sessions.filter(s => s.status === 'completed');

  const getStatusBadge = (status: typeof sessions[0]['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="default">Pending</Badge>;
      case 'confirmed':
        return <Badge variant="primary">Confirmed</Badge>;
      case 'completed':
        return <Badge variant="secondary">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="danger">Cancelled</Badge>;
    }
  };

  const handleBookSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError('');

    if (!selectedMentorId || !selectedDate || !selectedTime || !sessionTopic) {
      setBookingError('Please fill in all required fields');
      return;
    }

    try {
      const scheduledAt = new Date(`${selectedDate}T${selectedTime}`).toISOString();
      const request: SessionRequest = {
        mentorId: selectedMentorId,
        title: sessionTopic,
        description: sessionTopic,
        scheduledAt,
        duration: selectedDuration,
      };

      await createSession(request);
      setShowBookingModal(false);
      // Reset form
      setSelectedMentorId('');
      setSelectedDate('');
      setSelectedTime('');
      setSessionTopic('');
      setSelectedDuration(30);
    } catch (error) {
      setBookingError('Failed to book session. Please try again.');
    }
  };

  return (
    <Layout user={user ? { 
      name: user.name || user.email.split('@')[0], 
      email: user.email, 
      role: user.role.toUpperCase() as 'ADMIN' | 'MENTOR' | 'MENTEE',
      avatar: user.profilePicture
    } : undefined}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Sessions</h1>
            <Button onClick={() => setShowBookingModal(true)}>
              Book New Session
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-4 py-2 rounded-md transition-all ${
                activeTab === 'upcoming'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Upcoming ({upcomingSessions.length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-4 py-2 rounded-md transition-all ${
                activeTab === 'past'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Past ({pastSessions.length})
            </button>
          </div>

          {/* Sessions Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                        <div className="ml-4">
                          <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-20"></div>
                        </div>
                      </div>
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {(activeTab === 'upcoming' ? upcomingSessions : pastSessions).map((session) => {
                const mentor = mentors.find(m => m.id === session.mentorId);
                return (
                  <Card key={session.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <Avatar
                            src={mentor?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor?.name || 'Mentor')}&background=d946ef&color=fff`}
                            alt={mentor?.name || 'Mentor'}
                            size="md"
                          />
                          <div className="ml-4">
                            <h3 className="font-semibold text-gray-900">{mentor?.name || 'Mentor'}</h3>
                            <p className="text-sm text-gray-600">Mentor</p>
                          </div>
                        </div>
                        {getStatusBadge(session.status)}
                      </div>

                      <h4 className="font-semibold text-gray-900 mb-2">{session.title}</h4>

                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(session.scheduledAt).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {new Date(session.scheduledAt).toLocaleTimeString('en-US', { 
                            hour: 'numeric', 
                            minute: '2-digit',
                            hour12: true 
                          })} ({session.duration} minutes)
                        </div>
                      </div>

                      {(session.status === 'pending' || session.status === 'confirmed') && session.meetingLink && (
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1">
                            Join Meeting
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            Reschedule
                          </Button>
                        </div>
                      )}

                      {session.status === 'completed' && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            View Notes
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            Book Again
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && ((activeTab === 'upcoming' && upcomingSessions.length === 0) ||
            (activeTab === 'past' && pastSessions.length === 0)) && (
            <Card className="text-center py-12">
              <CardContent>
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No {activeTab === 'upcoming' ? 'upcoming' : 'past'} sessions
                </h3>
                <p className="text-gray-600 mb-4">
                  {activeTab === 'upcoming' 
                    ? "You don't have any upcoming sessions scheduled."
                    : "You haven't completed any sessions yet."}
                </p>
                {activeTab === 'upcoming' && (
                  <Button onClick={() => setShowBookingModal(true)}>
                    Book Your First Session
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Booking Modal */}
        {showBookingModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 modal-backdrop">
            <Card className="w-full max-w-md animate-scaleIn">
              <CardHeader>
                <CardTitle>Book a New Session</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBookSession} className="space-y-4">
                  {bookingError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                      {bookingError}
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Mentor
                    </label>
                    <select 
                      value={selectedMentorId}
                      onChange={(e) => setSelectedMentorId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    >
                      <option value="">Choose a mentor...</option>
                      {mentors.map((mentor) => (
                        <option key={mentor.id} value={mentor.id}>
                          {mentor.name} - ${mentor.hourlyRate}/hr
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Date
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Available Time Slots
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'].map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelectedTime(time)}
                          className={`px-3 py-2 rounded-lg border transition-all ${
                            selectedTime === time
                              ? 'border-primary-500 bg-primary-50 text-primary-700'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Session Duration
                    </label>
                    <select 
                      value={selectedDuration}
                      onChange={(e) => setSelectedDuration(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    >
                      <option value={30}>30 minutes</option>
                      <option value={45}>45 minutes</option>
                      <option value={60}>60 minutes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Topic / Agenda
                    </label>
                    <textarea
                      value={sessionTopic}
                      onChange={(e) => setSessionTopic(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      rows={3}
                      placeholder="What would you like to discuss?"
                      required
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button type="submit" className="flex-1">
                      Book Session
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowBookingModal(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};