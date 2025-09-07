 // lib/api.ts
import axios from "axios";
import type { CreateNote, Note, NoteTag } from "@/types/note";

const instance = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
  },
});

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: NoteTag;
  sortBy?: "createdAt" | "updatedAt" | "title";
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (params: FetchNotesParams) => {
  const { data } = await instance.get<FetchNotesResponse>("/notes", { params });
  return data;
};


export async function fetchTags(): Promise<string[]> {
  const res = await instance.get("notes/tags");
  return res.data;
} 

export const fetchNoteById = async (id: string) => {
  const { data } = await instance.get<Note>(`/notes/${id}`);
  return data;
};

export const createNote = async (newNoteData: CreateNote) => {
  const { data } = await instance.post<Note>("/notes", newNoteData);
  return data;
};

export const deleteNote = async (id: string) => {
  const { data } = await instance.delete<Note>(`/notes/${id}`);
  return data;
};
