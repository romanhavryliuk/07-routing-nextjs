type NoteTag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

interface Note {
  id: string;
  title: string;
  content: string;
  tag: NoteTag;
  createdAt: string;
  updatedAt: string;
}

interface CreateNote {
  title: string;
  content: string;
  tag: NoteTag;
}

export type { Note, NoteTag, CreateNote };