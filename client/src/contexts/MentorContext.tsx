import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Mentor, MentorFilter } from '../types/mentor';
import api from '../lib/axios';

interface MentorContextType {
  mentors: Mentor[];
  selectedMentor: Mentor | null;
  isLoading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  fetchMentors: (filters?: MentorFilter, page?: number) => Promise<void>;
  fetchMentorById: (id: string) => Promise<Mentor>;
  setSelectedMentor: (mentor: Mentor | null) => void;
}

const MentorContext = createContext<MentorContextType | undefined>(undefined);

export const useMentor = () => {
  const context = useContext(MentorContext);
  if (!context) {
    throw new Error('useMentor must be used within a MentorProvider');
  }
  return context;
};

interface MentorProviderProps {
  children: ReactNode;
}

export const MentorProvider: React.FC<MentorProviderProps> = ({ children }) => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchMentors = async (filters?: MentorFilter, page: number = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      setCurrentPage(page);
      
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', '12');
      
      if (filters) {
        if (filters.expertise?.length) {
          params.append('expertise', filters.expertise.join(','));
        }
        if (filters.skills?.length) {
          params.append('skills', filters.skills.join(','));
        }
        if (filters.minRate !== undefined) {
          params.append('minRate', filters.minRate.toString());
        }
        if (filters.maxRate !== undefined) {
          params.append('maxRate', filters.maxRate.toString());
        }
        if (filters.minRating !== undefined) {
          params.append('minRating', filters.minRating.toString());
        }
        if (filters.availability?.length) {
          params.append('availability', filters.availability.join(','));
        }
        if (filters.search) {
          params.append('search', filters.search);
        }
      }
      
      const { data } = await api.get(`/profiles/mentors?${params.toString()}`);
      // The backend returns an array directly, not an object with mentors property
      setMentors(Array.isArray(data) ? data : []);
      setTotalPages(1); // Backend doesn't support pagination yet
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch mentors');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMentorById = async (id: string): Promise<Mentor> => {
    try {
      setIsLoading(true);
      setError(null);
      const { data } = await api.get<Mentor>(`/profiles/${id}`);
      setSelectedMentor(data);
      return data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch mentor details';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MentorContext.Provider
      value={{
        mentors,
        selectedMentor,
        isLoading,
        error,
        totalPages,
        currentPage,
        fetchMentors,
        fetchMentorById,
        setSelectedMentor,
      }}
    >
      {children}
    </MentorContext.Provider>
  );
};