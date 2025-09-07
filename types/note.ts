// types/note.ts
export type NoteTag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: NoteTag;
  createdAt: string;
  updatedAt: string;
}

export type CreateNote = Omit<Note, "id" | "createdAt" | "updatedAt">;
