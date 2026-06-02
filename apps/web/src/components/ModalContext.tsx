'use client';
import React, { createContext, useContext, useState } from 'react';
import MockModal from './MockModal';
import BookingWizardModal from './BookingWizardModal';
import ColisWizardModal from './ColisWizardModal';
import RechargeWizardModal from './RechargeWizardModal';
import TransferWizardModal from './TransferWizardModal';
import { ErrorBoundary } from './ErrorBoundary';

interface ModalContextType {
  openModal: (title: string, description?: string, buttonText?: string) => void;
  closeModal: () => void;
  openBookingWizard: (typeOrEvent?: 'bus' | 'allo-dakar' | React.MouseEvent) => void;
  openColisWizard: () => void;
  openRechargeWizard: () => void;
  openTransferWizard: () => void;
}

const ModalContext = createContext<ModalContextType>({
  openModal: () => {},
  closeModal: () => {},
  openBookingWizard: (initialType) => {},
  openColisWizard: () => {},
  openRechargeWizard: () => {},
  openTransferWizard: () => {},
});

export const useModal = () => useContext(ModalContext);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isColisOpen, setIsColisOpen] = useState(false);
  const [isRechargeOpen, setIsRechargeOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
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
    console.log("Setting isBookingOpen to true for type:", type); setIsBookingOpen(true);
  };
  const closeBookingWizard = () => setIsBookingOpen(false);

  const openColisWizard = () => setIsColisOpen(true);
  const closeColisWizard = () => setIsColisOpen(false);

  const openRechargeWizard = () => setIsRechargeOpen(true);
  const closeRechargeWizard = () => setIsRechargeOpen(false);

  const openTransferWizard = () => setIsTransferOpen(true);
  const closeTransferWizard = () => setIsTransferOpen(false);

  return (
    <ModalContext.Provider value={{ openModal, closeModal, openBookingWizard, openColisWizard, openRechargeWizard, openTransferWizard }}>
      {children}
      <MockModal 
        isOpen={isOpen} 
        onClose={closeModal} 
        title={modalConfig.title} 
        description={modalConfig.description}
        buttonText={modalConfig.buttonText}
      />
      <ErrorBoundary>
        <BookingWizardModal 
          isOpen={isBookingOpen}
          onClose={closeBookingWizard}
          initialType={bookingType}
        />
        <ColisWizardModal 
          isOpen={isColisOpen}
          onClose={closeColisWizard}
        />
        <RechargeWizardModal
          isOpen={isRechargeOpen}
          onClose={closeRechargeWizard}
        />
        <TransferWizardModal
          isOpen={isTransferOpen}
          onClose={closeTransferWizard}
        />
      </ErrorBoundary>
    </ModalContext.Provider>
  );
}
