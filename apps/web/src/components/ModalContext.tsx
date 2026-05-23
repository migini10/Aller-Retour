'use client';
import React, { createContext, useContext, useState } from 'react';
import MockModal from './MockModal';
import BookingWizardModal from './BookingWizardModal';

interface ModalContextType {
  openModal: (title: string, description?: string, buttonText?: string) => void;
  closeModal: () => void;
  openBookingWizard: (typeOrEvent?: 'bus' | 'allo-dakar' | React.MouseEvent) => void;
}

const ModalContext = createContext<ModalContextType>({
  openModal: () => {},
  closeModal: () => {},
  openBookingWizard: (initialType) => {},
});

export const useModal = () => useContext(ModalContext);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingType, setBookingType] = useState<'bus' | 'allo-dakar'>('bus');
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

  const openBookingWizard = (typeOrEvent?: 'bus' | 'allo-dakar' | React.MouseEvent) => {
    const type = typeof typeOrEvent === 'string' ? typeOrEvent : 'bus';
    setBookingType(type);
    setIsBookingOpen(true);
  };
  const closeBookingWizard = () => setIsBookingOpen(false);

  return (
    <ModalContext.Provider value={{ openModal, closeModal, openBookingWizard }}>
      {children}
      <MockModal 
        isOpen={isOpen} 
        onClose={closeModal} 
        title={modalConfig.title} 
        description={modalConfig.description}
        buttonText={modalConfig.buttonText}
      />
      <BookingWizardModal 
        isOpen={isBookingOpen}
        onClose={closeBookingWizard}
        initialType={bookingType}
      />
    </ModalContext.Provider>
  );
}
