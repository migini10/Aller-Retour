'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Edit, Trash2, Eye, LucideIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ActionItem {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  isDestructive?: boolean;
}

interface ActionDropdownProps {
  actions: ActionItem[];
}

export function ActionDropdown({ actions }: ActionDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500/50"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 5 }}
            transition={{ duration: 0.1 }}
            className="absolute right-0 mt-1 w-48 origin-top-right rounded-xl bg-white dark:bg-[#1A1A1A] shadow-lg border border-slate-200 dark:border-[#2A2A2A] ring-1 ring-black ring-opacity-5 focus:outline-none z-50 overflow-hidden"
          >
            <div className="py-1">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => {
                    action.onClick();
                    setIsOpen(false);
                  }}
                  className={`group flex w-full items-center px-4 py-2 text-sm transition-colors ${
                    action.isDestructive
                      ? 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
                  }`}
                >
                  <action.icon className="mr-3 h-4 w-4" aria-hidden="true" />
                  {action.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
