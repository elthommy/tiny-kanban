import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Card, Tag } from "../../types";
import { TagBadge } from "../shared/TagBadge";
import {
  getDueDateStatus,
  formatDueDate,
  dueDateStyles,
} from "../../utils/dateUtils";

interface KanbanCardProps {
  card: Card;
  isDoneColumn: boolean;
  allTags: Tag[];
  onArchive: () => void;
  onEdit: () => void;
}

export function KanbanCard({
  card,
  isDoneColumn,
  onArchive,
  onEdit,
}: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: card.id, data: { type: "card", card } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onEdit}
      className={`group hover:border-primary/30 flex cursor-grab flex-col items-stretch justify-start gap-3 rounded-xl border border-transparent bg-white p-4 shadow-sm transition-all active:cursor-grabbing ${
        isDoneColumn ? "opacity-75 grayscale-[0.3]" : ""
      }`}
    >
      {card.image_url && (
        <div
          className="aspect-video w-full rounded-lg bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url("${card.image_url}")` }}
        />
      )}
      <div className="flex flex-col gap-2">
        {card.tags.length > 0 && (
          <div className="flex gap-2">
            {card.tags.map((tag) => (
              <TagBadge key={tag.id} tag={tag} />
            ))}
          </div>
        )}
        <p
          className={`text-base leading-tight font-bold tracking-[-0.015em] text-[#0d141b] ${
            isDoneColumn ? "line-through decoration-slate-400" : ""
          }`}
        >
          {card.title}
        </p>
        <div className="mt-1 flex items-center justify-between">
          {isDoneColumn ? (
            <div className="flex items-center gap-1.5 text-green-600">
              <span className="material-symbols-outlined text-[16px]">
                check_circle
              </span>
              <p className="text-xs font-medium">Completed</p>
            </div>
          ) : card.due_date ? (
            (() => {
              const status = getDueDateStatus(card.due_date);
              if (status === "none") return null;
              const styles = dueDateStyles[status];
              return (
                <div
                  className={`flex items-center gap-1.5 ${styles.textColor}`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {styles.icon}
                  </span>
                  <p className="text-xs font-medium">
                    {status === "overdue" && "Overdue: "}
                    {status === "soon" && "Due: "}
                    {formatDueDate(card.due_date)}
                  </p>
                </div>
              );
            })()
          ) : (
            <div className="flex items-center gap-1.5 text-[#4c739a]">
              <span className="material-symbols-outlined text-[16px]">
                calendar_today
              </span>
              <p className="text-xs font-medium">
                {new Date(card.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                })}
              </p>
            </div>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onArchive();
            }}
            className="bg-primary/10 text-primary hover:bg-primary flex h-8 items-center justify-center rounded-lg px-3 text-xs font-bold opacity-0 transition-all group-hover:opacity-100 hover:text-white"
          >
            Archive
          </button>
        </div>
      </div>
    </div>
  );
}
