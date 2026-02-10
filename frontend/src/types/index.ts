export interface Tag {
  id: string;
  name: string;
  color: string;
  bg_color: string | null;
  fg_color: string | null;
  created_at: string;
}

export interface Card {
  id: string;
  column_id: string | null;
  title: string;
  description: string | null;
  image_url: string | null;
  position: number;
  is_archived: boolean;
  archived_at: string | null;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  tags: Tag[];
}

export interface Column {
  id: string;
  name: string;
  position: number;
  is_done_column: boolean;
  created_at: string;
  updated_at: string;
  cards: Card[];
}

export interface ArchivePage {
  items: Card[];
  total: number;
  page: number;
  page_size: number;
}

export interface BoardSettings {
  id: string;
  title: string;
  subtitle: string;
  created_at: string;
  updated_at: string;
}
