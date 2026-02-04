import { useState } from "react";
import { useArchive } from "../hooks/useArchive";
import { ConfirmDialog } from "../components/shared/ConfirmDialog";
import { TagBadge } from "../components/shared/TagBadge";

export function ArchivePage() {
  const [searchInput, setSearchInput] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);
  const [tab, setTab] = useState<"all" | "recent">("all");

  const {
    items,
    total,
    recentCount,
    loading,
    hasMore,
    searchArchive,
    loadMore,
    restore,
    remove,
    restoreAllCards,
    clearAll,
  } = useArchive(tab);

  return (
    <div className="bg-background-light flex-1 overflow-y-auto">
      <div className="mx-auto max-w-6xl px-8 py-10 lg:px-12">
        <div className="mb-10 flex flex-wrap items-start justify-between gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl leading-tight font-black tracking-[-0.033em] text-[#0d141b]">
              Archived Tasks
            </h1>
            <p className="max-w-xl text-base font-normal text-[#4c739a]">
              Review and manage your archived workspace items. Restore tasks to
              bring them back to your active board.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={restoreAllCards}
              className="bg-primary flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-600"
            >
              <span className="material-symbols-outlined text-lg">restore</span>
              Restore All
            </button>
            <button
              onClick={() => setConfirmClear(true)}
              className="flex items-center justify-center rounded-lg border border-slate-200 bg-white p-3 text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600"
              title="Clear Archive"
            >
              <span className="material-symbols-outlined">delete_sweep</span>
            </button>
          </div>
        </div>

        <div className="mb-8 flex items-end justify-between border-b border-slate-200">
          <div className="flex gap-8">
            <button
              onClick={() => setTab("all")}
              className={`flex items-center gap-2 border-b-2 pb-4 text-sm font-bold ${
                tab === "all"
                  ? "border-primary text-primary"
                  : "border-transparent text-[#4c739a] hover:text-[#0d141b]"
              }`}
            >
              All Tasks
              <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-[10px]">
                {total}
              </span>
            </button>
            <button
              onClick={() => setTab("recent")}
              className={`flex items-center gap-2 border-b-2 pb-4 text-sm font-bold ${
                tab === "recent"
                  ? "border-primary text-primary"
                  : "border-transparent text-[#4c739a] hover:text-[#0d141b]"
              }`}
            >
              Recently Added
              {tab === "recent" && recentCount > 0 && (
                <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-[10px]">
                  {recentCount}
                </span>
              )}
            </button>
          </div>
          <div className="pb-3">
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5">
              <span className="material-symbols-outlined text-lg text-slate-400">
                search
              </span>
              <input
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  searchArchive(e.target.value);
                }}
                className="w-48 border-none bg-transparent p-0 text-sm placeholder:text-slate-400 focus:ring-0 focus:outline-none"
                placeholder="Search archive..."
              />
            </div>
          </div>
        </div>

        {items.length === 0 && !loading && (
          <div className="py-20 text-center">
            <span className="material-symbols-outlined mb-4 text-[48px] text-slate-300">
              inventory_2
            </span>
            <p className="text-lg font-semibold text-[#4c739a]">
              {tab === "recent"
                ? "No recently archived tasks"
                : "No archived tasks"}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((card) => (
            <div
              key={card.id}
              className="flex flex-col gap-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg leading-snug font-bold text-[#0d141b]">
                    {card.title}
                  </h3>
                  <p className="text-xs font-medium text-slate-500">
                    Archived{" "}
                    {card.archived_at
                      ? new Date(card.archived_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : ""}
                  </p>
                </div>
                <button
                  onClick={() => remove(card.id)}
                  className="text-[#4c739a] transition-colors hover:text-red-500"
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
              {card.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {card.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="rounded px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase"
                    >
                      <TagBadge tag={tag} />
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-5">
                <div />
                <button
                  onClick={() => restore(card.id)}
                  className="hover:bg-primary flex items-center gap-1.5 rounded-lg bg-slate-100 px-4 py-2 text-xs font-bold text-[#0d141b] transition-all hover:text-white"
                >
                  <span className="material-symbols-outlined text-sm">
                    unarchive
                  </span>
                  Restore
                </button>
              </div>
            </div>
          ))}
        </div>

        {hasMore && (
          <div className="mt-16 flex justify-center">
            <button
              onClick={loadMore}
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-8 py-3 text-sm font-bold text-slate-500 shadow-sm transition-all hover:border-slate-300 hover:bg-white"
            >
              Load More Tasks
              <span className="material-symbols-outlined text-sm">
                expand_more
              </span>
            </button>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirmClear}
        title="Clear Archive"
        message="This will permanently delete all archived cards. This cannot be undone."
        confirmLabel="Clear All"
        onConfirm={() => {
          clearAll();
          setConfirmClear(false);
        }}
        onCancel={() => setConfirmClear(false)}
      />
    </div>
  );
}
