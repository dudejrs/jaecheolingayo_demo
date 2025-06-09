'use client'

interface PaginationProps {
  onClick:  (page: number)=> void
  totalPages: number;
  currentPage: number;
}

const defaultClassName = "p-1 rounded font-[var(--color-text-primary)] cursor-pointer"

export default function Pagination({ totalPages, currentPage, onClick }: PaginationProps) {
  
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
          onClick={() => onClick(startPage - 1)}
          className={`${defaultClassName}`}
        >
          &lt;
        </button>
      )}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onClick(p)}
          className={`${defaultClassName} ${p === currentPage && 'text-blue-500'}`}
        >
          {p}
        </button>
      ))}
      {endPage < totalPages && (
        <button
          onClick={() => onClick(endPage + 1)}
          className={`${defaultClassName}`}
        >
          &gt;
        </button>
      )}
    </div>
  );
}
