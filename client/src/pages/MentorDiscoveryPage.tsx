import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { useMentor } from '../contexts/MentorContext';
import { useAuth } from '../contexts/AuthContext';
import type { MentorFilter } from '../types/mentor';

const skills = [
  'React', 'Node.js', 'Python', 'Machine Learning', 'Product Management',
  'UI/UX Design', 'Data Science', 'Marketing', 'Leadership', 'Business Strategy'
];

export const MentorDiscoveryPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<'all' | 'budget' | 'premium'>('all');
  const { user } = useAuth();
  const { mentors, isLoading, error, fetchMentors, currentPage, totalPages } = useMentor();

  useEffect(() => {
    const filters: MentorFilter = {
      search: searchQuery,
      skills: selectedSkills,
      minRate: priceRange === 'budget' ? 0 : priceRange === 'premium' ? 80 : undefined,
      maxRate: priceRange === 'budget' ? 80 : undefined,
    };
    fetchMentors(filters, currentPage);
  }, [searchQuery, selectedSkills, priceRange, currentPage]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handlePageChange = (page: number) => {
    const filters: MentorFilter = {
      search: searchQuery,
      skills: selectedSkills,
      minRate: priceRange === 'budget' ? 0 : priceRange === 'premium' ? 80 : undefined,
      maxRate: priceRange === 'budget' ? 80 : undefined,
    };
    fetchMentors(filters, page);
  };

  return (
    <Layout user={user ? { 
      name: user.name || user.email.split('@')[0], 
      email: user.email, 
      role: user.role.toUpperCase() as 'ADMIN' | 'MENTOR' | 'MENTEE',
      avatar: user.profilePicture
    } : undefined}>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-4xl font-bold mb-4 animate-slideUp">
              Find Your Perfect Mentor
            </h1>
            <p className="text-xl opacity-90 mb-8">
              Connect with experienced professionals who can guide your career journey
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl">
              <Input
                type="text"
                placeholder="Search by name, skills, or expertise..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white text-gray-900 border-0 h-14 text-lg"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              />
            </div>
          </div>
        </div>

        {/* Filters and Results */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 shadow-soft">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Filters</h3>
                  
                  {/* Price Range */}
                  <div className="mb-6">
                    <h4 className="font-medium text-sm text-gray-700 mb-3">Price Range</h4>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="price"
                          checked={priceRange === 'all'}
                          onChange={() => setPriceRange('all')}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm">All prices</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="price"
                          checked={priceRange === 'budget'}
                          onChange={() => setPriceRange('budget')}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm">Budget ($80 or less)</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="price"
                          checked={priceRange === 'premium'}
                          onChange={() => setPriceRange('premium')}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm">Premium ($80+)</span>
                      </label>
                    </div>
                  </div>
                  
                  {/* Skills */}
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-3">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <button
                          key={skill}
                          onClick={() => toggleSkill(skill)}
                          className={`px-3 py-1 rounded-full text-sm transition-all ${
                            selectedSkills.includes(skill)
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {selectedSkills.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-4 w-full"
                      onClick={() => setSelectedSkills([])}
                    >
                      Clear filters
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Mentor Grid */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-gray-600">
                  Showing {mentors.length} mentors
                </p>
                <select className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500">
                  <option>Sort by: Recommended</option>
                  <option>Sort by: Rating</option>
                  <option>Sort by: Price (Low to High)</option>
                  <option>Sort by: Price (High to Low)</option>
                </select>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-6">
                  {error}
                </div>
              )}

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                          <div className="flex-1">
                            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        </div>
                        <div className="mt-4 space-y-2">
                          <div className="h-4 bg-gray-200 rounded"></div>
                          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mentors.map((mentor, index) => (
                  <Card
                    key={mentor.id}
                    className="hover:shadow-lg transition-all animate-fadeIn overflow-hidden"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-0">
                      <div className="p-6">
                        <div className="flex items-start space-x-4">
                          <Avatar
                            src={mentor.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.name)}&background=d946ef&color=fff`}
                            alt={mentor.name}
                            size="xl"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-gray-900">
                              {mentor.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {mentor.experience} years of experience
                            </p>
                            <div className="flex items-center mt-2 text-sm">
                              <span className="text-yellow-500">★</span>
                              <span className="ml-1 font-medium">{mentor.rating || 0}</span>
                              <span className="mx-2 text-gray-400">•</span>
                              <span className="text-gray-600">{mentor.totalSessions || 0} sessions</span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="mt-4 text-sm text-gray-700 line-clamp-2">
                          {mentor.bio}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mt-4">
                          {mentor.skills.slice(0, 3).map((skill, idx) => (
                            <Badge key={idx} variant="default">{skill}</Badge>
                          ))}
                          {mentor.skills.length > 3 && (
                            <Badge variant="default">+{mentor.skills.length - 3} more</Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
                          <div>
                            <p className="text-2xl font-bold text-gray-900">
                              ${mentor.hourlyRate}<span className="text-sm font-normal text-gray-600">/hour</span>
                            </p>
                            <p className="text-xs text-green-600 font-medium">
                              {mentor.availability?.length ? 'Available' : 'Check availability'}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              View Profile
                            </Button>
                            <Button size="sm">
                              Book Session
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              )}

              {!isLoading && mentors.length === 0 && (
                <Card className="text-center py-12">
                  <CardContent>
                    <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No mentors found
                    </h3>
                    <p className="text-gray-600">
                      Try adjusting your filters or search query
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <nav className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={page === currentPage ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};