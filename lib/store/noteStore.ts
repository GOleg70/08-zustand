import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { NoteTag } from '@/types/note';

type NoteDraft = {
  title: string;
  content: string;
  tag: NoteTag;
};

const initialDraft: NoteDraft = {
  title: '',
  content: '',
  tag: 'Todo',
};

interface NoteState {
  draft: NoteDraft;
  setDraft: (note: Partial<NoteDraft>) => void;
  clearDraft: () => void;
}

export const useNoteStore = create<NoteState>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (note) =>
        set((state) => ({ draft: { ...state.draft, ...note } })),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: 'notehub-draft-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
