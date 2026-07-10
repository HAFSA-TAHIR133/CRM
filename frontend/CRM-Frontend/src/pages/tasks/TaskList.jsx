import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, CheckCircle, CalendarDays, ClipboardList } from 'lucide-react';
import { toast } from 'sonner';
import CreateTaskModal from './CreateTaskModal';

const TaskList = ({ leadId }) => {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
      const res = await api.get('/tasks', {
        params: { leadId },
        headers: { Authorization: `Bearer ${token}` }
      });

      setTasks(Array.isArray(res.data) ? res.data : (res.data?.data || []));
    } catch (err) {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (leadId) fetchTasks();
  }, [leadId]);

  const completeTask = async (id) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
      await api.put(`/tasks/${id}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Task marked as completed");
      fetchTasks();
    } catch (err) {
      toast.error("Failed to complete task");
    }
  };

  // Helper utility to style operational priority badges beautifully
  const getPriorityStyles = (priority) => {
    const formatted = priority?.toLowerCase();
    if (formatted === 'high') {
      return "bg-rose-50 text-rose-600 border border-rose-200/60 hover:bg-rose-50 shadow-none";
    }
    if (formatted === 'medium') {
      return "bg-amber-50 text-amber-700 border border-amber-200/60 hover:bg-amber-50 shadow-none";
    }
    return "bg-slate-50 text-slate-600 border border-slate-200/60 hover:bg-slate-50 shadow-none";
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      
      {/* 📊 Action Control Bar */}
      <div className="flex justify-between items-center px-1">
        <div>
          <h3 className="text-base font-bold flex items-center gap-2 text-[#004c4c]">
            <ClipboardList className="h-4 w-4 text-[#008080]" />
            Tasks & Milestones
          </h3>
          <p className="text-[11px] font-medium text-slate-400 mt-0.5">Action items assigned to this lead pipeline</p>
        </div>
        <Button 
          size="sm" 
          onClick={() => setShowModal(true)}
          className="h-8 bg-[#008080] hover:bg-[#006666] text-white rounded-xl text-xs font-bold shadow-sm active:scale-[0.98] transition-all"
        >
          <Plus className="mr-1.5 h-3.5 w-3.5 stroke-[2.5]" /> Add Task
        </Button>
      </div>

      {/* 🗂️ Task Rows Canvas Card */}
      <Card className="border border-slate-200/60 bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,76,76,0.015)]">
        <CardContent className="p-4 space-y-2.5">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-10 text-xs font-semibold text-[#006666]/70 tracking-wide">
              <div className="w-4 h-4 border-2 border-[#b2d8d8] border-t-[#008080] rounded-full animate-spin"></div>
              <span>Fetching assignment matrix...</span>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-12 text-xs font-semibold text-slate-400 select-none">
              No tasks currently pending. Create one above to get started.
            </div>
          ) : (
            tasks.map(task => {
              const isComplete = task.status?.toLowerCase() === 'completed';
              return (
                <div 
                  key={task.id} 
                  className={`p-3.5 rounded-xl border border-slate-100 flex items-start justify-between transition-all duration-200 ${
                    isComplete 
                      ? 'opacity-60 bg-slate-50/80 border-slate-200/40' 
                      : 'hover:shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:border-slate-200/80 bg-white'
                  }`}
                >
                  {/* Left Column Data Content */}
                  <div className="flex-1 pr-4">
                    <p className={`text-xs font-bold leading-tight ${
                      isComplete ? 'line-through text-slate-400 font-medium' : 'text-slate-800'
                    }`}>
                      {task.name || task.title}
                    </p>
                    {task.description && (
                      <p className="text-[11px] font-medium text-slate-500 mt-1 whitespace-pre-wrap leading-relaxed">
                        {task.description}
                      </p>
                    )}
                    {task.dueDate && (
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 mt-2">
                        <CalendarDays className="h-3 w-3 stroke-[2]" />
                        <span>Due {new Date(task.dueDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}</span>
                      </div>
                    )}
                  </div>

                  {/* Right Column Badge Actions */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <Badge className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${getPriorityStyles(task.priority)}`}>
                      {task.priority || 'Medium'}
                    </Badge>
                    
                    {!isComplete && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => completeTask(task.id)}
                        className="h-7 w-7 rounded-lg hover:bg-emerald-50 text-slate-300 hover:text-emerald-600 transition-colors group"
                      >
                        <CheckCircle className="h-4 w-4 stroke-[2] group-hover:scale-105 transition-transform" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/*  Unified Create Task Trigger Context */}
      <CreateTaskModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        leadId={leadId} 
        onSuccess={fetchTasks} 
      />
    </div>
  );
};

export default TaskList;