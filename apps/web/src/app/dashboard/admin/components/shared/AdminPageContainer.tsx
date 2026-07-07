'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AdminPageContainerProps {
  children: React.ReactNode;
}

export function AdminPageContainer({ children }: AdminPageContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto w-full flex flex-col gap-6 pb-12"
    >
      {children}
    </motion.div>
  );
}
