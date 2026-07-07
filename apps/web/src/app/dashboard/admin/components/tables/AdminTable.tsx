'use client';

import React from 'react';

export interface ColumnDef<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
}

interface AdminTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
  isLoading?: boolean;
  emptyState?: React.ReactNode;
  loadingState?: React.ReactNode;
}

export function AdminTable<T>({ 
  columns, 
  data, 
  keyExtractor, 
  isLoading, 
  emptyState,
  loadingState 
}: AdminTableProps<T>) {
  
  if (isLoading && loadingState) {
    return <div className="w-full">{loadingState}</div>;
  }

  if (data.length === 0 && emptyState) {
    return <div className="w-full">{emptyState}</div>;
  }

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#141414] shadow-sm">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-slate-50 dark:bg-[#1A1A1A] text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-800">
          <tr>
            {columns.map((col, i) => (
              <th key={i} className={`px-6 py-4 ${col.className || ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
          {data.map((item, rowIndex) => (
            <tr key={keyExtractor(item)} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
              {columns.map((col, colIndex) => (
                <td key={colIndex} className={`px-6 py-4 text-slate-700 dark:text-slate-300 ${col.className || ''}`}>
                  {col.cell ? col.cell(item) : col.accessorKey ? String(item[col.accessorKey]) : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
