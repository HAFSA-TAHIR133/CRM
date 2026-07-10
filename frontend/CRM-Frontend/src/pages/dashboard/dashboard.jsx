// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';           // Use your configured axios
import { toast } from 'sonner';
import { Users, TrendingUp, AlertTriangle } from 'lucide-react';

// Safe helper function to parse localStorage items without crashing the app
const getStoredItem = (key, field, fallback) => {
  try {
    const data = localStorage.getItem(key);
    if (!data) return fallback;
    
    // If it looks like a JSON object string, parse it
    if (data.startsWith('{') || data.startsWith('[')) {
      const parsed = JSON.parse(data);
      return parsed[field] || fallback;
    }
    
    // If it's a plain string and we are asking for fields like 'name' or 'role', 
    // handle fallback or direct return depending on matching key configurations
    return data || fallback;
  } catch (err) {
    console.error(`Error parsing localStorage key "${key}":`, err);
    return fallback;
  }
};

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dynamic values parsed safely
  const userName = getStoredItem('user', 'name', 'User');
  const userRole = getStoredItem('user', 'role', 'user');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get('/dashboard/metrics');

        const data = res.data?.success ? res.data.data : res.data;
        setMetrics(data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        toast.error("Could not load dashboard metrics");
        setError("Failed to load metrics. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#f4f7f6]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#b2d8d8] border-t-[#008080] rounded-full animate-spin"></div>
          <div className="text-sm font-medium text-[#006666]/70 tracking-wide animate-pulse">
            Loading workspace metrics...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#f4f7f6] p-8">
        <div className="max-w-md w-full bg-white border border-red-100 rounded-2xl p-6 text-center shadow-xl shadow-red-950/5">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <p className="text-red-600 font-semibold text-lg mb-1">Data Error</p>
          <p className="text-slate-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const m = metrics || {
    totalLeads: 0,
    pipelineValue: '$0',
    overdueTasks: 0,
  };

  return (
    <div className="min-h-full space-y-10 p-1 md:p-4 text-slate-800 animate-in fade-in duration-300">
      
      {/* Top Greeting Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200/60 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-[#004c4c]">Dashboard</h1>
          <p className="text-slate-500 mt-1.5 text-sm font-medium">
            Welcome back, <span className="font-bold text-[#004c4c]">{userName}</span> 
            <span className="mx-2 text-slate-300">•</span>
            {/* <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wider bg-[#b2d8d8]/30 text-[#006666]">
              {userRole}
            </span> */}
          </p>
        </div>
        
        <div className="self-start md:self-auto bg-white border border-slate-200 shadow-sm rounded-xl px-4 py-2 text-xs font-semibold text-slate-500 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
          Live Analytics
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Total Leads Card */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 transition-all duration-300 hover:translate-y-[-2px] shadow-[0_8px_30px_rgb(0,76,76,0.03)] hover:shadow-[0_8px_30px_rgb(0,76,76,0.06)] flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Leads</span>
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#b2d8d8]/20 group-hover:text-[#008080] transition-colors">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-4xl font-black tracking-tight text-[#004c4c]">{m.totalLeads}</div>
            <p className="text-xs text-slate-400 font-medium mt-1">Active items inside CRM</p>
          </div>
        </div>

        {/* Pipeline Value Card */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 transition-all duration-300 hover:translate-y-[-2px] shadow-[0_8px_30px_rgb(0,76,76,0.03)] hover:shadow-[0_8px_30px_rgb(0,76,76,0.06)] flex flex-col justify-between group border-t-4 border-t-[#008080]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pipeline Value</span>
            <div className="w-10 h-10 rounded-xl bg-[#b2d8d8]/20 flex items-center justify-center text-[#008080]">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-4xl font-black tracking-tight text-[#008080]">{m.pipelineValue}</div>
            <p className="text-xs text-[#66b2b2] font-semibold mt-1">Forecasted pipeline volume</p>
          </div>
        </div>

        {/* Overdue Tasks Card */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 transition-all duration-300 hover:translate-y-[-2px] shadow-[0_8px_30px_rgb(0,76,76,0.03)] hover:shadow-[0_8px_30px_rgb(0,76,76,0.06)] flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Overdue Tasks</span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 group-hover:bg-rose-100 transition-colors">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-4xl font-black tracking-tight text-rose-600">{m.overdueTasks}</div>
            <p className="text-xs text-rose-400 font-medium mt-1">Requires immediate attention</p>
          </div>
        </div>

      </div>
    </div>
  );
}