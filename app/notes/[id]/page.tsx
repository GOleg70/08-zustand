// app/notes/[id]/page.tsx
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import getQueryClient from '@/lib/api/getQueryClient';
import { fetchNoteById } from '@/lib/api';
import NoteDetailsClient from './NoteDetails.client';

import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const note = await fetchNoteById(id);

  if (!note) {
    return {
      title: 'Note Not Found | NoteHub',
      description: 'The note you are looking for does not exist.',
      openGraph: {
        title: 'Note Not Found | NoteHub',
        description: 'The note you are looking for does not exist.',
        url: `https://your-vercel-domain.vercel.app/notes/${id}`,
        images: [
          {
            url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
            alt: 'NoteHub Open Graph Image',
          },
        ],
      },
    };
  }

  const title = note.title;
  const description =
    note.content.length > 150
      ? note.content.substring(0, 150) + '...'
      : note.content;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://08-zustand-xi-one.vercel.app/notes/${note.id}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          alt: 'NoteHub Open Graph Image',
        },
      ],
    },
  };
}

export default async function NoteDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient id={id} />
    </HydrationBoundary>
  );
}
