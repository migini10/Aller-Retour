import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Chargement en cours...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 min-h-[400px] w-full text-slate-500 dark:text-slate-400">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      >
        <Loader2 className="h-10 w-10 text-orange-500 mb-4" />
      </motion.div>
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
