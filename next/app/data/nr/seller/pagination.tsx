'use client'

import { useSearchParams, useRouter } from 'next/navigation';

interface PaginationProps {
  updateSearchParams:  (page: number)=> void
  totalPages: number;
  currentPage: number;
}

const defaultClassName = "p-1 rounded font-[var(--color-text-primary)] cursor-pointer"

export default function Pagination({ totalPages, currentPage, updateSearchParams }: PaginationProps) {
  
  const groupSize = 10;
  const currentGroup = Math.floor((currentPage - 1) / groupSize);
  const startPage = currentGroup * groupSize + 1;
  const endPage = Math.min(startPage + groupSize - 1, totalPages);

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="mt-4 flex flex-wrap gap-2 items-center">
      {startPage > 1 && (
        <button
          onClick={() => updateSearchParams(startPage - 1)}
          className={`${defaultClassName}`}
        >
          &lt;
        </button>
      )}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => updateSearchParams(p)}
          className={`${defaultClassName} ${p === currentPage && 'text-blue-500'}`}
        >
          {p}
        </button>
      ))}
      {endPage < totalPages && (
        <button
          onClick={() => updateSearchParams(endPage + 1)}
          className={`${defaultClassName}`}
        >
          &gt;
        </button>
      )}
    </div>
  );
}
