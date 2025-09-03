import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export const LandingPage: React.FC = () => {
  const features = [
    {
      icon: '🎯',
      title: 'Expert Mentors',
      description: 'Connect with industry professionals who have years of experience in your field.'
    },
    {
      icon: '📅',
      title: 'Flexible Scheduling',
      description: 'Book sessions that fit your schedule with our easy-to-use calendar system.'
    },
    {
      icon: '💼',
      title: 'Career Growth',
      description: 'Get personalized guidance to accelerate your professional development.'
    },
    {
      icon: '🌟',
      title: 'Proven Results',
      description: 'Join thousands of professionals who have achieved their goals through mentorship.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Software Engineer',
      content: 'The mentorship I received helped me land my dream job at a top tech company!',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Product Manager',
      content: 'Amazing platform with incredibly knowledgeable mentors. Highly recommended!',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'UX Designer',
      content: 'The guidance I received was invaluable for my career transition into design.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="gradient-mesh">
        <div className="relative">
          {/* Navigation */}
          <nav className="flex items-center justify-between px-6 py-4 lg:px-8">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">Mentorship Hub</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </nav>

          {/* Hero Content */}
          <div className="px-6 py-24 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl animate-slideUp">
                Find Your Perfect{' '}
                <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  Mentor
                </span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600 animate-slideUp">
                Connect with experienced professionals who can guide your career journey. 
                Get personalized advice, skill development, and achieve your professional goals.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6 animate-slideUp">
                <Link to="/register">
                  <Button size="lg" className="px-8 py-3">
                    Start Your Journey
                  </Button>
                </Link>
                <Link to="/mentors">
                  <Button variant="outline" size="lg" className="px-8 py-3">
                    Browse Mentors
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 sm:py-32 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Why Choose Our Platform?
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              We provide everything you need for a successful mentorship experience.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
              {features.map((feature) => (
                <Card key={feature.title} className="hover:shadow-lg transition-shadow card-hover">
                  <CardHeader className="text-center">
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              What Our Users Say
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Hear from professionals who've transformed their careers through mentorship.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400">⭐</span>
                    ))}
                  </div>
                  <blockquote className="text-gray-900 mb-4">
                    "{testimonial.content}"
                  </blockquote>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="gradient-primary">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to accelerate your career?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-blue-100">
              Join thousands of professionals who are already growing their careers with expert mentorship.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link to="/register">
                <Button size="lg" variant="outline" className="bg-white text-primary-600 hover:bg-gray-50 px-8 py-3">
                  Get Started Today
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                <span className="text-white font-bold">M</span>
              </div>
              <span className="text-xl font-bold text-white">Mentorship Hub</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2024 Mentorship Hub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};