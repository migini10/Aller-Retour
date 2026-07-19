'use client';

import React, { useEffect, useRef, useState } from 'react';

export interface PromptModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  defaultValue?: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
}

export default function PromptModal({ isOpen, title, description, defaultValue = '', onConfirm, onCancel }: PromptModalProps) {
  const [value, setValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setValue(defaultValue);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, defaultValue]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
      if (e.key === 'Enter' && value.trim()) onConfirm(value.trim());
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, value, onCancel, onConfirm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">{title}</h2>
          {description && <p className="text-slate-600 dark:text-slate-400 mb-4">{description}</p>}
          
          <input 
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6 text-slate-900 dark:text-white"
            placeholder="Saisissez ici..."
          />

          <div className="flex justify-end gap-3">
            <button 
              onClick={onCancel}
              className="px-4 py-2 rounded-lg font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 transition-colors"
            >
              Annuler
            </button>
            <button 
              onClick={() => {
                if (value.trim()) onConfirm(value.trim());
              }}
              disabled={!value.trim()}
              className="px-4 py-2 rounded-lg font-medium transition-colors bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white"
            >
              Confirmer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
