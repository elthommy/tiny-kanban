export type DueDateStatus = 'overdue' | 'soon' | 'upcoming' | 'none';

export function getDueDateStatus(dueDate: string | null): DueDateStatus {
  if (!dueDate) return 'none';

  const due = new Date(dueDate);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  const diffDays = Math.floor((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'overdue';
  if (diffDays <= 3) return 'soon';
  return 'upcoming';
}

export function formatDueDate(dueDate: string): string {
  return new Date(dueDate).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
  });
}

export const dueDateStyles = {
  overdue: {
    icon: 'warning',
    textColor: 'text-red-600',
  },
  soon: {
    icon: 'schedule',
    textColor: 'text-amber-600',
  },
  upcoming: {
    icon: 'calendar_today',
    textColor: 'text-blue-600',
  },
};
