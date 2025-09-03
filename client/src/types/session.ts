import type { User } from './user';

export interface Session {
  id: string;
  mentorId: string;
  menteeId: string;
  title: string;
  description: string;
  scheduledAt: string;
  duration: number; // in minutes
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  price: number;
  meetingLink?: string;
  notes?: string;
  feedback?: {
    rating: number;
    comment: string;
  };
  createdAt: string;
  updatedAt: string;
  mentor?: User;
  mentee?: User;
}

export interface SessionRequest {
  mentorId: string;
  title: string;
  description: string;
  scheduledAt: string;
  duration: number;
}