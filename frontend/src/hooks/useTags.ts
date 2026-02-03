import { useCallback, useEffect, useState } from "react";
import { fetchTags, createTag, deleteTag } from "../api/tags";
import type { Tag } from "../types";

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([]);

  const load = useCallback(async () => {
    setTags(await fetchTags());
  }, []);

  useEffect(() => {
    fetchTags().then(setTags);
  }, []);

  const addTag = async (name: string, color: string) => {
    await createTag(name, color);
    await load();
  };

  const removeTag = async (id: string) => {
    await deleteTag(id);
    await load();
  };

  return { tags, reload: load, addTag, removeTag };
}
