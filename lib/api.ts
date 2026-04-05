// lib/api.ts

import axios from "axios";
import type { Note } from "@/types/note";

const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const noteApi = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

export const fetchNotes = async ({
  page,
  perPage,
  search,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const response = await noteApi.get<FetchNotesResponse>("/notes", {
    params: {
      page,
      search,
      perPage,
    },
  });
  return response.data;
};

export const fetchSingleNote = async (id: string): Promise<Note> => {
  const { data } = await noteApi.get<Note>(`/notes/${id}`);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await noteApi.delete<Note>(`/notes/${id}`);
  return response.data;
};

type NewNote = Omit<Note, "id" | "createdAt" | "updatedAt">;

export const createNote = async (noteData: NewNote): Promise<Note> => {
  const response = await noteApi.post<Note>("/notes", noteData);
  return response.data;
};
