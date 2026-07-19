'use client';
import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import MockModal from './MockModal';
import BookingWizardModal from './BookingWizardModal';
import ColisWizardModal from './ColisWizardModal';
import RechargeWizardModal from './RechargeWizardModal';
import TransferWizardModal from './TransferWizardModal';
import WithdrawalWizardModal from './WithdrawalWizardModal';
import ConfirmModal from './ConfirmModal';
import PromptModal from './PromptModal';
import ToastContainer, { ToastMessage, ToastType } from './ToastContainer';
import { ErrorBoundary } from './ErrorBoundary';

interface ModalContextType {
  openModal: (title: string, description?: string, buttonText?: string) => void;
  closeModal: () => void;
  openBookingWizard: (typeOrEvent?: 'bus' | 'allo-dakar' | React.MouseEvent, initialData?: { origin?: string; destination?: string, pickupLocation?: string }) => void;
  openColisWizard: () => void;
  openRechargeWizard: () => void;
  openTransferWizard: () => void;
  openWithdrawalWizard: (maxAmount: number) => void;
  
  showConfirmDialog: (title: string, description: string, variant?: 'info' | 'danger') => Promise<boolean>;
  showPromptDialog: (title: string, description?: string, defaultValue?: string) => Promise<string | null>;
  showToast: (message: string, type?: ToastType) => void;
}

const ModalContext = createContext<ModalContextType>({
  openModal: () => {},
  closeModal: () => {},
  openBookingWizard: (typeOrEvent?: 'bus' | 'allo-dakar' | React.MouseEvent, initialData?: { origin?: string; destination?: string, pickupLocation?: string }) => {},
  openColisWizard: () => {},
  openRechargeWizard: () => {},
  openTransferWizard: () => {},
  openWithdrawalWizard: () => {},
  
  showConfirmDialog: async () => false,
  showPromptDialog: async () => null,
  showToast: () => {},
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

  // Toasts State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  // Confirm Dialog State
  const [confirmConfig, setConfirmConfig] = useState<{ isOpen: boolean; title: string; description: string; variant: 'info' | 'danger' }>({ isOpen: false, title: '', description: '', variant: 'info' });
  const confirmPromiseResolve = useRef<((value: boolean) => void) | null>(null);

  const showConfirmDialog = useCallback((title: string, description: string, variant: 'info' | 'danger' = 'info') => {
    setConfirmConfig({ isOpen: true, title, description, variant });
    return new Promise<boolean>((resolve) => {
      confirmPromiseResolve.current = resolve;
    });
  }, []);

  const handleConfirmAction = useCallback((value: boolean) => {
    setConfirmConfig(prev => ({ ...prev, isOpen: false }));
    if (confirmPromiseResolve.current) {
      confirmPromiseResolve.current(value);
      confirmPromiseResolve.current = null;
    }
  }, []);

  // Prompt Dialog State
  const [promptConfig, setPromptConfig] = useState<{ isOpen: boolean; title: string; description?: string; defaultValue?: string }>({ isOpen: false, title: '' });
  const promptPromiseResolve = useRef<((value: string | null) => void) | null>(null);

  const showPromptDialog = useCallback((title: string, description?: string, defaultValue?: string) => {
    setPromptConfig({ isOpen: true, title, description, defaultValue });
    return new Promise<string | null>((resolve) => {
      promptPromiseResolve.current = resolve;
    });
  }, []);

  const handlePromptAction = useCallback((value: string | null) => {
    setPromptConfig(prev => ({ ...prev, isOpen: false }));
    if (promptPromiseResolve.current) {
      promptPromiseResolve.current(value);
      promptPromiseResolve.current = null;
    }
  }, []);

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
    <ModalContext.Provider value={{ openModal, closeModal, openBookingWizard, openColisWizard, openRechargeWizard, openTransferWizard, openWithdrawalWizard, showConfirmDialog, showPromptDialog, showToast }}>
      {children}
      
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <ConfirmModal 
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        description={confirmConfig.description}
        variant={confirmConfig.variant}
        onConfirm={() => handleConfirmAction(true)}
        onCancel={() => handleConfirmAction(false)}
      />

      <PromptModal
        isOpen={promptConfig.isOpen}
        title={promptConfig.title}
        description={promptConfig.description}
        defaultValue={promptConfig.defaultValue}
        onConfirm={(val) => handlePromptAction(val)}
        onCancel={() => handlePromptAction(null)}
      />

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
