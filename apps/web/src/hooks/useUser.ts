import { useState, useEffect } from 'react';

export function useUser() {
  const [userName, setUserName] = useState('Utilisateur');
  const [userPhone, setUserPhone] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setUserName(localStorage.getItem('userName') || 'Utilisateur');
    setUserPhone(localStorage.getItem('userPhone') || '');
    setIsLoaded(true);
  }, []);

  const updateUser = (name: string, phone: string) => {
    localStorage.setItem('userName', name);
    localStorage.setItem('userPhone', phone);
    setUserName(name);
    setUserPhone(phone);
  };

  return { userName, userPhone, updateUser, isLoaded };
}
