// AppRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './protectedRoutes';
import MainLayout from '@/pages/MainLayout'; 

// Auth Pages
import LoginPage from '@/pages/login/login.jsx';
import SignupPage from '@/pages/signup/signup.jsx';
import ForgotPasswordPage from '@/pages/login/forgot-password.jsx';
import ResetPasswordPage from '@/pages/login/reset-password.jsx';

// Shared Pages (Admin + Employee)
import Dashboard from '@/pages/dashboard/dashboard.jsx';
import Leads from '@/pages/leads/leads.jsx';
import LeadDetails from '@/pages/leads/LeadDetails.jsx';
import Tasks from '@/pages/tasks/tasks.jsx';

// Admin-Only Pages
import Pipeline from '@/pages/admin/Pipeline.jsx';
import Pipelines from '@/pages/admin/Pipelines.jsx'
import Settings from '@/pages/admin/Settings';
import UsersManagement from '@/pages/admin/UsersManagement';

function AppRoutes() {
  return (
    <Routes>
      {/* ================= PUBLIC ROUTES ================= */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* ================= SHARED PROTECTED ROUTES (Admin + User) ================= */}
      <Route element={<ProtectedRoute allowedRoles={['admin', 'user']} />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/leads/:id" element={<LeadDetails />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/pipeline" element={<Pipeline />} />
        </Route>
      </Route>

      {/* ================= ADMIN-ONLY PROTECTED ROUTES ================= */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<MainLayout />}>
          <Route path="/pipelines" element={<Pipelines />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/users" element={<UsersManagement />} />
        </Route>
      </Route>

      {/* ================= FALLBACK ROUTE ================= */}
      {/* Safe catch-all handler */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default AppRoutes;