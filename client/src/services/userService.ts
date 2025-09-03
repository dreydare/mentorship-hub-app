import api from '../lib/axios';
import type { User } from '../types/auth';

export interface UpdateProfileData {
  name?: string;
  bio?: string;
  skills?: string[];
  expertise?: string[];
  experience?: number;
  hourlyRate?: number;
  availability?: string[];
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export const userService = {
  // Get current user profile
  getProfile: async (): Promise<User> => {
    const { data } = await api.get<User>('/users/profile');
    return data;
  },

  // Update user profile
  updateProfile: async (profileData: UpdateProfileData): Promise<User> => {
    const { data } = await api.put<User>('/users/profile', profileData);
    return data;
  },

  // Upload profile picture
  uploadProfilePicture: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('profilePicture', file);
    
    const { data } = await api.post<{ url: string }>('/users/profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  // Change password
  changePassword: async (passwordData: ChangePasswordData): Promise<void> => {
    await api.post('/users/change-password', passwordData);
  },

  // Delete account
  deleteAccount: async (): Promise<void> => {
    await api.delete('/users/account');
  },

  // Get user by ID (for viewing other profiles)
  getUserById: async (userId: string): Promise<User> => {
    const { data } = await api.get<User>(`/users/${userId}`);
    return data;
  },

  // Get user statistics
  getUserStats: async (userId?: string): Promise<{
    totalSessions: number;
    completedSessions: number;
    averageRating: number;
    totalEarnings?: number;
    totalSpent?: number;
  }> => {
    const url = userId ? `/users/${userId}/stats` : '/users/stats';
    const { data } = await api.get(url);
    return data;
  },
};