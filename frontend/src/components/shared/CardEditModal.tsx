import { useState } from "react";
import type { Card, Tag } from "../../types";
import { TagBadge } from "./TagBadge";
import { TagCreateDialog } from "./TagCreateDialog";
import { createTag } from "../../api/tags";

interface CardEditModalProps {
  card: Card;
  allTags: Tag[];
  onSave: (data: {
    title: string;
    description: string;
    tag_ids: string[];
  }) => void;
  onDelete: () => void;
  onClose: () => void;
  onTagsChange: () => void;
}

export function CardEditModal({
  card,
  allTags,
  onSave,
  onDelete,
  onClose,
  onTagsChange,
}: CardEditModalProps) {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description ?? "");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    card.tags.map((t) => t.id),
  );
  const [showTagCreateDialog, setShowTagCreateDialog] = useState(false);

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
  };

  const handleCreateTag = async (data: {
    name: string;
    bg_color: string;
    fg_color: string;
  }) => {
    try {
      const newTag = await createTag(data);
      setSelectedTagIds((prev) => [...prev, newTag.id]);
      setShowTagCreateDialog(false);
      onTagsChange();
    } catch (error) {
      console.error("Failed to create tag:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#0d141b]">Edit Card</h3>
          <button
            onClick={onClose}
            className="text-[#4c739a] hover:text-[#0d141b]"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-[#0d141b]">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="focus:border-primary focus:ring-primary/20 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-[#0d141b]">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="focus:border-primary focus:ring-primary/20 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#0d141b]">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  className={`transition-opacity ${
                    selectedTagIds.includes(tag.id)
                      ? "opacity-100"
                      : "opacity-40"
                  }`}
                >
                  <TagBadge tag={tag} />
                </button>
              ))}
              <button
                onClick={() => setShowTagCreateDialog(true)}
                className="flex items-center gap-1 rounded-md border-2 border-dashed border-slate-300 bg-slate-50 px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase text-slate-500 hover:border-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">
                  add
                </span>
                NEW TAG
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={onDelete}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-50"
          >
            Delete Card
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-[#4c739a] hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={() =>
                onSave({
                  title,
                  description,
                  tag_ids: selectedTagIds,
                })
              }
              className="bg-primary rounded-lg px-4 py-2 text-sm font-bold text-white hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </div>
      </div>
      {showTagCreateDialog && (
        <TagCreateDialog
          onSave={handleCreateTag}
          onClose={() => setShowTagCreateDialog(false)}
        />
      )}
    </div>
  );
}
