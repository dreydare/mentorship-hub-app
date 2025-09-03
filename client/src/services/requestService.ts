import { api } from '../lib/axios';
import type { MentorshipRequest } from '../types/request';

export interface CreateRequestData {
  mentorId: string;
  message: string;
}

export interface UpdateRequestData {
  status: 'accepted' | 'rejected';
}

export const requestService = {
  // Get sent requests (for mentees)
  async getSentRequests(): Promise<MentorshipRequest[]> {
    const { data } = await api.get<MentorshipRequest[]>('/requests/sent');
    return data;
  },

  // Get received requests (for mentors)
  async getReceivedRequests(): Promise<MentorshipRequest[]> {
    const { data } = await api.get<MentorshipRequest[]>('/requests/received');
    return data;
  },

  // Get all requests for the current user (mentee or mentor)
  async getMyRequests(userRole: 'mentee' | 'mentor' | 'admin'): Promise<MentorshipRequest[]> {
    if (userRole === 'mentee') {
      return this.getSentRequests();
    } else if (userRole === 'mentor') {
      return this.getReceivedRequests();
    }
    return [];
  },

  // Create a new mentorship request (mentee only)
  async createRequest(requestData: CreateRequestData): Promise<MentorshipRequest> {
    const { data } = await api.post<MentorshipRequest>('/requests', requestData);
    return data;
  },

  // Update request status (mentor only - accept/reject)
  async updateRequestStatus(requestId: string, updateData: UpdateRequestData): Promise<MentorshipRequest> {
    const { data } = await api.put<MentorshipRequest>(`/requests/${requestId}`, updateData);
    return data;
  },

  // Get request by ID
  async getRequestById(requestId: string): Promise<MentorshipRequest> {
    const { data } = await api.get<MentorshipRequest>(`/requests/${requestId}`);
    return data;
  },

  // Check if request exists between current user and mentor
  async checkExistingRequest(mentorId: string, userRole: 'mentee' | 'mentor' | 'admin'): Promise<MentorshipRequest | null> {
    try {
      const requests = await this.getMyRequests(userRole);
      return requests.find(req => req.mentorId === mentorId) || null;
    } catch (error) {
      return null;
    }
  }
};