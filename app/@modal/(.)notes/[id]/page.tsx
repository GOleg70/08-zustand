
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import getQueryClient from "@/lib/api/getQueryClient";
import { fetchNoteById } from "@/lib/api";
import NotePreview from "@/app/@modal/(.)notes/[id]/NotePreview.client";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function InterceptedNoteModal({ params }: Props) {
  const { id } = await params;

  const queryClient = getQueryClient();

  // Префетчимо нотатку перед рендером
  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreview id={id} />
    </HydrationBoundary>
  );
}