"use client";

import { useState, useMemo, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

import {
  fetchNotes,
  type FetchNotesResponse,
  type FetchNotesParams,
} from "@/lib/api";

import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import type { NoteTag } from "@/types/note";
import css from "./notes.module.css";

export default function NotesClient({ initialTag }: { initialTag?: NoteTag }) {
  const [page, setPage] = useState(1);
  const [perPage] = useState(12);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

 
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm, initialTag]);

 
  const queryParams: FetchNotesParams = useMemo(() => {
    const p: FetchNotesParams = {
      page,
      perPage,
      search: debouncedSearchTerm,
    };
    if (initialTag) p.tag = initialTag;
    return p;
  }, [page, perPage, debouncedSearchTerm, initialTag]);

  
  const { data, isLoading, isError, isFetching } = useQuery<FetchNotesResponse>(
    {
      queryKey: ["notes", queryParams],
      queryFn: () => fetchNotes(queryParams),
      placeholderData: keepPreviousData,
    }
  );

  const pageCount = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={setSearchTerm} />
        {pageCount > 1 && (
          <Pagination
            totalPages={pageCount}
            currentPage={page}
            onPageChange={setPage}
          />
        )}
        <button onClick={() => setIsModalOpen(true)} className={css.button}>
          Create note +
        </button>
      </header>

      {isLoading || isFetching ? (
        <p>Loading notes...</p>
      ) : isError ? (
        <p>An error occurred while loading notes.</p>
      ) : data && data.notes.length > 0 ? (
        <NoteList notes={data.notes} />
      ) : (
        <p>No notes found.</p>
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
