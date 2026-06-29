'use client';
import React, { createContext, useContext, useState } from 'react';
import MockModal from './MockModal';
import BookingWizardModal from './BookingWizardModal';
import ColisWizardModal from './ColisWizardModal';
import RechargeWizardModal from './RechargeWizardModal';
import TransferWizardModal from './TransferWizardModal';
import WithdrawalWizardModal from './WithdrawalWizardModal';
import { ErrorBoundary } from './ErrorBoundary';

interface ModalContextType {
  openModal: (title: string, description?: string, buttonText?: string) => void;
  closeModal: () => void;
  openBookingWizard: (typeOrEvent?: 'bus' | 'allo-dakar' | React.MouseEvent, initialData?: { origin?: string; destination?: string, pickupLocation?: string }) => void;
  openColisWizard: () => void;
  openRechargeWizard: () => void;
  openTransferWizard: () => void;
  openWithdrawalWizard: (maxAmount: number) => void;
}

const ModalContext = createContext<ModalContextType>({
  openModal: () => {},
  closeModal: () => {},
  openBookingWizard: (typeOrEvent?: 'bus' | 'allo-dakar' | React.MouseEvent, initialData?: { origin?: string; destination?: string, pickupLocation?: string }) => {},
  openColisWizard: () => {},
  openRechargeWizard: () => {},
  openTransferWizard: () => {},
  openWithdrawalWizard: () => {},
});

export const useModal = () => useContext(ModalContext);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isBookingWizardOpen, setIsBookingWizardOpen] = useState(false);
  const [isColisOpen, setIsColisOpen] = useState(false);
  const [isRechargeOpen, setIsRechargeOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isWithdrawalOpen, setIsWithdrawalOpen] = useState(false);
  const [withdrawalMax, setWithdrawalMax] = useState(0);
  const [bookingWizardType, setBookingWizardType] = useState<'bus' | 'allo-dakar'>('allo-dakar');
  const [bookingWizardData, setBookingWizardData] = useState<{ origin?: string; destination?: string, pickupLocation?: string } | undefined>();
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

  const openBookingWizard = (typeOrEvent?: 'bus' | 'allo-dakar' | React.MouseEvent, initialData?: { origin?: string; destination?: string, pickupLocation?: string }) => {
    if (typeof typeOrEvent === 'string') {
      setBookingWizardType(typeOrEvent);
    }
    setBookingWizardData(initialData);
    setIsBookingWizardOpen(true);
  };
  const closeBookingWizard = () => setIsBookingWizardOpen(false);

  const openColisWizard = () => setIsColisOpen(true);
  const closeColisWizard = () => setIsColisOpen(false);

  const openRechargeWizard = () => setIsRechargeOpen(true);
  const closeRechargeWizard = () => setIsRechargeOpen(false);

  const openTransferWizard = () => setIsTransferOpen(true);
  const closeTransferWizard = () => setIsTransferOpen(false);

  const openWithdrawalWizard = (maxAmount: number) => {
    setWithdrawalMax(maxAmount);
    setIsWithdrawalOpen(true);
  };
  const closeWithdrawalWizard = () => setIsWithdrawalOpen(false);

  return (
    <ModalContext.Provider value={{ openModal, closeModal, openBookingWizard, openColisWizard, openRechargeWizard, openTransferWizard, openWithdrawalWizard }}>
      {children}
      <MockModal 
        isOpen={isOpen} 
        onClose={closeModal} 
        title={modalConfig.title} 
        description={modalConfig.description}
        buttonText={modalConfig.buttonText}
      />
      <ErrorBoundary>
        {isBookingWizardOpen && (
          <BookingWizardModal 
            isOpen={isBookingWizardOpen} 
            onClose={closeBookingWizard} 
            initialType={bookingWizardType}
            initialData={bookingWizardData}
          />
        )}
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
        <WithdrawalWizardModal
          isOpen={isWithdrawalOpen}
          onClose={closeWithdrawalWizard}
          maxAmount={withdrawalMax}
        />
      </ErrorBoundary>
    </ModalContext.Provider>
  );
}
