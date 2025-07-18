import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../store/auth.context';
import { ProtectedRoute } from './ProtectedRoute';
import { UserRole } from '../types/user.types';
import { LoginPage } from '../pages/LoginPage';

// Placeholder components - we'll create these next
const DashboardPage = () => <div className="p-8"><h1 className="text-2xl font-bold">Dashboard</h1><p>Welcome to the Mentorship Platform!</p></div>;
const ProfileEditPage = () => <div className="p-8"><h1 className="text-2xl font-bold">Edit Profile</h1></div>;

// Admin pages
const AdminUsersPage = () => <div>Admin Users</div>;
const AdminMatchesPage = () => <div>Admin Matches</div>;
const AdminSessionsPage = () => <div>Admin Sessions</div>;

// Mentor pages
const MentorAvailabilityPage = () => <div>Mentor Availability</div>;
const MentorRequestsPage = () => <div>Mentor Requests</div>;
const MentorSessionsPage = () => <div>Mentor Sessions</div>;

// Mentee pages
const MenteeMentorsPage = () => <div>Browse Mentors</div>;
const MenteeRequestsPage = () => <div>My Requests</div>;
const MenteeSessionsPage = () => <div>My Sessions</div>;

export const AppRoutes = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Common protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile/edit" element={<ProfileEditPage />} />
      </Route>

      {/* Admin routes */}
      <Route element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]} />}>
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/matches" element={<AdminMatchesPage />} />
        <Route path="/admin/sessions" element={<AdminSessionsPage />} />
      </Route>

      {/* Mentor routes */}
      <Route element={<ProtectedRoute allowedRoles={[UserRole.MENTOR]} />}>
        <Route path="/availability" element={<MentorAvailabilityPage />} />
        <Route path="/requests" element={<MentorRequestsPage />} />
        <Route path="/sessions" element={<MentorSessionsPage />} />
      </Route>

      {/* Mentee routes */}
      <Route element={<ProtectedRoute allowedRoles={[UserRole.MENTEE]} />}>
        <Route path="/mentors" element={<MenteeMentorsPage />} />
        <Route path="/my-requests" element={<MenteeRequestsPage />} />
        <Route path="/my-sessions" element={<MenteeSessionsPage />} />
      </Route>

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};