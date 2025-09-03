export const UserRole = {
  ADMIN: 'admin',
  MENTOR: 'mentor',
  MENTEE: 'mentee',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  profilePicture?: string;
}

export interface Profile {
  id: string;
  userId: string;
  name: string;
  bio?: string;
  skills: string[];
  goals: string[];
  industry?: string;
  experience?: string;
  availability?: string;
  hourlyRate?: number;
  linkedIn?: string;
  github?: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface UserWithProfile extends User {
  profile?: Profile;
}

export interface Mentor extends User {
  profile?: Profile;
  title?: string;
  skills?: string[];
  industry?: string;
  hourlyRate?: number;
  rating?: number;
}