import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const SortableLeadCard = ({ lead }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lead.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-4 rounded-xl shadow-sm border border-slate-200/60 hover:border-[#008080]/30 cursor-grab active:cursor-grabbing transition-all"
    >
      <h4 className="font-bold text-[#004c4c] text-sm mb-1">{lead.name}</h4>
      <p className="text-xs text-slate-500 mb-3">Contact: {lead.contactInfo || 'N/A'}</p>
      <div className="flex justify-between items-center pt-2 border-t border-slate-100">
        <span className="text-sm font-bold text-[#008080]">
          ${Number(lead.expectedValue || 0).toLocaleString()}
        </span>
        {lead.assignedUser && (
          <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">
            {lead.assignedUser.name}
          </span>
        )}
      </div>
    </div>
  );
};

const Pipeline = () => {
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
        console.error(err);
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
        console.error(err);
        toast.error("Failed to load pipeline data");
      } finally {
        setLoading(false);
      }
    };
    fetchKanban();
  }, [selectedPipelineId]);

  const stages = kanbanData?.stages?.sort((a, b) => a.order - b.order) || [];

  // Filter leads for regular users
  const getLeadsForStage = (stage) => {
    if (!stage.leads) return [];
    if (userRole === 'admin') return stage.leads;
    return stage.leads.filter(lead =>
      !lead.assignedTo || String(lead.assignedTo) === String(currentUserId)
    );
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const leadId = active.id;
    const overId = over.id;

    // Determine target stage ID
    let newStageId = null;
    const overStr = String(overId);
    
    // If dropped on a column
    const targetStage = stages.find(s => String(s.id) === overStr);
    if (targetStage) {
      newStageId = targetStage.id;
    } else {
      // Check if dropped on a lead card - get its stage
      for (const stage of stages) {
        const found = (stage.leads || []).find(l => String(l.id) === overStr);
        if (found) {
          newStageId = stage.id;
          break;
        }
      }
    }

    if (!newStageId) return;

    // Find the dragged lead
    let draggedLead = null;
    for (const stage of stages) {
      const found = (stage.leads || []).find(l => String(l.id) === String(leadId));
      if (found) {
        draggedLead = found;
        break;
      }
    }

    if (!draggedLead) return;
    if (parseInt(draggedLead.stageId, 10) === newStageId) return;

    try {
      await api.patch('/pipelines/leads/' + leadId + '/stage', { leadId, stageId: newStageId });
      toast.success("Lead moved successfully");
      fetchKanban();
    } catch (err) {
      toast.error("Failed to move lead");
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

  return (
    <div className="p-1 md:p-4 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-[#004c4c]">Pipeline Board</h1>
          <p className="text-slate-500 font-medium text-sm mt-0.5">Drag and drop leads between stages</p>
        </div>

        {/* Pipeline Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Pipeline:</label>
          <div className="flex gap-1 flex-wrap">
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
      </div>

      {pipelines.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <p className="text-lg font-medium">No pipelines configured</p>
          <p className="text-sm mt-1">Ask an admin to create a pipeline first</p>
        </div>
      ) : stages.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <p className="text-lg font-medium">No stages in this pipeline</p>
          <p className="text-sm mt-1">Ask an admin to add stages</p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 items-start">
            {stages.map((stage) => {
              const stageLeads = getLeadsForStage(stage);
              return (
                <div
                  key={stage.id}
                  id={`stage-${stage.id}`}
                  className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,76,76,0.015)] flex flex-col"
                >
                  <div className="flex items-center justify-between mb-4 px-1">
                    <h3 className="font-bold text-[#004c4c] text-sm tracking-tight flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: stage.color || '#3b82f6' }}
                      />
                      {stage.name}
                    </h3>
                    <span className="text-xs bg-[#b2d8d8]/20 border border-[#b2d8d8]/40 px-2.5 py-0.5 rounded-full font-bold text-[#006666]">
                      {stageLeads.length}
                    </span>
                  </div>

                  <SortableContext
                    items={stageLeads.map((l) => l.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3 min-h-[400px] w-full">
                      {stageLeads.length === 0 ? (
                        <div className="flex items-center justify-center h-[200px] text-center px-4 text-xs font-semibold text-slate-400 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50 select-none tracking-wide">
                          No items • Drop here
                        </div>
                      ) : (
                        stageLeads.map((lead) => (
                          <SortableLeadCard key={lead.id} lead={lead} />
                        ))
                      )}
                    </div>
                  </SortableContext>
                </div>
              );
            })}
          </div>
        </DndContext>
      )}
    </div>
  );
};

export default Pipeline;