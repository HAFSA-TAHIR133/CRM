import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { Card, CardContent } from '@/components/ui/card';
import { History, User2 } from 'lucide-react';
import { toast } from 'sonner';

const ActivityTimeline = ({ leadId }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      if (!leadId) return;
      setLoading(true);
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
        const res = await api.get('/activities', {
          params: { leadId },
          headers: { Authorization: `Bearer ${token}` }
        });
        setActivities(Array.isArray(res.data) ? res.data : (res.data?.data || []));
      } catch (err) {
        toast.error("Failed to load activity history");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [leadId]);

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      
      {/* 📊 Section Header Title */}
      <div className="px-1">
        <h3 className="text-base font-bold flex items-center gap-2 text-[#004c4c]">
          <History className="h-4 w-4 text-[#008080]" />
          Activity Timeline
        </h3>
        <p className="text-[11px] font-medium text-slate-400 mt-0.5">
          Complete structural history of pipeline alterations and updates for this lead
        </p>
      </div>

      {/* 🎞️ Vertical Timeline Container Canvas */}
      <Card className="border border-slate-200/60 bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,76,76,0.015)]">
        <CardContent className="p-5">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-10 text-xs font-semibold text-[#006666]/70 tracking-wide">
              <div className="w-4 h-4 border-2 border-[#b2d8d8] border-t-[#008080] rounded-full animate-spin"></div>
              <span>Reconstructing audit history...</span>
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-12 text-xs font-semibold text-slate-400 select-none">
              No audit logs captured. Pipeline initialization crisp and clean.
            </div>
          ) : (
            /* Vertical Guide Track Line */
            <div className="relative pl-5 border-l-2 border-slate-100/80 space-y-5 ml-2.5">
              {activities.map((act, idx) => (
                <div key={act.id || idx} className="relative group animate-in slide-in-from-bottom-2 duration-200">
                  
                  {/* 📍 Active Indicator Timeline Node Pin */}
                  <div className="absolute -left-[27px] top-1 h-3.5 w-3.5 rounded-full bg-white border-[3px] border-[#008080] shadow-sm transition-transform group-hover:scale-110 z-10" />
                  
                  {/* 📝 Log Frame Text Block */}
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-800 leading-none">
                      {act.action}
                    </div>
                    
                    {act.description && (
                      <p className="text-[11px] font-medium text-slate-500 whitespace-pre-wrap leading-relaxed">
                        {act.description}
                      </p>
                    )}
                    
                    {/* 🕒 Meta Timestamp Badge & User Identification */}
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 pt-0.5">
                      <span>
                        {new Date(act.createdAt).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      {act.user?.name && (
                        <div className="flex items-center gap-1 text-slate-500 font-bold bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                          <User2 className="w-2.5 h-2.5 text-slate-400" />
                          <span>{act.user.name}</span>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityTimeline;