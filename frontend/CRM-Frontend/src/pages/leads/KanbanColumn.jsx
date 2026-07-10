import { useDroppable } from "@dnd-kit/core";

export default function KanbanColumn({ id, children }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const userRole = (localStorage.getItem('role') || 'user').toLowerCase();

  return (
    <div 
      ref={setNodeRef} 
      className={`
        min-h-[500px] rounded-2xl p-3 transition-all duration-300 ease-in-out
        /* Base Default State: Soft off-white backdrop with elegant teal-tinted micro shadows */
        bg-white border border-slate-200/60 shadow-[0_4px_20px_rgba(0,76,76,0.02)]
        
        ${isOver 
          ? userRole === 'admin' 
            /* Admin Drop State: Using #b2d8d8 (lightest teal) with your brand color for the border */
            ? "bg-[#b2d8d8]/20 border-2 border-dashed border-[#008080] scale-[1.01] shadow-lg shadow-[#004c4c]/5" 
            /* Employee Drop State: Soft alternative state */
            : "bg-slate-100/80 border-2 border-dashed border-slate-300 scale-[1.01]" 
          : ""
        }
      `}
    >
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}