import { NavLink } from "react-router-dom";

export function Sidebar() {
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-[#e7edf3] bg-white">
      <div className="text-primary mb-4 flex items-center gap-3 p-6">
        <div className="size-7">
          <svg
            fill="currentColor"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-[#0d141b]">
          TaskFlow
        </h2>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2 font-semibold transition-colors ${
              isActive
                ? "bg-primary/10 text-primary"
                : "text-[#4c739a] hover:bg-slate-50"
            }`
          }
        >
          <span className="material-symbols-outlined text-[22px]">
            grid_view
          </span>
          <span>Current Board</span>
        </NavLink>
        <NavLink
          to="/archive"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2 font-medium transition-colors ${
              isActive
                ? "bg-primary/10 text-primary font-bold"
                : "text-[#4c739a] hover:bg-slate-50"
            }`
          }
        >
          <span className="material-symbols-outlined text-[22px]">archive</span>
          <span>Archived Tasks</span>
        </NavLink>
      </nav>
      <div className="mt-auto border-t border-[#e7edf3] p-4">
        <div className="flex items-center gap-3 p-2">
          <div className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-full border border-slate-200 text-sm font-bold">
            AM
          </div>
          <div className="flex flex-col">
            <span className="max-w-[120px] truncate text-sm font-semibold">
              Alex Morgan
            </span>
            <span className="text-[10px] font-bold text-[#4c739a] uppercase">
              Admin
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
