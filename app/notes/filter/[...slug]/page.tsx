// app/notes/filter/[...slug]/page.tsx

import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import getQueryClient from '@/lib/api/getQueryClient';
import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';
import { NOTE_TAGS } from '@/lib/constants';
import type { NoteTag } from '@/types/note';
import type { Metadata } from 'next';

type Params = { slug?: string[] };

function mapSlugToTag(slug: string[] | undefined): NoteTag | undefined {
  const raw = slug?.[0];
  if (!raw || raw === 'All') return undefined;

  const allowed = NOTE_TAGS as readonly string[];
  return allowed.includes(raw) ? (raw as NoteTag) : undefined;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const raw = slug?.[0] ?? 'All';

  const title =
    raw === 'All' ? 'All Notes — NoteHub' : `${raw} Notes — NoteHub`;
  const description =
    raw === 'All'
      ? 'Browse all notes in NoteHub.'
      : `Browse notes from the "${raw}" category in NoteHub.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://08-zustand-xi-one.vercel.app/notes/filter/${raw}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          alt: 'NoteHub Open Graph Image',
        },
      ],
    },
  };
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
    queryKey: ['notes', { page: 1, perPage: 12, search: '', tag }],
    queryFn: () => fetchNotes({ page: 1, perPage: 12, tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient initialTag={tag} />
    </HydrationBoundary>
  );
}
