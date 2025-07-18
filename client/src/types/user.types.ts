export enum UserRole {
  ADMIN = 'admin',
  MENTOR = 'mentor',
  MENTEE = 'mentee',
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  id: string;
  userId: string;
  name: string;
  bio?: string;
  skills: string[];
  goals: string[];
  industry?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserWithProfile extends User {
  profile?: Profile;
}