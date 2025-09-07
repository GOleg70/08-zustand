import Link from 'next/link';
import type { Metadata } from 'next';
import css from './page.module.css';

export const metadata: Metadata = {
  title: 'Page Not Found | NoteHub',
  description: 'The page you are looking for does not exist.',
  openGraph: {
    title: 'Page Not Found | NoteHub',
    description: 'The page you are looking for does not exist.',
    url: 'https://your-vercel-domain.vercel.app/404',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        alt: 'NoteHub Open Graph Image',
      },
    ],
  },
};

export default function NotFoundPage() {
  return (
    <div className={css.container}>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        You will be redirected to the home page in 5 seconds...
      </p>
      <Link href="/">Return to Home</Link>
    </div>
  );
}
