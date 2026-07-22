'use client';

import React, { useState } from 'react';
import { User, UserStatus, UserPermissions } from '../../types/user.types';
import { ShieldBan, ShieldCheck, KeyRound, Clock, Bug } from 'lucide-react';
import { UsersService } from '../../services/users.service';
import { useModal } from '../../../../../components/ModalContext';
import { BanUserModal } from './BanUserModal';
import { SecurityHistoryModal } from './SecurityHistoryModal';

interface UserActionsProps {
  user: User;
  permissions: UserPermissions;
  onRefresh: () => void;
}

export function UserActions({ user, permissions, onRefresh }: UserActionsProps) {
  const { showConfirmDialog, showToast } = useModal();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const isSuspended = user.status === UserStatus.SUSPENDED || user.status === UserStatus.BANNED;

  const handleStatusChange = async (action: 'ACTIVATE' | 'SUSPEND') => {
    try {
      setIsProcessing(true);
      await UsersService.updateUserStatus(user.id, action);
      onRefresh();
    } catch (error) {
      console.error('Failed to update status', error);
      showToast('Erreur lors de la mise à jour du statut', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBanUser = async (reason: string) => {
    try {
      setIsProcessing(true);
      await UsersService.updateUserStatus(user.id, 'BLOCK' as any, reason);
      showToast('Utilisateur banni avec succès', 'success');
      onRefresh();
    } catch (error) {
      console.error('Failed to ban user', error);
      showToast('Erreur lors du bannissement de l\'utilisateur', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetPin = async () => {
    if (!(await showConfirmDialog('Réinitialiser le PIN', 'Voulez-vous forcer la réinitialisation du PIN de cet utilisateur ?', 'danger'))) return;
    
    try {
      setIsProcessing(true);
      await UsersService.resetUserPin(user.id);
      showToast('Demande de réinitialisation envoyée avec succès.', 'success');
      onRefresh();
    } catch (error) {
      console.error('Failed to reset pin', error);
      showToast('Erreur lors de la réinitialisation du PIN', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerifyTestAccount = async () => {
    if (!(await showConfirmDialog('Valider compte de test', 'Voulez-vous valider ce compte de test manuellement ?'))) return;
    
    try {
      setIsProcessing(true);
      await UsersService.verifyTestAccount(user.id);
      showToast('Compte de test validé avec succès', 'success');
      onRefresh();
    } catch (error: any) {
      console.error('Failed to verify test account', error);
      showToast(error?.response?.data?.message || error?.message || 'Erreur lors de la validation du compte de test', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMarkTestAccount = async () => {
    if (!(await showConfirmDialog('Marquer comme test', 'Voulez-vous marquer cet utilisateur comme compte de test ?'))) return;
    
    try {
      setIsProcessing(true);
      await UsersService.markTestAccount(user.id);
      showToast('Compte marqué comme compte de test avec succès', 'success');
      onRefresh();
    } catch (error: any) {
      console.error('Failed to mark test account', error);
      showToast(error?.response?.data?.message || error?.message || 'Erreur lors du marquage du compte de test', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#141414] rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100 dark:border-slate-800/50">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Actions Administratives</h3>
      </div>
      <div className="p-4 flex flex-col gap-2">
        {permissions.canSuspendUser && (
          !isSuspended ? (
            <button 
              onClick={() => setIsBanModalOpen(true)}
              disabled={isProcessing}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-rose-50 text-rose-600 dark:hover:bg-rose-500/10 transition-colors text-left w-full font-semibold text-sm disabled:opacity-50"
            >
              <ShieldBan className="w-5 h-5 shrink-0" />
              Bannir le compte
            </button>
          ) : (
            <button 
              onClick={() => handleStatusChange('ACTIVATE')}
              disabled={isProcessing}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50 text-emerald-600 dark:hover:bg-emerald-500/10 transition-colors text-left w-full font-semibold text-sm disabled:opacity-50"
            >
              <ShieldCheck className="w-5 h-5 shrink-0" />
              Réactiver le compte
            </button>
          )
        )}
        
        {user.isTestAccount && !user.verifiedAt && (
          <button 
            onClick={handleVerifyTestAccount}
            disabled={isProcessing}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-blue-600 dark:hover:bg-blue-500/10 transition-colors text-left w-full font-semibold text-sm disabled:opacity-50"
          >
            <ShieldCheck className="w-5 h-5 shrink-0" />
            Valider le compte de test
          </button>
        )}

        {!user.isTestAccount && permissions.canEditUser && (
          <button 
            onClick={handleMarkTestAccount}
            disabled={isProcessing}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-purple-50 text-purple-600 dark:hover:bg-purple-500/10 transition-colors text-left w-full font-semibold text-sm disabled:opacity-50"
          >
            <Bug className="w-5 h-5 shrink-0" />
            Marquer comme compte de test
          </button>
        )}
        
        {permissions.canResetPin && (
          <button 
            onClick={handleResetPin}
            disabled={isProcessing}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-orange-50 text-orange-600 dark:hover:bg-orange-500/10 transition-colors text-left w-full font-semibold text-sm disabled:opacity-50"
          >
            <KeyRound className="w-5 h-5 shrink-0" />
            Forcer réinitialisation PIN
          </button>
        )}

        {permissions.canViewUser && (
          <button 
            onClick={() => setIsHistoryModalOpen(true)}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-700 dark:hover:bg-slate-800 dark:text-slate-300 transition-colors text-left w-full font-semibold text-sm"
          >
            <Clock className="w-5 h-5 shrink-0" />
            Voir l'historique de sécurité
          </button>
        )}
      </div>

      <BanUserModal 
        isOpen={isBanModalOpen} 
        onClose={() => setIsBanModalOpen(false)} 
        onConfirm={handleBanUser} 
        userName={`${user.firstName} ${user.lastName}`} 
      />

      <SecurityHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        userId={user.id}
      />
    </div>
  );
}