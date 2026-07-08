import { DndContext, closestCorners } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import api from '@/lib/axios';
import KanbanColumn from "./KanbanColumn";
import LeadCard from "./LeadCard";
import { toast } from "sonner";

const columns = [
  { id: 1, title: "New Leads", code: "NEW" },
  { id: 2, title: "Contacted", code: "CONTACTED" },
  { id: 3, title: "Qualified", code: "QUALIFIED" },
  { id: 4, title: "Converted", code: "CONVERTED" }
];

export default function LeadKanban({ leads, setLeads, fetchLeads }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(leads);
  }, [leads]);

  async function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;

    const leadId = active.id;
    const newStageId = parseInt(over.id);

    const draggedLead = items.find(({ id }) => id === leadId);
    if (draggedLead && draggedLead.stageId === newStageId) return;

    const updated = items.map(lead => 
      lead.id === leadId ? { ...lead, stageId: newStageId } : lead
    );
    setItems(updated);
    if (setLeads) setLeads(updated);

    try {
      const token = localStorage.getItem('token');
      await api.put(`/leads/${leadId}`, 
        { stageId: newStageId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Lead pipeline updated");
      if (fetchLeads) fetchLeads();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save changes");
      setItems(leads);
    }
  }

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      {/* Removed excess background padding/borders here to stop double scrollbars */}
      <div className="flex gap-4 items-start w-full select-none">
        {columns.map(column => {
          const filteredLeads = items.filter(lead => parseInt(lead.stageId) === column.id);

          return (
            /* Let KanbanColumn handle the main card column container style structure */
            <KanbanColumn 
              key={column.id} 
              id={column.id.toString()} 
              title={column.title}
            >
              <SortableContext
                items={filteredLeads.map(item => item.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex flex-col gap-3 min-h-[450px] pt-1">
                  {filteredLeads.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center py-12 px-4 text-xs text-slate-400 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 h-32 my-auto">
                      <p className="font-medium text-slate-500">No records here</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Drag a card inside to update</p>
                    </div>
                  ) : (
                    filteredLeads.map(lead => (
                      <div 
                        key={lead.id} 
                        className="transition-all duration-200 active:scale-[1.02] active:rotate-[0.5deg]"
                      >
                        <LeadCard lead={lead} />
                      </div>
                    ))
                  )}
                </div>
              </SortableContext>
            </KanbanColumn>
          );
        })}
      </div>
    </DndContext>
  );
}