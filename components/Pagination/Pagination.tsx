"use client";

import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ totalPages, currentPage, onPageChange }: PaginationProps) => {
  const handlePageClick = (event: { selected: number }) => {
    onPageChange(event.selected + 1);
  };

  return (
    <div className={css.paginationContainer}>
      <ReactPaginate
        previousLabel="<"
        nextLabel=">"
        breakLabel="..."
        pageCount={totalPages}
        marginPagesDisplayed={1}
        pageRangeDisplayed={2}
        onPageChange={handlePageClick}
        containerClassName={css.pagination}
        pageLinkClassName={css.pageLink}
        activeClassName={css.active}
        previousLinkClassName={css.previousLink}
        nextLinkClassName={css.nextLink}
        forcePage={currentPage - 1}
      />
    </div>
  );
};

export default Pagination;