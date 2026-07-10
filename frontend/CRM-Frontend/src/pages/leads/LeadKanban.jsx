import { DndContext, closestCorners, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useEffect, useState, useMemo } from "react";
import api from '@/lib/axios';
import KanbanColumn from "./KanbanColumn";
import LeadCard from "./LeadCard";
import { toast } from "sonner";
import { Button } from '@/components/ui/button';

export default function LeadKanban({ leads = [], setLeads, fetchLeads }) {
  const [pipelines, setPipelines] = useState([]);
  const [selectedPipelineId, setSelectedPipelineId] = useState(null);
  const [kanbanData, setKanbanData] = useState(null);
  const [loading, setLoading] = useState(true);

  const userRole = (localStorage.getItem('role') || 'user').toLowerCase();
  const currentUserId = localStorage.getItem('userId');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  // Fetch all pipelines for the selector
  useEffect(() => {
    const fetchPipelines = async () => {
      try {
        const res = await api.get('/pipelines');
        const data = res.data.data || [];
        setPipelines(data);
        if (data.length > 0 && !selectedPipelineId) {
          setSelectedPipelineId(data[0].id);
        }
      } catch (err) {
        toast.error("Failed to load pipelines");
      }
    };
    fetchPipelines();
  }, []);

  // Fetch kanban data for selected pipeline
  useEffect(() => {
    if (!selectedPipelineId) {
      setLoading(false);
      return;
    }
    const fetchKanban = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/pipelines/${selectedPipelineId}/kanban`);
        setKanbanData(res.data.data);
      } catch (err) {
        toast.error("Failed to load kanban data");
      } finally {
        setLoading(false);
      }
    };
    fetchKanban();
  }, [selectedPipelineId]);

  // Columns derived from kanban data stages
  const columns = useMemo(() => {
    if (!kanbanData?.stages) return [];
    return kanbanData.stages.sort((a, b) => a.order - b.order);
  }, [kanbanData]);

  // Filter leads based on user role
  const filteredLeads = useMemo(() => {
    if (!Array.isArray(leads)) return [];
    if (userRole === 'admin') return leads;
    // For regular users, only show leads assigned to them
    return leads.filter(lead => 
      !lead.assignedTo || String(lead.assignedTo) === String(currentUserId)
    );
  }, [leads, userRole, currentUserId]);

  const getLeadsForStage = (stageId) => {
    return filteredLeads.filter(lead => parseInt(lead.stageId, 10) === parseInt(stageId, 10));
  };

  const canMoveLead = (lead) =>
    userRole === 'admin' ||
    !lead.assignedTo ||
    String(lead.assignedTo) === String(currentUserId);

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const leadId = active.id;
    const overId = over.id;

    // Determine the target stage ID
    let newStageId = null;
    const overStr = String(overId);
    
    if (overStr.startsWith('stage-')) {
      newStageId = parseInt(overStr.replace('stage-', ''), 10);
    } else {
      // Check if over is a column
      const col = columns.find(c => String(c.id) === overStr);
      if (col) {
        newStageId = col.id;
      } else {
        // Over is a lead card - find its stage
        const overLead = filteredLeads.find(l => String(l.id) === overStr);
        newStageId = overLead ? parseInt(overLead.stageId, 10) : null;
      }
    }

    const draggedLead = filteredLeads.find(l => String(l.id) === String(leadId));
    if (!draggedLead || !newStageId) return;
    if (parseInt(draggedLead.stageId, 10) === newStageId) return;

    if (!canMoveLead(draggedLead)) {
      toast.error("You can only move leads assigned to you.");
      return;
    }

    // Optimistic update
    const updated = leads.map(lead =>
      String(lead.id) === String(leadId) ? { ...lead, stageId: newStageId } : lead
    );
    if (setLeads) setLeads(updated);

    try {
      await api.patch(`/pipelines/leads/${leadId}/stage`, { leadId, stageId: newStageId });
      toast.success("Lead moved successfully");
      if (fetchLeads) fetchLeads();
    } catch (err) {
      toast.error("Failed to update stage");
      if (fetchLeads) fetchLeads(); // Revert by refetching
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-[#006666]/70">
        <div className="w-5 h-5 border-2 border-[#b2d8d8] border-t-[#008080] rounded-full animate-spin mr-2" />
        Loading pipeline...
      </div>
    );
  }

  if (pipelines.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400">
        <p className="text-lg font-medium">No pipelines configured</p>
        <p className="text-sm mt-1">Ask an admin to create a pipeline first</p>
      </div>
    );
  }

  return (
    <div>
      {/* Pipeline Selector */}
      <div className="flex items-center gap-3 mb-6">
        <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Pipeline:</label>
        <div className="flex gap-2 flex-wrap">
          {pipelines.map(p => (
            <Button
              key={p.id}
              variant={selectedPipelineId === p.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPipelineId(p.id)}
              className={`rounded-xl text-xs font-bold px-4 ${
                selectedPipelineId === p.id
                  ? 'bg-[#008080] hover:bg-[#006666] text-white'
                  : 'border-slate-200 text-slate-600 hover:border-[#008080] hover:text-[#008080]'
              }`}
            >
              {p.name}
            </Button>
          ))}
        </div>
      </div>

      {columns.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <p className="text-lg font-medium">No stages in this pipeline</p>
          <p className="text-sm mt-1">Ask an admin to add stages</p>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 items-start p-1 animate-in fade-in duration-300">
            {columns.map((col) => {
              const columnLeads = getLeadsForStage(col.id);

              return (
                <div
                  key={col.id}
                  className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,76,76,0.015)] flex flex-col"
                >
                  <div className="flex items-center justify-between mb-4 px-1">
                    <div className="font-bold text-[#004c4c] text-sm tracking-tight flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: col.color || '#3b82f6' }}
                      />
                      {col.name}
                    </div>
                    <div className="text-xs bg-[#b2d8d8]/20 border border-[#b2d8d8]/40 px-2.5 py-0.5 rounded-full font-bold text-[#006666]">
                      {columnLeads.length}
                    </div>
                  </div>

                  <KanbanColumn id={`stage-${col.id}`}>
                    <SortableContext items={columnLeads.map((l) => l.id)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-3 min-h-[450px] w-full">
                        {columnLeads.length === 0 ? (
                          <div className="flex items-center justify-center h-[200px] text-center px-4 text-xs font-semibold text-slate-400 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50 select-none tracking-wide">
                            No items • Drop here
                          </div>
                        ) : (
                          columnLeads.map((lead) => (
                            <LeadCard key={lead.id} lead={lead} />
                          ))
                        )}
                      </div>
                    </SortableContext>
                  </KanbanColumn>
                </div>
              );
            })}
          </div>
        </DndContext>
      )}
    </div>
  );
}