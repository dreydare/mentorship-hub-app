export interface Mentor {
  id: string;
  userId: string;
  name: string;
  email: string;
  profilePicture?: string;
  bio: string;
  expertise: string[];
  skills: string[];
  experience: number; // years
  hourlyRate: number;
  availability: string[];
  rating: number;
  totalSessions: number;
  totalReviews: number;
  languages: string[];
  education?: {
    degree: string;
    institution: string;
    year: number;
  }[];
  certifications?: string[];
  linkedinUrl?: string;
  websiteUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MentorFilter {
  expertise?: string[];
  skills?: string[];
  minRate?: number;
  maxRate?: number;
  minRating?: number;
  availability?: string[];
  search?: string;
}