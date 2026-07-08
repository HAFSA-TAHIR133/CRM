import { useState, useEffect } from 'react';
import api from '@/lib/axios'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, LayoutGrid, List, Search } from "lucide-react";
import { toast } from 'sonner';
import LeadKanban from "./LeadKanban"; 

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table'); 

  // Edit Modal States
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  // New Lead Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newLead, setNewLead] = useState({
    name: "",
    contactInfo: "",
    leadSource: "",
    expectedValue: "",
    status: "open",
    outcome: "",
    assignedTo: "",
    pipelineId: "",
    stageId: ""
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/leads', {
        params: { search: debouncedSearch },
        headers: { Authorization: `Bearer ${token}` }
      });
      const extractedLeads = Array.isArray(res.data) 
        ? res.data 
        : (res.data?.data?.rows || res.data?.data || res.data?.rows || []);
      setLeads(extractedLeads);
    } catch (err) {
      toast.error("Failed to load leads");
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
      const token = localStorage.getItem("token");
      await api.post("/leads", newLead, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Lead Created");
      setIsCreateOpen(false);
      // Reset form
      setNewLead({
        name: "", contactInfo: "", leadSource: "", expectedValue: "",
        status: "open", outcome: "", assignedTo: "", pipelineId: "", stageId: ""
      });
      fetchLeads();
    } catch (err) {
      toast.error("Failed to create lead");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await api.put(`/leads/${editingLead.id || editingLead._id}`, editingLead, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Lead updated successfully");
      setIsEditOpen(false);
      fetchLeads();
    } catch (err) {
      toast.error("Failed to update lead");
    }
  };

  const deleteLead = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/leads/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Lead deleted successfully');
      fetchLeads();
    } catch (err) {
      toast.error('Failed to delete lead');
    }
  };

  return (
    <div className="p-6 space-y-6 min-h-screen bg-slate-50/50">
      
      {/* 1. TOP BAR HEADER AREA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-teal-950">
            Leads Management
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Track, filter, and manage your sales pipeline seamlessly.
          </p>
        </div>
        
        {/* Actions Segment */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Layout Controls */}
          <div className="flex border border-slate-200 rounded-xl p-1 bg-white shadow-sm">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setViewMode('table')}
              className={`rounded-lg h-8 transition-all text-xs font-semibold ${
                viewMode === 'table' 
                  ? 'bg-teal-50 text-teal-700 hover:bg-teal-50 hover:text-teal-700' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="h-3.5 w-3.5 mr-1.5" /> List
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setViewMode('kanban')}
              className={`rounded-lg h-8 transition-all text-xs font-semibold ${
                viewMode === 'kanban' 
                  ? 'bg-teal-50 text-teal-700 hover:bg-teal-50 hover:text-teal-700' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5 mr-1.5" /> Kanban
            </Button>
          </div>

          {/* Add Action Callout */}
          <Button 
            onClick={() => setIsCreateOpen(true)}
            className="h-10 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-medium text-sm transition-all shadow-[0_4px_12px_rgba(13,148,136,0.15)] flex items-center gap-2"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" /> Add New Lead
          </Button>
        </div>
      </div>

      {/* 2. MAIN DATA RENDER INTERFACE */}
      {viewMode === 'kanban' ? (
        <Card className="border border-slate-200/80 bg-white rounded-2xl shadow-sm p-6 overflow-x-auto">
          <LeadKanban leads={leads} setLeads={setLeads} fetchLeads={fetchLeads} />
        </Card>
      ) : (
        <Card className="border border-slate-200/80 bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Card Header Filter Section */}
          <CardHeader className="p-5 border-b border-slate-100 bg-slate-50/40">
            <div className="relative max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search leads by name, source..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-10 border-slate-200 rounded-xl bg-white text-slate-900 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:border-teal-600 placeholder:text-slate-400 text-sm shadow-inner"
              />
            </div>
          </CardHeader>

          {/* Table Implementation */}
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/70">
                  <TableRow className="border-b border-slate-100 hover:bg-transparent">
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 h-11 px-5">Name</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 h-11 px-5">Contact Details</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 h-11 px-5">Source</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 h-11 px-5">Value</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 h-11 px-5">Stage</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 h-11 px-5">Status</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 h-11 px-5 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-16 text-sm text-slate-400 font-medium">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                          Loading pipeline leads...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : leads.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-16 text-sm text-slate-400 font-medium">
                        No pipeline records match your search filter.
                      </TableCell>
                    </TableRow>
                  ) : (
                    leads.map((lead) => (
                      <TableRow key={lead.id || lead._id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/40 transition-colors">
                        <TableCell className="font-semibold text-slate-900 px-5 py-3.5 text-sm">{lead.name}</TableCell>
                        <TableCell className="text-slate-600 px-5 py-3.5 text-sm">{lead.contactInfo || "—"}</TableCell>
                        <TableCell className="text-slate-600 px-5 py-3.5 text-sm">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                            {lead.leadSource || "Direct"}
                          </span>
                        </TableCell>
                        <TableCell className="font-medium text-slate-900 px-5 py-3.5 text-sm">
                          ${Number(lead.expectedValue || 0).toLocaleString()}
                        </TableCell>

                        {/* Styled Pipelines Badge */}
                        <TableCell className="px-5 py-3.5">
                          <Badge 
                            variant="secondary"
                            className="rounded-full px-3 py-0.5 text-[11px] font-semibold border-0 tracking-wide"
                            style={{ 
                              backgroundColor: lead.stage?.color ? `${lead.stage.color}15` : '#f1f5f9', 
                              color: lead.stage?.color || '#475569'
                            }} 
                          >
                            <span 
                              className="w-1.5 h-1.5 rounded-full mr-1.5 shrink-0 inline-block"
                              style={{ backgroundColor: lead.stage?.color || '#94a3b8' }}
                            />
                            {lead.stage?.name || `Stage ${lead.stageId}`}
                          </Badge>
                        </TableCell>

                        {/* System Status Indicators */}
                        <TableCell className="px-5 py-3.5">
                          <Badge 
                            className={`capitalize rounded-lg px-2.5 py-0.5 text-xs font-semibold shadow-none border ${
                              lead.status === 'won' || lead.status === 'active'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                                : lead.status === 'lost'
                                ? 'bg-rose-50 text-rose-700 border-rose-200/60'
                                : 'bg-teal-50 text-teal-700 border-teal-200/60'
                            }`}
                          >
                            {lead.status || "open"}
                          </Badge>
                        </TableCell>
                        
                        {/* Table Operations */}
                        <TableCell className="text-right px-5 py-3.5">
                          <div className="flex justify-end gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors" 
                              onClick={() => openEditModal(lead)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" 
                              onClick={() => deleteLead(lead.id || lead._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
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

      {/* ========================================================= */}
      {/* 3. NEW LEAD MODAL DIALOG (PLACED CORRECTLY HERE)         */}
      {/* ========================================================= */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl border border-slate-100 bg-white shadow-2xl p-6">
          <DialogHeader className="pb-2 border-b border-slate-100">
            <DialogTitle className="text-lg font-bold text-teal-950">
              Create New Lead
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateLead} className="space-y-4 pt-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Name</label>
              <Input
                placeholder="Name"
                value={newLead.name}
                onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                className="h-10 border-slate-200 rounded-xl focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:border-teal-600 bg-slate-50/30 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Contact Details</label>
              <Input
                placeholder="Contact"
                value={newLead.contactInfo}
                onChange={(e) => setNewLead({ ...newLead, contactInfo: e.target.value })}
                className="h-10 border-slate-200 rounded-xl focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:border-teal-600 bg-slate-50/30 text-sm"
              />
            </div>
            <DialogFooter className="pt-4 border-t border-slate-100 flex gap-2 sm:gap-0">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsCreateOpen(false)}
                className="h-10 border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </Button>
              <Button type="submit" className="h-10 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold transition-all px-5 shadow-sm">
                Create Lead
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 4. POP-UP DIALOG EDIT MODAL WINDOW */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl border border-slate-100 bg-white shadow-2xl p-6">
          <DialogHeader className="pb-2 border-b border-slate-100">
            <DialogTitle className="text-lg font-bold text-teal-950">
              Modify Lead Details
            </DialogTitle>
          </DialogHeader>
          
          {editingLead && (
            <form onSubmit={handleEditSubmit} className="space-y-4 pt-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Full Name</label>
                <Input 
                  value={editingLead.name || ''} 
                  onChange={(e) => setEditingLead({...editingLead, name: e.target.value})} 
                  className="h-10 border-slate-200 rounded-xl focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:border-teal-600 bg-slate-50/30 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Contact Details</label>
                <Input 
                  value={editingLead.contactInfo || ''} 
                  onChange={(e) => setEditingLead({...editingLead, contactInfo: e.target.value})} 
                  className="h-10 border-slate-200 rounded-xl focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:border-teal-600 bg-slate-50/30 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Expected Pipeline Value ($)</label>
                <Input 
                  type="number"
                  value={editingLead.expectedValue || ''} 
                  onChange={(e) => setEditingLead({...editingLead, expectedValue: e.target.value})} 
                  className="h-10 border-slate-200 rounded-xl focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:border-teal-600 bg-slate-50/30 text-sm"
                />
              </div>
              
              <DialogFooter className="pt-4 border-t border-slate-100 flex gap-2 sm:gap-0">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditOpen(false)}
                  className="h-10 border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="h-10 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold transition-all px-5 shadow-sm"
                >
                  Save Updates
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Leads;