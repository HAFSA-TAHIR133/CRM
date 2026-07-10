// src/layouts/MainLayout.jsx
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/pages/dashboard/components/app-sidebar';
import { NavUser } from '@/pages/dashboard/components/nav-user';
import { useAuthContext } from '@/context/authContext';
import { ShieldAlert } from 'lucide-react';
import api from '@/lib/axios';

export default function MainLayout() {
  const { user, loading, updateUserProfile } = useAuthContext();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/profile');
        if (res.data?.data) {
          setProfile(res.data.data);
          updateUserProfile(res.data.data);
        }
      } catch {
        // Use stored user data if profile endpoint unavailable
        const stored = localStorage.getItem('user');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            setProfile(parsed);
          } catch { /* ignore */ }
        }
      }
    };
    if (!loading) fetchProfile();
  }, [loading]);

  const userPayload = {
    id: profile?.id || user?.id || localStorage.getItem('userId'),
    name: profile?.name || user?.name || localStorage.getItem('userName') || 'CRM User',
    email: profile?.email || user?.email || localStorage.getItem('email') || '',
    avatar: profile?.avatar || user?.avatar || localStorage.getItem('avatar') || '',
    role: profile?.role || user?.role || localStorage.getItem('role') || 'user',
  };

  const handleAvatarUpdate = (updatedUser) => {
    setProfile(updatedUser);
    updateUserProfile(updatedUser);
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-3 bg-slate-50 text-xs font-semibold text-[#006666]/70 tracking-wide select-none">
        <div className="w-5 h-5 border-2 border-[#b2d8d8] border-t-[#008080] rounded-full animate-spin"></div>
        <span>Loading workspace matrix...</span>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen bg-slate-50/50 overflow-hidden text-slate-800">
        <AppSidebar />

        <SidebarInset className="flex-1 flex flex-col overflow-hidden bg-slate-50/30">
          <header className="h-14 border-b border-slate-200/60 bg-white flex items-center px-6 justify-between shrink-0 shadow-[0_1px_4px_rgba(0,76,76,0.01)]">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-[#b2d8d8]/20 flex items-center justify-center text-[#008080]">
                <ShieldAlert className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <div className="text-sm font-black tracking-wider text-[#004c4c] uppercase">
                ProCRM
              </div>
            </div>

            <div className="border-l border-slate-100 pl-4 h-8 flex items-center">
              <NavUser user={userPayload} onAvatarUpdate={handleAvatarUpdate} />
            </div>
          </header>

          <main className="flex-1 overflow-auto p-5 bg-slate-50/40 selection:bg-[#b2d8d8]/30">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
