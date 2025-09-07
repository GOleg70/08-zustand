"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import type { Note } from "@/types/note";
import Modal from "@/components/Modal/Modal";
import { useRouter } from "next/navigation";
import css from "@/app/@modal/(.)notes/[id]/NotePreview.client.module.css";

export default function NotePreview({ id }: { id: string }) {
  
  const router = useRouter();

  const { data: note, isLoading, isError } = useQuery<Note>({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  return (
    <Modal onClose={() => router.back()}>
      {isLoading ? (
        <p>Loading note...</p>
      ) : isError || !note ? (
        <p>Could not load note.</p>
      ) : (
        <article style={{ padding: "1rem" }}>
          <h2>{note.title}</h2>
          <p>{note.content}</p>
          <small>{new Date(note.createdAt).toLocaleString()}</small>
          <br />
              <button className={ css.backBtn} onClick={() => router.back()}>Close</button>
        </article>
      )}
    </Modal>
  );
}
