'use client';

import { useState, useEffect } from 'react';

/**
 * Hook pour gérer les données du dashboard principal de l'administration.
 * Pour l'instant, ne contient aucune donnée réelle (tout est mocké ou géré par les composants).
 * Il servira à l'avenir à centraliser les appels API SWR ou React Query.
 */
export function useDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    // Simulation d'un délai réseau
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return {
    isLoading,
    isError,
    // data: null
  };
}
