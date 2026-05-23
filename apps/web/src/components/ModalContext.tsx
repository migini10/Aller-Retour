'use client';
import React, { createContext, useContext, useState } from 'react';
import MockModal from './MockModal';

interface ModalContextType {
  openModal: (title: string, description?: string, buttonText?: string) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType>({
  openModal: () => {},
  closeModal: () => {},
});

export const useModal = () => useContext(ModalContext);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    description: 'Remplissez les informations ci-dessous pour continuer.',
    buttonText: 'Valider'
  });

  const openModal = (title: string, description?: string, buttonText?: string) => {
    setModalConfig({
      title,
      description: description || 'Remplissez les informations ci-dessous pour continuer.',
      buttonText: buttonText || 'Valider'
    });
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <MockModal 
        isOpen={isOpen} 
        onClose={closeModal} 
        title={modalConfig.title} 
        description={modalConfig.description}
        buttonText={modalConfig.buttonText}
      />
    </ModalContext.Provider>
  );
}
