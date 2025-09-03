export interface User {
  id: string;
  email: string;
  name: string;
  role: 'mentee' | 'mentor' | 'admin';
  profilePicture?: string;
  bio?: string;
  skills?: string[];
  expertise?: string[];
  experience?: number;
  hourlyRate?: number;
  availability?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  role: 'mentee' | 'mentor';
}

export interface AuthResponse {
  user: User;
  access_token: string;
}