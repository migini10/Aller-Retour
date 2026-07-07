'use client';

import React from 'react';
import { ConfirmDialog } from './ConfirmDialog';

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
  itemType?: string;
}

export function DeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemType = 'cet élément',
}: DeleteDialogProps) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title={`Supprimer ${itemType} ?`}
      description={`Êtes-vous sûr de vouloir supprimer ${itemName ? `"${itemName}"` : itemType} ? Cette action est irréversible et toutes les données associées seront perdues.`}
      confirmText="Supprimer définitivement"
      cancelText="Annuler"
      isDestructive={true}
    />
  );
}
