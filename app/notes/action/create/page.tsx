import type { Metadata } from 'next';
import css from './CreateNote.module.css';
import NoteForm from '@/components/NoteForm/NoteForm';

export const metadata: Metadata = {
  title: 'Create Note | NoteHub',
  description: 'Create a new note in NoteHub.',
  openGraph: {
    title: 'Create Note | NoteHub',
    description: 'Easily create and manage your notes with NoteHub.',
    url: 'https://your-vercel-domain.vercel.app/notes/action/create',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        alt: 'NoteHub Open Graph Image',
      },
    ],
  },
};

export default function CreateNotePage() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}
