// src/pages/Tasks.jsx
import { useState, useEffect } from 'react';
import api from '@/lib/axios'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Search, Calendar, CheckCircle2, Clock, AlertCircle, Layers } from "lucide-react";
import { toast } from 'sonner';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [leads, setLeads] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal control states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Form states - initializing leadId with 'none' to safely map select tags
  const [newTask, setNewTask] = useState({
    name: '', dueDate: '', priority: 'medium', status: 'pending', leadId: 'none', assignedTo: ''
  });

  const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
  const headers = { Authorization: `Bearer ${token}` };

  // Replace the old fetchData function with this updated version:
const fetchData = async () => {
  setLoading(true);
  try {
    const [tasksRes, leadsRes] = await Promise.all([
      api.get('/tasks', { headers }),
      api.get('/leads', { headers })
    ]);
    
    // 1. Safely extract tasks array
    const extractedTasks = Array.isArray(tasksRes.data) 
      ? tasksRes.data 
      : (tasksRes.data?.data?.rows || tasksRes.data?.data || tasksRes.data?.rows || []);
    setTasks(extractedTasks);

    // 2. Safely extract leads array (matching leads.jsx extraction)
    const extractedLeads = Array.isArray(leadsRes.data) 
      ? leadsRes.data 
      : (leadsRes.data?.data?.rows || leadsRes.data?.data || leadsRes.data?.rows || []);
    setLeads(extractedLeads);

  } catch (err) {
    console.error(err);
    toast.error("Failed to sync structural task definitions");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchData();
  }, []);

  // Filter tasks locally based on search bar and dropdown status state
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.name?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Create Task Submission
  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newTask,
        leadId: newTask.leadId === 'none' ? null : newTask.leadId
      };

      await api.post('/tasks', payload, { headers });
      toast.success("Task initialized smoothly!");
      setIsCreateOpen(false);
      setNewTask({ name: '', dueDate: '', priority: 'medium', status: 'pending', leadId: 'none', assignedTo: '' });
      fetchData();
    } catch (err) {
      toast.error("Failed to dispatch task matrix row");
    }
  };

  // Edit Task Submission
  const handleEditTask = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...editingTask,
        leadId: editingTask.leadId === 'none' ? null : editingTask.leadId
      };

      await api.put(`/tasks/${editingTask.id || editingTask._id}`, payload, { headers });
      toast.success("Task metrics compiled cleanly");
      setIsEditOpen(false);
      fetchData();
    } catch (err) {
      toast.error("Failed to execute database updates");
    }
  };

  // Delete Task entry
  const handleDeleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to drop this task index entry?")) return;
    try {
      await api.delete(`/tasks/${id}`, { headers });
      toast.success("Task wiped from schema");
      fetchData();
    } catch (err) {
      toast.error("Failed to clear database key");
    }
  };

  const openEditModal = (task) => {
    setEditingTask({
      ...task,
      leadId: task.leadId ? String(task.leadId) : 'none',
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''
    });
    setIsEditOpen(true);
  };

  // Helpers for structural badge styles
  const getPriorityColor = (p) => {
    const formatted = p?.toLowerCase();
    if (formatted === 'high') return 'bg-rose-50 text-rose-700 border-rose-200/60';
    if (formatted === 'medium') return 'bg-amber-50 text-amber-700 border-amber-200/60';
    return 'bg-slate-50 text-slate-600 border-slate-200/60';
  };

  const getStatusBadge = (s) => {
    const formatted = s?.toLowerCase();
    if (formatted === 'completed') return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200/60 font-bold capitalize shadow-none">Completed</Badge>;
    if (formatted === 'overdue') return <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200/60 font-bold capitalize shadow-none">Overdue</Badge>;
    return <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200/60 font-bold capitalize shadow-none">Pending</Badge>;
  };

  return (
    <div className="space-y-5 w-full animate-in fade-in duration-200">
      
      {/* 🚀 HEADER SEGMENT */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-1">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#004c4c]">Tasks Workspace</h1>
          <p className="text-slate-400 text-xs font-medium mt-0.5">Assign, balance, and evaluate execution targets across live client rows.</p>
        </div>
        <Button 
          onClick={() => setIsCreateOpen(true)} 
          className="h-9 bg-[#008080] hover:bg-[#006666] text-white rounded-xl shadow-sm font-bold text-xs flex items-center gap-2 transition-all active:scale-[0.98]"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" /> Create Workspace Task
        </Button>
      </div>

      {/* 📊 OVERVIEW ANALYTICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white border-slate-200/60 rounded-2xl shadow-[0_4px_20px_rgba(0,76,76,0.015)]">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-teal-50/70 text-[#008080]"><Clock className="h-4 w-4 stroke-[2.5]" /></div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pending Sequences</p>
              <CardTitle className="text-xl font-black text-[#004c4c] mt-0.5">
                {tasks.filter(t => t.status?.toLowerCase() === 'pending').length}
              </CardTitle>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-slate-200/60 rounded-2xl shadow-[0_4px_20px_rgba(0,76,76,0.015)]">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600"><CheckCircle2 className="h-4 w-4" /></div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Completed Targets</p>
              <CardTitle className="text-xl font-black text-[#004c4c] mt-0.5">
                {tasks.filter(t => t.status?.toLowerCase() === 'completed').length}
              </CardTitle>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200/60 rounded-2xl shadow-[0_4px_20px_rgba(0,76,76,0.015)]">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600"><AlertCircle className="h-4 w-4" /></div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Overdue Lifecycles</p>
              <CardTitle className="text-xl font-black text-[#004c4c] mt-0.5">
                {tasks.filter(t => t.status?.toLowerCase() === 'overdue').length}
              </CardTitle>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 🛠️ FILTER & CONSOLE CONTROLS */}
      <Card className="border border-slate-200/60 bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,76,76,0.015)]">
        <CardHeader className="p-4 border-b border-slate-100 bg-slate-50/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input 
              placeholder="Filter matrix indexes..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="pl-9 h-9 border-slate-200 focus-visible:ring-[#008080] rounded-xl text-xs font-semibold placeholder:text-slate-400" 
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] h-9 rounded-xl text-xs font-bold border-slate-200 text-slate-600 focus:ring-[#008080]">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl text-xs font-semibold">
              <SelectItem value="all" className="focus:bg-[#b2d8d8]/20 focus:text-[#006666]">All States</SelectItem>
              <SelectItem value="pending" className="focus:bg-[#b2d8d8]/20 focus:text-[#006666]">Pending</SelectItem>
              <SelectItem value="completed" className="focus:bg-[#b2d8d8]/20 focus:text-[#006666]">Completed</SelectItem>
              <SelectItem value="overdue" className="focus:bg-[#b2d8d8]/20 focus:text-[#006666]">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>

        {/* 📋 CORE DATA TABLE */}
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="border-b border-slate-100">
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-5 h-10">Task Scope</TableHead>
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-5 h-10">Associated Lead Link</TableHead>
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-5 h-10">Target Deadline</TableHead>
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-5 h-10">Priority</TableHead>
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-5 h-10">State Status</TableHead>
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-5 h-10 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2 text-xs font-semibold text-[#006666]/70">
                        <div className="w-5 h-5 border-2 border-[#b2d8d8] border-t-[#008080] rounded-full animate-spin"></div>
                        Syncing live task sequences...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredTasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-xs font-medium text-slate-400">
                      No active task allocations found matching conditions.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTasks.map((task) => {
                    const linkedLead = leads.find(l => String(l.id || l._id) === String(task.leadId));
                    return (
                      <TableRow key={task.id || task._id} className="border-b border-slate-50 hover:bg-[#b2d8d8]/5 transition-colors">
                        <TableCell className="px-5 py-3 text-xs font-bold text-slate-700">{task.name}</TableCell>
                        <TableCell className="px-5 py-3 text-xs font-medium text-[#006666]">
                          {linkedLead ? linkedLead.name : <span className="text-slate-400">—</span>}
                        </TableCell>
                        <TableCell className="px-5 py-3 text-xs text-slate-500 font-medium">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3 w-3 text-slate-400" />
                            {task.dueDate ? task.dueDate.split('T')[0] : 'No Target'}
                          </span>
                        </TableCell>
                        <TableCell className="px-5 py-3">
                          <Badge variant="outline" className={`capitalize text-[10px] font-bold rounded-md px-2 py-0.5 ${getPriorityColor(task.priority)}`}>
                            {task.priority || 'medium'}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-5 py-3">{getStatusBadge(task.status)}</TableCell>
                        <TableCell className="text-right px-5 py-3">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-[#008080] hover:bg-[#b2d8d8]/15 rounded-lg" onClick={() => openEditModal(task)}>
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg" onClick={() => handleDeleteTask(task.id || task._id)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 📥 MODAL 1: CREATE TASK */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[420px] rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
          <DialogHeader className="pb-3 border-b border-slate-100 flex flex-row items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#b2d8d8]/30 flex items-center justify-center text-[#008080]">
              <Plus className="w-4 h-4 stroke-[3]" />
            </div>
            <DialogTitle className="text-base font-black text-[#004c4c]">Initialize Workspace Task</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateTask} className="space-y-4 pt-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Task Scope / Description</label>
              <Input placeholder="What needs to be done..." required value={newTask.name} onChange={(e) => setNewTask({ ...newTask, name: e.target.value })} className="h-10 rounded-xl text-xs font-semibold border-slate-200 focus-visible:ring-[#008080]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Target Deadline</label>
                <Input type="date" required value={newTask.dueDate} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} className="h-10 rounded-xl text-xs font-semibold border-slate-200 focus-visible:ring-[#008080]" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Priority Level</label>
                <Select value={newTask.priority} onValueChange={(val) => setNewTask({ ...newTask, priority: val })}>
                  <SelectTrigger className="h-10 rounded-xl text-xs font-bold border-slate-200 text-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl text-xs font-semibold">
                    <SelectItem value="low">Low Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Associated Pipeline Lead</label>
              <Select value={newTask.leadId} onValueChange={(val) => setNewTask({ ...newTask, leadId: val })}>
                <SelectTrigger className="h-10 rounded-xl text-xs font-bold border-slate-200 text-slate-700">
                  <SelectValue placeholder="Select context lead record" />
                </SelectTrigger>
                <SelectContent className="rounded-xl text-xs font-semibold max-h-[200px]">
                  <SelectItem value="none">No Lead / Independent Task</SelectItem>
                  {leads.map(lead => (
                    <SelectItem key={lead.id || lead._id} value={String(lead.id || lead._id)}>{lead.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="pt-4 border-t border-slate-100 flex gap-2">
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)} className="h-10 rounded-xl font-semibold text-xs text-slate-500">Cancel</Button>
              <Button type="submit" className="h-10 bg-[#008080] hover:bg-[#006666] text-white rounded-xl font-bold text-xs px-5 shadow-sm">Dispatch Task</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 🛠️ MODAL 2: EDIT TASK */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[420px] rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
          <DialogHeader className="pb-3 border-b border-slate-100 flex flex-row items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#b2d8d8]/30 flex items-center justify-center text-[#008080]">
              <Layers className="w-4 h-4" />
            </div>
            <DialogTitle className="text-base font-black text-[#004c4c]">Modify Task Attributes</DialogTitle>
          </DialogHeader>
          {editingTask && (
            <form onSubmit={handleEditTask} className="space-y-4 pt-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Task Scope / Description</label>
                <Input required value={editingTask.name || ''} onChange={(e) => setEditingTask({ ...editingTask, name: e.target.value })} className="h-10 rounded-xl text-xs font-semibold border-slate-200 focus-visible:ring-[#008080]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Target Deadline</label>
                  <Input type="date" required value={editingTask.dueDate || ''} onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })} className="h-10 rounded-xl text-xs font-semibold border-slate-200 focus-visible:ring-[#008080]" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Priority Level</label>
                  <Select value={editingTask.priority || 'medium'} onValueChange={(val) => setEditingTask({ ...editingTask, priority: val })}>
                    <SelectTrigger className="h-10 rounded-xl text-xs font-bold border-slate-200 text-slate-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl text-xs font-semibold">
                      <SelectItem value="low">Low Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="high">High Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">State Status</label>
                  <Select value={editingTask.status || 'pending'} onValueChange={(val) => setEditingTask({ ...editingTask, status: val })}>
                    <SelectTrigger className="h-10 rounded-xl text-xs font-bold border-slate-200 text-slate-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl text-xs font-semibold">
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Pipeline Lead Link</label>
                  <Select value={editingTask.leadId} onValueChange={(val) => setEditingTask({ ...editingTask, leadId: val })}>
                    <SelectTrigger className="h-10 rounded-xl text-xs font-bold border-slate-200 text-slate-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl text-xs font-semibold max-h-[160px]">
                      <SelectItem value="none">No Lead Context</SelectItem>
                      {leads.map(lead => (
                        <SelectItem key={lead.id || lead._id} value={String(lead.id || lead._id)}>{lead.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter className="pt-4 border-t border-slate-100 flex gap-2">
                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} className="h-10 rounded-xl font-semibold text-xs text-slate-500">Close</Button>
                <Button type="submit" className="h-10 bg-[#008080] hover:bg-[#006666] text-white rounded-xl font-bold text-xs px-4 shadow-sm">Save Metrics</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default Tasks;