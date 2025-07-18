import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';

interface Session {
  id: string;
  mentorName: string;
  mentorAvatar: string;
  date: string;
  time: string;
  duration: number;
  topic: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  meetingLink?: string;
}

const mockSessions: Session[] = [
  {
    id: '1',
    mentorName: 'Sarah Chen',
    mentorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    date: '2024-01-15',
    time: '10:00 AM',
    duration: 60,
    topic: 'React Performance Optimization',
    status: 'upcoming',
    meetingLink: 'https://zoom.us/j/123456789'
  },
  {
    id: '2',
    mentorName: 'Michael Rodriguez',
    mentorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    date: '2024-01-12',
    time: '2:00 PM',
    duration: 30,
    topic: 'Career Growth Strategy',
    status: 'completed'
  },
  {
    id: '3',
    mentorName: 'Emily Johnson',
    mentorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    date: '2024-01-10',
    time: '3:30 PM',
    duration: 45,
    topic: 'System Design Interview Prep',
    status: 'completed'
  }
];

export const SessionsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const upcomingSessions = mockSessions.filter(s => s.status === 'upcoming');
  const pastSessions = mockSessions.filter(s => s.status === 'completed');

  const getStatusBadge = (status: Session['status']) => {
    switch (status) {
      case 'upcoming':
        return <Badge variant="primary">Upcoming</Badge>;
      case 'completed':
        return <Badge variant="secondary">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="danger">Cancelled</Badge>;
    }
  };

  return (
    <Layout>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {(activeTab === 'upcoming' ? upcomingSessions : pastSessions).map((session) => (
              <Card key={session.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <Avatar
                        src={session.mentorAvatar}
                        alt={session.mentorName}
                        size="md"
                      />
                      <div className="ml-4">
                        <h3 className="font-semibold text-gray-900">{session.mentorName}</h3>
                        <p className="text-sm text-gray-600">Mentor</p>
                      </div>
                    </div>
                    {getStatusBadge(session.status)}
                  </div>

                  <h4 className="font-semibold text-gray-900 mb-2">{session.topic}</h4>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(session.date).toLocaleDateString('en-US', { 
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
                      {session.time} ({session.duration} minutes)
                    </div>
                  </div>

                  {session.status === 'upcoming' && session.meetingLink && (
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
            ))}
          </div>

          {/* Empty State */}
          {((activeTab === 'upcoming' && upcomingSessions.length === 0) ||
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
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Mentor
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                      <option>Sarah Chen - React Expert</option>
                      <option>Michael Rodriguez - Career Coach</option>
                      <option>Emily Johnson - System Design</option>
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
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                      <option>30 minutes</option>
                      <option>45 minutes</option>
                      <option>60 minutes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Topic / Agenda
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      rows={3}
                      placeholder="What would you like to discuss?"
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