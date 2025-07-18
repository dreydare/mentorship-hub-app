import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';

const mockUser = {
  name: 'John Doe',
  email: 'john@example.com',
  role: 'MENTEE' as const,
  avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=0ea5e9&color=fff',
};

const stats = [
  { label: 'Active Sessions', value: '3', icon: '📅', color: 'bg-primary-100 text-primary-800' },
  { label: 'Total Sessions', value: '12', icon: '🎯', color: 'bg-green-100 text-green-800' },
  { label: 'Mentors', value: '5', icon: '👥', color: 'bg-secondary-100 text-secondary-800' },
  { label: 'Goals Achieved', value: '8', icon: '🏆', color: 'bg-yellow-100 text-yellow-800' },
];

const upcomingSessions = [
  {
    id: 1,
    mentor: 'Sarah Johnson',
    mentorAvatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=d946ef&color=fff',
    topic: 'Career Development',
    date: '2024-01-15',
    time: '3:00 PM',
    duration: '60 min',
  },
  {
    id: 2,
    mentor: 'Michael Chen',
    mentorAvatar: 'https://ui-avatars.com/api/?name=Michael+Chen&background=d946ef&color=fff',
    topic: 'Technical Interview Prep',
    date: '2024-01-17',
    time: '2:00 PM',
    duration: '45 min',
  },
];

const recommendedMentors = [
  {
    id: 1,
    name: 'Emily Rodriguez',
    avatar: 'https://ui-avatars.com/api/?name=Emily+Rodriguez&background=d946ef&color=fff',
    title: 'Senior Product Manager',
    skills: ['Product Strategy', 'Leadership', 'Agile'],
    rating: 4.9,
    sessions: 156,
  },
  {
    id: 2,
    name: 'David Kim',
    avatar: 'https://ui-avatars.com/api/?name=David+Kim&background=d946ef&color=fff',
    title: 'Tech Lead',
    skills: ['React', 'Node.js', 'System Design'],
    rating: 4.8,
    sessions: 203,
  },
];

export const MenteeDashboard: React.FC = () => {
  return (
    <Layout user={mockUser}>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="gradient-mesh">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center sm:text-left">
              <h1 className="text-4xl font-bold text-gray-900 animate-slideUp">
                Welcome back, {mockUser.name.split(' ')[0]}! 👋
              </h1>
              <p className="mt-2 text-xl text-gray-600">
                Continue your learning journey with your mentors
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-12">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow animate-fadeIn" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.color}`}>
                      <span className="text-2xl">{stat.icon}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upcoming Sessions */}
            <div className="lg:col-span-2">
              <Card className="shadow-soft animate-slideUp">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Upcoming Sessions</CardTitle>
                    <Link to="/my-sessions">
                      <Button variant="ghost" size="sm">View All</Button>
                    </Link>
                  </div>
                  <CardDescription>Your scheduled mentorship sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingSessions.map((session) => (
                      <div
                        key={session.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-sm transition-all"
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar src={session.mentorAvatar} alt={session.mentor} size="md" />
                          <div>
                            <p className="font-medium text-gray-900">{session.mentor}</p>
                            <p className="text-sm text-gray-600">{session.topic}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{session.date}</p>
                          <p className="text-xs text-gray-600">{session.time} • {session.duration}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <Card className="shadow-soft animate-slideUp" style={{ animationDelay: '100ms' }}>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link to="/mentors" className="block">
                    <Button className="w-full" variant="primary">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Find New Mentors
                    </Button>
                  </Link>
                  <Link to="/my-requests" className="block">
                    <Button className="w-full" variant="outline">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      View Requests
                    </Button>
                  </Link>
                  <Link to="/profile/edit" className="block">
                    <Button className="w-full" variant="ghost">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Update Profile
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Progress Card */}
              <Card className="shadow-soft bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200 animate-slideUp" style={{ animationDelay: '200ms' }}>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-primary-900 mb-2">Your Progress</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-primary-700">Monthly Goal</span>
                        <span className="font-medium text-primary-900">8/10 sessions</span>
                      </div>
                      <div className="w-full bg-primary-200 rounded-full h-2">
                        <div className="bg-primary-600 h-2 rounded-full" style={{ width: '80%' }} />
                      </div>
                    </div>
                    <p className="text-sm text-primary-700">
                      Keep it up! You're on track to meet your goals.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recommended Mentors */}
          <Card className="mt-8 shadow-soft animate-slideUp" style={{ animationDelay: '300ms' }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recommended Mentors</CardTitle>
                <Link to="/mentors">
                  <Button variant="ghost" size="sm">Browse All</Button>
                </Link>
              </div>
              <CardDescription>Based on your interests and goals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendedMentors.map((mentor) => (
                  <div
                    key={mentor.id}
                    className="p-6 rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start space-x-4">
                      <Avatar src={mentor.avatar} alt={mentor.name} size="lg" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{mentor.name}</h3>
                        <p className="text-sm text-gray-600">{mentor.title}</p>
                        <div className="flex items-center mt-2 text-sm">
                          <span className="text-yellow-500">★</span>
                          <span className="ml-1 font-medium">{mentor.rating}</span>
                          <span className="mx-2 text-gray-400">•</span>
                          <span className="text-gray-600">{mentor.sessions} sessions</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {mentor.skills.map((skill, index) => (
                            <Badge key={index} variant="default">{skill}</Badge>
                          ))}
                        </div>
                        <Button size="sm" className="mt-4 w-full">
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};