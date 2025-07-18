import React from 'react';
import { Navbar } from './Navbar';
import { cn } from '../../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  user?: {
    name: string;
    email: string;
    role: 'ADMIN' | 'MENTOR' | 'MENTEE';
    avatar?: string;
  };
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, className }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      <main className={cn('animate-fadeIn', className)}>
        {children}
      </main>
    </div>
  );
};