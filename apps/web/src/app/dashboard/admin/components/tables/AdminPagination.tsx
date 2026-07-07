'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function AdminPagination({ currentPage, totalPages, onPageChange }: AdminPaginationProps) {
  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    
    // Always show first page
    pages.push(
      <PageButton key={1} page={1} active={currentPage === 1} onClick={() => onPageChange(1)} />
    );

    // Calculate window
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    if (startPage > 2) {
      pages.push(<span key="ellipsis-1" className="px-3 py-2 text-slate-400"><MoreHorizontal className="w-4 h-4" /></span>);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PageButton key={i} page={i} active={currentPage === i} onClick={() => onPageChange(i)} />
      );
    }

    if (endPage < totalPages - 1) {
      pages.push(<span key="ellipsis-2" className="px-3 py-2 text-slate-400"><MoreHorizontal className="w-4 h-4" /></span>);
    }

    // Always show last page if > 1
    if (totalPages > 1) {
      pages.push(
        <PageButton key={totalPages} page={totalPages} active={currentPage === totalPages} onClick={() => onPageChange(totalPages)} />
      );
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-[#141414] border-t border-slate-200 dark:border-slate-800 rounded-b-xl">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50"
        >
          Précédent
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative ml-3 inline-flex items-center rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50"
        >
          Suivant
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-700 dark:text-slate-400">
            Page <span className="font-semibold text-slate-900 dark:text-white">{currentPage}</span> sur <span className="font-semibold text-slate-900 dark:text-white">{totalPages}</span>
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
            >
              <span className="sr-only">Précédent</span>
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            {renderPageNumbers()}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
            >
              <span className="sr-only">Suivant</span>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}

function PageButton({ page, active, onClick }: { page: number; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
        active
          ? 'z-10 bg-orange-600 text-white focus-visible:outline-orange-600'
          : 'text-slate-900 dark:text-slate-300 ring-1 ring-inset ring-slate-300 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
      }`}
    >
      {page}
    </button>
  );
}
