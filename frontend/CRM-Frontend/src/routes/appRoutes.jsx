// appRoutes.jsx
import { Routes, Route, Navigate,useLocation } from 'react-router-dom'; 
import LoginPage from '@/pages/login/login';
import SignupPage from '@/pages/signup/signup';
import Dashboard from '@/pages/dashboard/dashboard';
import Leads from '@/pages/leads/leads.jsx';
function AppRoutes() {
  
  return (
    <>
      <main className="main-content-wrapper">
        <Routes>
          
          <Route path="/" element={<Navigate to="/signup" />} />
          
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/leads' element={<Leads />} />
          
        </Routes>
      </main>
  
  </>);
}

export default AppRoutes;