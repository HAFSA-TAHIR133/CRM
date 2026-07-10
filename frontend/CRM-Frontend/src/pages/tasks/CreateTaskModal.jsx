import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { CheckSquare, Calendar, AlertCircle } from 'lucide-react';

const CreateTaskModal = ({ open, isOpen, onClose, leadId, onSuccess }) => {
  // Sync wrapper prop inconsistencies cleanly
  const isModalOpen = open || isOpen;
  
  const userRole = (localStorage.getItem('role') || 'user').toLowerCase();
  const currentUserId = localStorage.getItem('userId');

  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    assignedTo: userRole === 'admin' ? '' : currentUserId
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error("Title is required");

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
      const { title, priority, dueDate, assignedTo } = form;
      await api.post('/tasks', {
        name: title,
        priority: priority.toLowerCase(),
        dueDate,
        assignedTo,
        leadId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Task created successfully!");
      if (onSuccess) onSuccess();
      onClose();

      // Reset form setup
      setForm({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        assignedTo: userRole === 'admin' ? '' : currentUserId
      });
    } catch (err) {
      toast.error("Failed to create task");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        
        {/* 🏷️ Header Configuration */}
        <DialogHeader className="pb-3 border-b border-slate-100 flex flex-row items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#b2d8d8]/30 flex items-center justify-center text-[#008080]">
            <CheckSquare className="w-4 h-4 stroke-[2.5]" />
          </div>
          <DialogTitle className="text-base font-black text-[#004c4c]">Create New Task</DialogTitle>
        </DialogHeader>

        {/* 📝 Task Entry Fields */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-3">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Task Title</label>
            <Input
              placeholder="e.g., Follow-up call with client"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="h-10 rounded-xl text-xs font-semibold border-slate-200 focus-visible:ring-[#008080] focus-visible:border-[#008080]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Description</label>
            <Textarea
              placeholder="Details about the project or operational objective..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="min-h-[70px] resize-none text-xs font-semibold border-slate-200 focus-visible:ring-[#008080] rounded-xl placeholder:text-slate-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Priority Selector dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-slate-400" /> Priority
              </label>
              <Select value={form.priority} onValueChange={(val) => setForm({ ...form, priority: val })}>
                <SelectTrigger className="h-10 rounded-xl text-xs font-bold border-slate-200 text-slate-700 focus:ring-[#008080]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl bg-white border border-slate-100 text-xs font-semibold">
                  <SelectItem value="low" className="focus:bg-[#b2d8d8]/20 focus:text-[#006666]">Low</SelectItem>
                  <SelectItem value="medium" className="focus:bg-[#b2d8d8]/20 focus:text-[#006666]">Medium</SelectItem>
                  <SelectItem value="high" className="focus:bg-[#b2d8d8]/20 focus:text-[#006666]">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Native Date Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" /> Due Date
              </label>
              <Input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="h-10 rounded-xl text-xs font-bold border-slate-200 text-slate-600 focus-visible:ring-[#008080]"
              />
            </div>
          </div>

          {/* 🔘 Dynamic Actions Trigger Footer */}
          <DialogFooter className="pt-4 border-t border-slate-100 flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="h-10 rounded-xl font-semibold text-xs text-slate-500"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={submitting}
              className="h-10 bg-[#008080] hover:bg-[#006666] text-white rounded-xl font-bold text-xs px-5 shadow-sm transition-colors active:scale-[0.98]"
            >
              {submitting ? "Processing..." : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskModal;