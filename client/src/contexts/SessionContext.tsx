import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Session, SessionRequest } from '../types/session';
import api from '../lib/axios';

interface SessionContextType {
  sessions: Session[];
  isLoading: boolean;
  error: string | null;
  fetchSessions: () => Promise<void>;
  fetchUserSessions: (userId: string) => Promise<void>;
  createSession: (request: SessionRequest) => Promise<Session>;
  updateSessionStatus: (sessionId: string, status: Session['status']) => Promise<void>;
  cancelSession: (sessionId: string) => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

interface SessionProviderProps {
  children: ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data } = await api.get<Session[]>('/sessions');
      setSessions(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch sessions');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserSessions = async (userId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const { data } = await api.get<Session[]>(`/sessions/user/${userId}`);
      setSessions(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch user sessions');
    } finally {
      setIsLoading(false);
    }
  };

  const createSession = async (request: SessionRequest): Promise<Session> => {
    try {
      setIsLoading(true);
      setError(null);
      const { data } = await api.post<Session>('/sessions', request);
      setSessions([...sessions, data]);
      return data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to create session';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSessionStatus = async (sessionId: string, status: Session['status']) => {
    try {
      setIsLoading(true);
      setError(null);
      const { data } = await api.patch<Session>(`/sessions/${sessionId}/status`, { status });
      setSessions(sessions.map(s => s.id === sessionId ? data : s));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update session status');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelSession = async (sessionId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await api.delete(`/sessions/${sessionId}`);
      setSessions(sessions.filter(s => s.id !== sessionId));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to cancel session');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SessionContext.Provider
      value={{
        sessions,
        isLoading,
        error,
        fetchSessions,
        fetchUserSessions,
        createSession,
        updateSessionStatus,
        cancelSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};