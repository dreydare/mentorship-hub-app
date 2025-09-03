import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { MenteeDashboard } from './pages/MenteeDashboard';
import { MentorDiscoveryPage } from './pages/MentorDiscoveryPage';
import { ProfilePage } from './pages/ProfilePage';
import { SessionsPage } from './pages/SessionsPage';
import { RequestsPage } from './pages/RequestsPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <MenteeDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/mentors" 
          element={
            <ProtectedRoute>
              <MentorDiscoveryPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile/edit" 
          element={
            <ProtectedRoute>
              <ProfilePage editMode={true} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/sessions" 
          element={
            <ProtectedRoute>
              <SessionsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/my-sessions" 
          element={
            <ProtectedRoute>
              <SessionsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/requests" 
          element={
            <ProtectedRoute>
              <RequestsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/my-requests" 
          element={
            <ProtectedRoute>
              <RequestsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
