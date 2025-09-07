// app/notes/filter/[...slug]/page.tsx

import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import getQueryClient from "@/lib/api/getQueryClient";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";
import { NOTE_TAGS } from "@/lib/constants";
import type { NoteTag } from "@/types/note";

type Params = { slug?: string[] };


function mapSlugToTag(slug: string[] | undefined): NoteTag | undefined {
  const raw = slug?.[0];
  if (!raw || raw === "All") return undefined;

  const allowed = NOTE_TAGS as readonly string[];
  return allowed.includes(raw) ? (raw as NoteTag) : undefined;
}

export default async function NotesPage({
  params,
}: {
  params: Promise<Params>;
}) {
  
  const { slug } = await params;

  const tag = mapSlugToTag(slug);
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", { page: 1, perPage: 12, search: "", tag }],
    queryFn: () => fetchNotes({ page: 1, perPage: 12, tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient initialTag={tag} />
    </HydrationBoundary>
  );
}
