import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import TaskList from '@/pages/tasks/TaskList';
import NoteList from '@/pages/notes/NoteList';
import ActivityTimeline from '@/pages/ActivityTimeline';
import { toast } from 'sonner';
import { ShieldAlert, Building2, Landmark, RefreshCw } from 'lucide-react';

const LeadDetails = () => {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

  const userRole = (localStorage.getItem('role') || 'user').toLowerCase();

  const fetchLeadDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const leadRes = await api.get(`/leads/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setLead(leadRes.data.lead || leadRes.data);

      if (userRole === 'admin') {
        const usersRes = await api.get('/users', { headers: { Authorization: `Bearer ${token}` } });
        setUsers(usersRes.data.data || usersRes.data || []);
      }
    } catch (err) {
      toast.error("Failed to load lead details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadDetails();
  }, [id]);

  const handleReassign = async (userId) => {
    if (!userId || userRole !== 'admin') return;
    setAssigning(true);
    try {
      const token = localStorage.getItem('token');
      await api.put(`/leads/${id}/assign`, { userId }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Lead reassigned");
      fetchLeadDetails();
    } catch (err) {
      toast.error("Reassignment failed");
    } finally {
      setAssigning(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#f4f7f6]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#b2d8d8] border-t-[#008080] rounded-full animate-spin"></div>
          <div className="text-sm font-medium text-[#006666]/70 tracking-wide animate-pulse">Loading lead profile...</div>
        </div>
      </div>
    );
  }
  
  if (!lead) return <div className="p-8 text-center text-slate-500 font-medium">Lead profile not found</div>;

  return (
    <div className="p-1 md:p-4 space-y-8 animate-in fade-in duration-300">
      
      {/*  Top Header Summary Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#b2d8d8]/20 flex items-center justify-center text-[#008080] shrink-0 border border-[#b2d8d8]/40">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-[#004c4c]">{lead.name}</h1>
            <p className="text-slate-500 font-medium text-sm mt-0.5">{lead.contactInfo || lead.leadSource || ''}</p>
          </div>
        </div>
        
        <Badge className="self-start sm:self-auto text-sm px-4 py-1.5 rounded-xl font-bold uppercase tracking-wider bg-[#b2d8d8]/30 border border-[#b2d8d8] text-[#006666] shadow-none">
          {lead.stage?.name || (typeof lead.stage === 'string' ? lead.stage : "New")}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 1. Lead Info Card Container */}
        <Card className="lg:col-span-1 bg-white border border-slate-100 rounded-2xl shadow-[0_8px_30px_rgb(0,76,76,0.02)]">
          <CardHeader className="border-b border-slate-50 pb-4">
            <CardTitle className="text-base font-bold text-[#004c4c]">Lead Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-5 text-sm text-slate-600">
            <p className="flex justify-between py-1 border-b border-slate-50">
              <strong className="text-slate-400 font-semibold">Company:</strong> 
              <span className="font-semibold text-slate-800">{lead.contactInfo || lead.leadSource || 'N/A'}</span>
            </p>
            <p className="flex justify-between py-1 border-b border-slate-50">
              <strong className="text-slate-400 font-semibold">Source:</strong> 
              <span className="font-medium text-slate-700 bg-slate-50 px-2 py-0.5 rounded-md text-xs">{lead.leadSource || "N/A"}</span>
            </p>
            
            <div className="flex justify-between items-center py-1 border-b border-slate-50">
              <strong className="text-slate-400 font-semibold">Expected Value:</strong> 
              {userRole === 'admin' ? (
                <span className="font-black text-emerald-600 inline-flex items-center gap-1">
                  <Landmark className="w-4 h-4 text-emerald-500" />
                  ${lead.expectedValue?.toLocaleString()}
                </span>
              ) : (
                <span className="text-amber-600 text-xs font-semibold bg-amber-50 px-2 py-1 rounded-lg flex items-center gap-1 border border-amber-100">
                  <ShieldAlert className="h-3.5 w-3.5" /> Value restricted
                </span>
              )}
            </div>

            {/* Assignment Field and Native Select Box */}
            <div className="pt-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Assigned Workspace Manager</label>
              <div className="flex flex-col sm:flex-row gap-3 mt-2">
                <span className="font-bold text-slate-800 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 flex-1 flex items-center">
                  {lead.assignedUser?.name || 'Unassigned'}
                </span>
                
                {userRole === 'admin' && (
                  <div className="relative flex items-center">
                    <select 
                      disabled={assigning}
                      onChange={(e) => handleReassign(e.target.value)} 
                      className="w-full sm:w-auto bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-[#006666] outline-none hover:border-[#b2d8d8] cursor-pointer focus:border-[#008080] transition-colors appearance-none pr-8 shadow-sm"
                    >
                      <option value="">Reassign lead...</option>
                      {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                    </select>
                    <div className="pointer-events-none absolute right-2.5 text-[#66b2b2]">
                      <RefreshCw className={`w-3.5 h-3.5 ${assigning ? 'animate-spin' : ''}`} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. Tasks List Card */}
        <Card className="lg:col-span-1 bg-white border border-slate-100 rounded-2xl shadow-[0_8px_30px_rgb(0,76,76,0.02)]">
          <CardHeader className="border-b border-slate-50 pb-4">
            <CardTitle className="text-base font-bold text-[#004c4c]">Tasks Tracker</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 max-h-[400px] overflow-y-auto">
            <TaskList leadId={id} />
          </CardContent>
        </Card>

        {/* 3. Notes Content Card */}
        <Card className="lg:col-span-1 bg-white border border-slate-100 rounded-2xl shadow-[0_8px_30px_rgb(0,76,76,0.02)]">
          <CardHeader className="border-b border-slate-50 pb-4">
            <CardTitle className="text-base font-bold text-[#004c4c]">Workspace Notes</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 max-h-[400px] overflow-y-auto">
            <NoteList leadId={id} />
          </CardContent>
        </Card>
      </div>

      {/* Bottom Timeline Section Wrapper */}
      <Card className="bg-white border border-slate-100 rounded-2xl shadow-[0_8px_30px_rgb(0,76,76,0.02)]">
        <CardHeader className="border-b border-slate-50 pb-4">
          <CardTitle className="text-base font-bold text-[#004c4c]">Activity Timeline Tracking</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ActivityTimeline leadId={id} />
        </CardContent>
      </Card>
      
    </div>
  );
};

export default LeadDetails;