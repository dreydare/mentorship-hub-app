import { api } from '../lib/axios';
import type { Session } from '../types/session';
import type { MentorshipRequest } from '../types/request';
import type { Mentor } from '../types/user';

export interface DashboardStats {
  activeSessions: number;
  totalSessions: number;
  totalMentors: number;
  goalsAchieved: number;
}

export interface DashboardData {
  stats: DashboardStats;
  upcomingSessions: Session[];
  recommendedMentors: Mentor[];
  recentActivity: any[];
}

export const dashboardService = {
  // Get mentee dashboard data
  async getMenteeDashboard(): Promise<DashboardData> {
    try {
      // Fetch all data in parallel
      const [sessionsRes, mentorsRes, requestsRes] = await Promise.all([
        api.get<Session[]>('/sessions/mentee'),
        api.get<Mentor[]>('/profiles/mentors?limit=2'),
        api.get<MentorshipRequest[]>('/requests/sent')
      ]);

      const sessions = sessionsRes.data || [];
      const mentors = mentorsRes.data || [];
      const requests = requestsRes.data || [];

      // Calculate stats
      const activeSessions = sessions.filter(s => 
        s.status === 'pending' || s.status === 'confirmed'
      ).length;
      
      const completedSessions = sessions.filter(s => 
        s.status === 'completed'
      ).length;

      // Get unique mentors from requests
      const acceptedRequests = requests.filter(r => r.status === 'accepted');
      const uniqueMentorIds = new Set(acceptedRequests.map(r => r.mentorId));

      const stats: DashboardStats = {
        activeSessions,
        totalSessions: sessions.length,
        totalMentors: uniqueMentorIds.size,
        goalsAchieved: completedSessions // Using completed sessions as goals achieved
      };

      // Get upcoming sessions (next 2)
      const upcomingSessions = sessions
        .filter(s => s.status === 'pending' || s.status === 'confirmed')
        .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
        .slice(0, 2);

      return {
        stats,
        upcomingSessions,
        recommendedMentors: mentors,
        recentActivity: []
      };
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Return default data on error
      return {
        stats: {
          activeSessions: 0,
          totalSessions: 0,
          totalMentors: 0,
          goalsAchieved: 0
        },
        upcomingSessions: [],
        recommendedMentors: [],
        recentActivity: []
      };
    }
  },

  // Get admin dashboard data
  async getAdminDashboard() {
    try {
      const { data } = await api.get('/admin/dashboard');
      return data;
    } catch (error) {
      console.error('Failed to fetch admin dashboard:', error);
      throw error;
    }
  }
};