// src/pages/Leads.jsx
import { useState, useEffect } from 'react';
import api from '@/lib/axios'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, LayoutGrid, List, Search, ShieldAlert, CheckSquare, Layers } from "lucide-react";
import { toast } from 'sonner';
import LeadKanban from "./LeadKanban"; 

// 🟢 IMPORTING YOUR DEDICATED FILES FROM THE TREE
import NoteList from '../notes/NoteList';
import CreateTaskModal from '../tasks/CreateTaskModal';
import TaskList from '../tasks/TaskList';
import ActivityTimeline from '../ActivityTimeline';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table'); 

  const userRole = (localStorage.getItem('role') || 'user').toLowerCase();

  // Dialog / Modal Window States
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const [newLead, setNewLead] = useState({
    name: "", contactInfo: "", leadSource: "", expectedValue: "",
    status: "open", outcome: "", assignedTo: "", pipelineId: "", stageId: ""
  });
  const [pipelines, setPipelines] = useState([]);
  const [stages, setStages] = useState([]);
  const [users, setUsers] = useState([]);
  const [availableStages, setAvailableStages] = useState([]);
  const [editAvailableStages, setEditAvailableStages] = useState([]);

  // Fetch pipelines, stages, and users for dropdowns
  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const [pipelinesRes, usersRes] = await Promise.all([
          api.get('/pipelines'),
          api.get('/users')
        ]);
        setPipelines(pipelinesRes.data.data || []);
        setUsers(usersRes.data?.data || usersRes.data?.users || []);
      } catch (err) {
        console.error("Failed to load form data", err);
      }
    };
    fetchFormData();
  }, []);

  // Fetch stages when pipeline changes (create form)
  useEffect(() => {
    if (!newLead.pipelineId) {
      setAvailableStages([]);
      return;
    }
    const fetchStages = async () => {
      try {
        const res = await api.get(`/pipelines/${newLead.pipelineId}/stages`);
        setAvailableStages(res.data.data || []);
      } catch (err) {
        console.error("Failed to load stages", err);
      }
    };
    fetchStages();
  }, [newLead.pipelineId]);

  // Fetch stages when pipeline changes (edit form)
  useEffect(() => {
    if (!editingLead?.pipelineId) {
      setEditAvailableStages([]);
      return;
    }
    const fetchStages = async () => {
      try {
        const res = await api.get(`/pipelines/${editingLead.pipelineId}/stages`);
        setEditAvailableStages(res.data.data || []);
      } catch (err) {
        console.error("Failed to load stages", err);
      }
    };
    fetchStages();
  }, [editingLead?.pipelineId]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
      const res = await api.get('/leads', {
        params: { search: debouncedSearch },
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const extractedLeads = Array.isArray(res.data) 
        ? res.data 
        : (res.data?.data?.rows || res.data?.data || res.data?.rows || []);
      
      setLeads(Array.isArray(extractedLeads) ? extractedLeads : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load pipeline records");
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [debouncedSearch]);

  const openEditModal = (lead) => {
    setEditingLead({ ...lead });
    setIsEditOpen(true);
  };

  const handleCreateLead = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
      await api.post('/leads', newLead, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Lead created successfully");
      setIsCreateOpen(false);
      setNewLead({
        name: "", contactInfo: "", leadSource: "", expectedValue: "",
        status: "new", outcome: "", assignedTo: "", pipelineId: "", stageId: ""
      });
      fetchLeads();
    } catch (err) {
      toast.error("Failed to execute lead insertion");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
      await api.put(`/leads/${editingLead.id || editingLead._id}`, editingLead, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Lead updated cleanly");
      setIsEditOpen(false);
      fetchLeads();
    } catch (err) {
      toast.error("Failed to commit modifications");
    }
  };

  const deleteLead = async (id) => {
    if (userRole !== 'admin') {
      toast.error("Unauthorized privilege restriction");
      return;
    }
    if (!window.confirm('Are you sure you want to drop this lead entry?')) return;
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
      await api.delete(`/leads/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Record terminated cleanly');
      fetchLeads();
    } catch (err) {
      toast.error('Failed to eliminate database entry');
    }
  };

  return (
    <div className="space-y-6 w-full p-1 md:p-4 animate-in fade-in duration-300">
      
      {/* 🏷️ HEADER BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-[#004c4c]">Leads Management</h1>
          <p className="text-slate-500 font-medium text-sm mt-0.5">Track, filter, and modify live system pipelines.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          {/* View Switcher Controls */}
          <div className="flex border border-slate-200 rounded-xl p-1 bg-white shadow-[0_2px_8px_rgba(0,76,76,0.015)]">
            <Button 
              variant="ghost" size="sm" onClick={() => setViewMode('table')}
              className={`rounded-lg h-8 text-xs font-bold transition-all ${viewMode === 'table' ? 'bg-[#b2d8d8]/20 text-[#006666]' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <List className="h-3.5 w-3.5 mr-1.5 stroke-[2.5]" /> List View
            </Button>
            <Button 
              variant="ghost" size="sm" onClick={() => setViewMode('kanban')}
              className={`rounded-lg h-8 text-xs font-bold transition-all ${viewMode === 'kanban' ? 'bg-[#b2d8d8]/20 text-[#006666]' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <LayoutGrid className="h-3.5 w-3.5 mr-1.5 stroke-[2.5]" /> Kanban Board
            </Button>
          </div>

          <Button 
            onClick={() => setIsCreateOpen(true)}
            className="h-10 px-4 bg-[#008080] hover:bg-[#006666] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all duration-200 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4 stroke-[3]" /> Add New Lead
          </Button>
        </div>
      </div>

      {/* 📊 RENDER MODES */}
      {viewMode === 'kanban' ? (
        <Card className="border border-slate-200/70 bg-slate-50/40 rounded-2xl p-4 shadow-[0_4px_24px_rgba(0,76,76,0.01)] overflow-x-auto">
          <LeadKanban leads={Array.isArray(leads) ? leads : []} setLeads={setLeads} fetchLeads={fetchLeads} />
        </Card>
      ) : (
        <Card className="border border-slate-200/60 bg-white rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,76,76,0.015)]">
          <CardHeader className="p-4 border-b border-slate-100 bg-slate-50/30">
            <div className="relative max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search leads..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-10 border-slate-200 focus-visible:ring-[#008080] focus-visible:border-[#008080] rounded-xl text-sm"
              />
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/60 border-b border-slate-100">
                  <TableRow>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-400 px-5 h-11">Name</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-400 px-5 h-11">Contact Details</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-400 px-5 h-11">Source</TableHead>
                    {userRole === 'admin' && <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-400 px-5 h-11">Expected Value</TableHead>}
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-400 px-5 h-11">Stage</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-400 px-5 h-11">Status</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-400 px-5 h-11 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={userRole === 'admin' ? 7 : 6} className="text-center py-16">
                        <div className="flex flex-col items-center gap-2 text-xs font-semibold text-[#006666]/70 tracking-wide">
                          <div className="w-5 h-5 border-2 border-[#b2d8d8] border-t-[#008080] rounded-full animate-spin"></div>
                          Syncing live data arrays...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : !Array.isArray(leads) || leads.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={userRole === 'admin' ? 7 : 6} className="text-center py-16 text-sm font-medium text-slate-400">
                        No pipeline matches found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    leads.map((lead) => (
                      <TableRow key={lead.id || lead._id} className="border-b border-slate-50 hover:bg-[#b2d8d8]/5 transition-colors">
                        <TableCell className="px-5 py-3.5">
                          <button 
                            onClick={() => openEditModal(lead)} 
                            className="hover:underline text-sm font-bold text-[#004c4c] text-left block"
                          >
                            {lead.name}
                          </button>
                        </TableCell>
                        <TableCell className="text-slate-600 font-medium px-5 py-3.5 text-xs">{lead.contactInfo || "—"}</TableCell>
                        <TableCell className="px-5 py-3.5">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-50 border border-slate-100 text-slate-600">
                            {lead.leadSource || "Direct"}
                          </span>
                        </TableCell>
                        {userRole === 'admin' && (
                          <TableCell className="font-bold text-slate-800 px-5 py-3.5 text-xs">
                            ${Number(lead.expectedValue || 0).toLocaleString()}
                          </TableCell>
                        )}
                        <TableCell className="px-5 py-3.5">
                          <Badge variant="secondary" className="rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wide border-0" style={{ backgroundColor: lead.stage?.color ? `${lead.stage.color}15` : '#f1f5f9', color: lead.stage?.color || '#475569' }}>
                            <span className="w-1.5 h-1.5 rounded-full mr-1.5 inline-block" style={{ backgroundColor: lead.stage?.color || '#94a3b8' }} />
                            {lead.stage?.name || `Stage ${lead.stageId}`}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-5 py-3.5">
                          <Badge className={`capitalize font-bold rounded-md px-2.5 py-0.5 text-[11px] border shadow-none ${
                            lead.status === 'won' || lead.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                            lead.status === 'lost' ? 'bg-rose-50 text-rose-700 border-rose-100' : 
                            'bg-[#b2d8d8]/20 text-[#006666] border-[#b2d8d8]/40'
                          }`}>{lead.status || "open"}</Badge>
                        </TableCell>
                        <TableCell className="text-right px-5 py-3.5">
                          <div className="flex justify-end gap-0.5">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-[#008080] hover:bg-[#b2d8d8]/15 rounded-lg" onClick={() => openEditModal(lead)}>
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            {userRole === 'admin' && (
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg" onClick={() => deleteLead(lead.id || lead._id)}>
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 📥 MODAL 1: CREATE LEAD */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
          <DialogHeader className="pb-3 border-b border-slate-100 flex flex-row items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#b2d8d8]/30 flex items-center justify-center text-[#008080]">
              <Plus className="w-4 h-4 stroke-[3]" />
            </div>
            <DialogTitle className="text-base font-black text-[#004c4c]">Create New Lead</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateLead} className="space-y-4 pt-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Lead Name *</label>
              <Input placeholder="Client name or company name..." required value={newLead.name} onChange={(e) => setNewLead({ ...newLead, name: e.target.value })} className="h-10 rounded-xl text-sm border-slate-200 focus-visible:ring-[#008080]" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Contact Details</label>
              <Input placeholder="Email or telephone number..." value={newLead.contactInfo} onChange={(e) => setNewLead({ ...newLead, contactInfo: e.target.value })} className="h-10 rounded-xl text-sm border-slate-200 focus-visible:ring-[#008080]" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Lead Source</label>
              <select
                value={newLead.leadSource}
                onChange={(e) => setNewLead({ ...newLead, leadSource: e.target.value })}
                className="h-10 rounded-xl text-sm border border-slate-200 focus-visible:ring-[#008080] focus-visible:border-[#008080] w-full px-3 bg-white"
              >
                <option value="">Select source...</option>
                <option value="Website">Website</option>
                <option value="Referral">Referral</option>
                <option value="Email Campaign">Email Campaign</option>
                <option value="Social Media">Social Media</option>
                <option value="Phone Call">Phone Call</option>
                <option value="Walk-in">Walk-in</option>
                <option value="Other">Other</option>
              </select>
            </div>
            {userRole === 'admin' && (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Expected Value ($)</label>
                  <Input type="number" placeholder="0.00" value={newLead.expectedValue} onChange={(e) => setNewLead({ ...newLead, expectedValue: e.target.value })} className="h-10 rounded-xl text-sm border-slate-200 focus-visible:ring-[#008080]" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Assign to User</label>
                  <select
                    value={newLead.assignedTo}
                    onChange={(e) => setNewLead({ ...newLead, assignedTo: e.target.value })}
                    className="h-10 rounded-xl text-sm border border-slate-200 focus-visible:ring-[#008080] focus-visible:border-[#008080] w-full px-3 bg-white"
                  >
                    <option value="">Unassigned</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                    ))}
                  </select>
                </div>
              </>
            )}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Pipeline</label>
              <select
                value={newLead.pipelineId}
                onChange={(e) => {
                  setNewLead({ ...newLead, pipelineId: e.target.value, stageId: '' });
                }}
                className="h-10 rounded-xl text-sm border border-slate-200 focus-visible:ring-[#008080] focus-visible:border-[#008080] w-full px-3 bg-white"
              >
                <option value="">Select pipeline...</option>
                {pipelines.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Stage</label>
              <select
                value={newLead.stageId}
                onChange={(e) => setNewLead({ ...newLead, stageId: e.target.value })}
                className="h-10 rounded-xl text-sm border border-slate-200 focus-visible:ring-[#008080] focus-visible:border-[#008080] w-full px-3 bg-white"
                disabled={!newLead.pipelineId}
              >
                <option value="">Select stage...</option>
                {availableStages.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <DialogFooter className="pt-4 border-t border-slate-100 flex gap-2">
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)} className="h-10 rounded-xl font-semibold text-xs text-slate-500">Cancel</Button>
              <Button type="submit" className="h-10 bg-[#008080] hover:bg-[#006666] text-white rounded-xl font-bold text-xs px-5 shadow-sm">Create Lead</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 🛠️ MODAL 2: EDIT LEAD / DETAILS INTEGRATION MATRIX */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[620px] rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 max-h-[88vh] overflow-y-auto">
          <DialogHeader className="pb-3 border-b border-slate-100 flex flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#b2d8d8]/30 flex items-center justify-center text-[#008080]">
                <Layers className="w-4 h-4" />
              </div>
              <DialogTitle className="text-base font-black text-[#004c4c]">Lead Overview Panel</DialogTitle>
            </div>
            
            <Button 
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsTaskModalOpen(true)}
              className="text-xs font-bold text-[#006666] bg-[#b2d8d8]/20 border-[#b2d8d8]/40 hover:bg-[#b2d8d8]/40 rounded-xl flex items-center gap-1.5 h-8 mr-6 transition-colors"
            >
              <CheckSquare className="h-3.5 w-3.5 stroke-[2.5]" /> Assign Task
            </Button>
          </DialogHeader>
          
          {editingLead && (
            <div className="space-y-6 pt-4">
              
              {/* Core Attributes Modification Fields */}
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Full Name</label>
                    <Input value={editingLead.name || ''} onChange={(e) => setEditingLead({...editingLead, name: e.target.value})} className="h-10 rounded-xl text-xs font-semibold border-slate-200 focus-visible:ring-[#008080]" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Contact Details</label>
                    <Input value={editingLead.contactInfo || ''} onChange={(e) => setEditingLead({...editingLead, contactInfo: e.target.value})} className="h-10 rounded-xl text-xs font-semibold border-slate-200 focus-visible:ring-[#008080]" />
                  </div>
                </div>

                {userRole === 'admin' ? (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Expected Pipeline Value ($)</label>
                      <Input type="number" value={editingLead.expectedValue || ''} onChange={(e) => setEditingLead({...editingLead, expectedValue: e.target.value})} className="h-10 rounded-xl text-xs font-semibold border-slate-200 focus-visible:ring-[#008080]" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Assign to User</label>
                      <select
                        value={editingLead.assignedTo || ''}
                        onChange={(e) => setEditingLead({...editingLead, assignedTo: e.target.value})}
                        className="h-10 rounded-xl text-sm border border-slate-200 focus-visible:ring-[#008080] focus-visible:border-[#008080] w-full px-3 bg-white"
                      >
                        <option value="">Unassigned</option>
                        {users.map(u => (
                          <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                        ))}
                      </select>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-xs font-medium text-amber-700 bg-amber-50/60 rounded-xl p-3 border border-amber-100/60">
                    <ShieldAlert className="h-4 w-4 shrink-0 text-amber-500" />
                    <span>Pipeline financial variables are strictly administration controlled.</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Pipeline</label>
                    <select
                      value={editingLead.pipelineId || ''}
                      onChange={(e) => {
                        setEditingLead({...editingLead, pipelineId: e.target.value, stageId: ''});
                      }}
                      className="h-10 rounded-xl text-sm border border-slate-200 focus-visible:ring-[#008080] focus-visible:border-[#008080] w-full px-3 bg-white"
                    >
                      <option value="">Select pipeline...</option>
                      {pipelines.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Stage</label>
                    <select
                      value={editingLead.stageId || ''}
                      onChange={(e) => setEditingLead({...editingLead, stageId: e.target.value})}
                      className="h-10 rounded-xl text-sm border border-slate-200 focus-visible:ring-[#008080] focus-visible:border-[#008080] w-full px-3 bg-white"
                      disabled={!editingLead.pipelineId}
                    >
                      <option value="">Select stage...</option>
                      {editAvailableStages.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Status</label>
                    <select
                      value={editingLead.status || 'open'}
                      onChange={(e) => setEditingLead({...editingLead, status: e.target.value})}
                      className="h-10 rounded-xl text-sm border border-slate-200 focus-visible:ring-[#008080] focus-visible:border-[#008080] w-full px-3 bg-white"
                    >
                      <option value="open">Open</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Outcome</label>
                    <select
                      value={editingLead.outcome || ''}
                      onChange={(e) => setEditingLead({...editingLead, outcome: e.target.value})}
                      className="h-10 rounded-xl text-sm border border-slate-200 focus-visible:ring-[#008080] focus-visible:border-[#008080] w-full px-3 bg-white"
                    >
                      <option value="">Not decided</option>
                      <option value="won">Won</option>
                      <option value="lost">Lost</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-2 border-b border-slate-100 pb-4">
                  <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} className="h-9 rounded-xl text-xs font-semibold text-slate-500">Close</Button>
                  <Button type="submit" className="h-9 bg-[#008080] hover:bg-[#006666] text-white font-bold rounded-xl text-xs px-4 shadow-sm transition-colors">Save Field Adjustments</Button>
                </div>
              </form>

              {/* 🟢 INTEGRATED LIVE DATA FEED SUBCOMPONENTS */}
              
              {/* Notebook Handler */}
              <div className="space-y-2 p-3 bg-slate-50/50 border border-slate-100 rounded-xl">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#006666]">Collaborative Workspace Notes</h3>
                <NoteList leadId={editingLead.id || editingLead._id} />
              </div>

              {/* Action Trackers */}
              <div className="space-y-2 p-3 bg-slate-50/50 border border-slate-100 rounded-xl">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#006666]">Assigned Workspace Tasks</h3>
                <TaskList leadId={editingLead.id || editingLead._id} />
              </div>

              {/* Historical Changes Stream */}
              <div className="space-y-2 pt-2">
                <ActivityTimeline leadId={editingLead.id || editingLead._id} />
              </div>

            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ⚡ NESTED ACTION MODAL: TASK CREATION POPUP SYSTEM */}
      {editingLead && (
        <CreateTaskModal 
          isOpen={isTaskModalOpen} 
          onClose={() => setIsTaskModalOpen(false)} 
          leadId={editingLead.id || editingLead._id}
        />
      )}

    </div>
  );
};

export default Leads;