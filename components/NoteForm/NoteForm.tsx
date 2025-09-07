"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api";
import type { NoteTag, CreateNote } from "../../types/note";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import css from "./NoteForm.module.css";

interface NoteFormProps {
  onClose: () => void;
}

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "The title must be at least 3 characters long.")
    .max(50, "The title should be no longer than 50 characters.")
    .required("Title is a required field"),
  content: Yup.string().max(500, "Content must be no more than 500 characters."),
  tag: Yup.mixed<NoteTag>()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"], "Invalid tag")
    .required("Tag is a required field."),
});

export default function NoteForm({ onClose }: NoteFormProps) {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (newNote: CreateNote) => createNote(newNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onClose();
    },
    onError: (error) => {
      console.error("Error creating note:", error);
    },
  });

  const formik = useFormik({
    initialValues: { title: "", content: "", tag: "Todo" as NoteTag },
    validationSchema,
    onSubmit: (values) => {
      createMutation.mutate(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className={css.form}>
      {/* Title */}
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          className={css.input}
          {...formik.getFieldProps("title")}
        />
        {formik.touched.title && formik.errors.title && (
          <ErrorMessage message={formik.errors.title} />
        )}
      </div>

      {/* Content */}
      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          rows={8}
          className={css.textarea}
          {...formik.getFieldProps("content")}
        />
        {formik.touched.content && formik.errors.content && (
          <ErrorMessage message={formik.errors.content} />
        )}
      </div>

      {/* Tag */}
      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select id="tag" className={css.select} {...formik.getFieldProps("tag")}>
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
        {formik.touched.tag && formik.errors.tag && (
          <ErrorMessage message={formik.errors.tag} />
        )}
      </div>

      {/* Actions */}
      <div className={css.actions}>
        <button type="button" onClick={onClose} className={css.cancelButton}>
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={!formik.isValid || createMutation.isPending}
        >
          {createMutation.isPending ? "Creating..." : "Create note"}
        </button>
      </div>
    </form>
  );
}
