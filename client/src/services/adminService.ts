import api from '../lib/axios';
import type { User } from '../types/user';
import type { Session } from '../types/session';
import type { MentorshipRequest } from '../types/request';

export interface AdminStats {
  totalUsers: number;
  totalMentors: number;
  totalMentees: number;
  totalSessions: number;
  activeSessions: number;
  totalRequests: number;
  pendingRequests: number;
  revenue: number;
}

export interface AdminDashboardData {
  stats: AdminStats;
  recentUsers: User[];
  recentSessions: Session[];
  recentRequests: MentorshipRequest[];
}

export const adminService = {
  async getDashboardData(): Promise<AdminDashboardData> {
    try {
      // Fetch all data in parallel for better performance
      const [usersRes, sessionsRes, requestsRes] = await Promise.all([
        api.get<User[]>('/admin/users'),
        api.get<Session[]>('/admin/sessions'),
        api.get<MentorshipRequest[]>('/admin/matches')
      ]);

      const users = usersRes.data;
      const sessions = sessionsRes.data;
      const requests = requestsRes.data;

      // Calculate stats
      const stats: AdminStats = {
        totalUsers: users.length,
        totalMentors: users.filter(u => u.role === 'mentor').length,
        totalMentees: users.filter(u => u.role === 'mentee').length,
        totalSessions: sessions.length,
        activeSessions: sessions.filter(s => s.status === 'confirmed' || s.status === 'pending').length,
        totalRequests: requests.length,
        pendingRequests: requests.filter(r => r.status === 'pending').length,
        revenue: sessions.filter(s => s.status === 'completed').length * 80 // Example calculation
      };

      return {
        stats,
        recentUsers: users.slice(0, 5),
        recentSessions: sessions.slice(0, 5),
        recentRequests: requests.slice(0, 5)
      };
    } catch (error) {
      console.error('Failed to fetch admin dashboard data:', error);
      throw error;
    }
  },

  async getAllUsers(): Promise<User[]> {
    const { data } = await api.get<User[]>('/admin/users');
    return data;
  },

  async updateUserRole(userId: string, role: string): Promise<User> {
    const { data } = await api.put<User>(`/admin/users/${userId}/role`, { role });
    return data;
  },

  async getAllSessions(): Promise<Session[]> {
    const { data } = await api.get<Session[]>('/admin/sessions');
    return data;
  },

  async getAllMatches(): Promise<MentorshipRequest[]> {
    const { data } = await api.get<MentorshipRequest[]>('/admin/matches');
    return data;
  },

  async assignMentor(menteeId: string, mentorId: string): Promise<void> {
    await api.post('/admin/assign-mentor', { menteeId, mentorId });
  }
};