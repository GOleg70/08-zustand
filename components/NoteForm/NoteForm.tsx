'use client';

import { useRouter } from 'next/navigation';
import { useNoteStore } from '@/lib/store/noteStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/lib/api';
import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { ValidationError } from 'yup';
import type { NoteTag } from '@/types/note';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import css from './NoteForm.module.css';

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'The title must be at least 3 characters long.')
    .max(50, 'The title should be no longer than 50 characters.')
    .required('Title is a required field'),
  content: Yup.string().max(
    500,
    'Content must be no more than 500 characters.'
  ),
  tag: Yup.mixed<NoteTag>()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'], 'Invalid tag')
    .required('Tag is a required field.'),
});

export default function NoteForm() {
  const router = useRouter();
  const { draft, setDraft, clearDraft } = useNoteStore();
  const queryClient = useQueryClient();

  const [isReady, setIsReady] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  useEffect(() => {
    setIsReady(true);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setDraft({ [name]: value });
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
    }
  };

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      clearDraft();
      router.back();
    },
    onError: (error) => {
      console.error('Error creating note:', error);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await validationSchema.validate(draft, { abortEarly: false });
      createMutation.mutate(draft);
    } catch (validationErrors) {
      if (validationErrors instanceof ValidationError) {
        const newErrors: Record<string, string> = {};
        validationErrors.inner.forEach((error) => {
          if (error.path) {
            newErrors[error.path] = error.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (!isReady) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className={css.form}>
      {/* Title */}
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          className={css.input}
          value={draft.title}
          onChange={handleInputChange}
          disabled={createMutation.isPending}
        />
        {errors.title && <ErrorMessage message={errors.title} />}
      </div>

      {/* Content */}
      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          value={draft.content}
          onChange={handleInputChange}
          disabled={createMutation.isPending}
        />
        {errors.content && <ErrorMessage message={errors.content} />}
      </div>

      {/* Tag */}
      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={draft.tag}
          onChange={handleInputChange}
          disabled={createMutation.isPending}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
        {errors.tag && <ErrorMessage message={errors.tag} />}
      </div>

      {/* Actions */}
      <div className={css.actions}>
        <button
          type="button"
          onClick={handleCancel}
          className={css.cancelButton}
          disabled={createMutation.isPending}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={createMutation.isPending || !draft.title}
        >
          {createMutation.isPending ? 'Creating...' : 'Create note'}
        </button>
      </div>
    </form>
  );
}
