import { useDraggable } from "@dnd-kit/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowUpRight, Lock } from "lucide-react";

export default function LeadCard({ lead }) {
  const userRole = (localStorage.getItem('role') || 'user').toLowerCase();
  const currentUserId = localStorage.getItem('userId');

  const canManageLead =
    userRole === 'admin' ||
    !lead.assignedTo ||
    String(lead.assignedTo) === String(currentUserId);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: lead.id,
    disabled: !canManageLead,
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: isDragging ? 50 : undefined }
    : undefined;

  return (
    <div ref={setNodeRef} style={style} className="outline-none">
      <Card
        {...(canManageLead ? { ...listeners, ...attributes } : {})}
        className={`
          transition-all duration-200 bg-white border border-slate-100 rounded-xl
          shadow-[0_4px_12px_rgba(0,76,76,0.02)]
          ${canManageLead
            ? 'cursor-grab active:cursor-grabbing hover:shadow-[0_8px_24px_rgba(0,76,76,0.06)] hover:translate-y-[-1px] hover:border-[#b2d8d8]'
            : 'cursor-not-allowed bg-slate-50/50 opacity-70'
          }
          ${isDragging ? 'opacity-80 shadow-lg rotate-1' : ''}
        `}
      >
        <CardHeader className="p-4 pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-[15px] font-bold text-[#004c4c] flex items-center gap-1.5 flex-1 min-w-0 select-none">
              {!canManageLead && <Lock className="h-3.5 w-3.5 text-slate-400 shrink-0" />}
              <span className="truncate">{lead.name}</span>
            </CardTitle>

            <Link
              to={`/leads/${lead.id}`}
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              className="text-slate-400 hover:text-[#008080] p-1.5 rounded-lg hover:bg-[#b2d8d8]/20 transition-colors shrink-0"
            >
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </CardHeader>

        <CardContent className="px-4 pb-4 pointer-events-none">
          <p className="text-sm font-semibold text-slate-700">{lead.contactInfo || lead.leadSource || ''}</p>
          <p className="text-xs text-slate-400 truncate mt-0.5">{lead.email || lead.contactInfo}</p>

          <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-50">
            <Badge
              variant="outline"
              className="px-2.5 py-0.5 rounded-md border-[#b2d8d8] bg-[#b2d8d8]/10 text-[#006666] font-semibold text-xs tracking-wide"
            >
              {lead.status || "new"}
            </Badge>

            {lead.assignedUser?.name && (
              <span className="text-xs text-slate-400 font-medium">
                {userRole === 'admin' ? (
                  <span className="inline-flex items-center gap-1">
                    <span className="text-[#66b2b2]">→</span> {lead.assignedUser.name}
                  </span>
                ) : (
                  <span className="text-[#006666] font-semibold bg-[#b2d8d8]/20 px-2 py-0.5 rounded">Assigned to you</span>
                )}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
