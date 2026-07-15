'use client';

import React, { useState } from 'react';
import { User, UserStatus, UserPermissions } from '../../types/user.types';
import { ShieldBan, ShieldCheck, KeyRound, Clock, Bug } from 'lucide-react';
import { UsersService } from '../../services/users.service';

interface UserActionsProps {
  user: User;
  permissions: UserPermissions;
  onRefresh: () => void;
}

export function UserActions({ user, permissions, onRefresh }: UserActionsProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const isSuspended = user.status === UserStatus.SUSPENDED || user.status === UserStatus.BANNED;

  const handleStatusChange = async (action: 'ACTIVATE' | 'SUSPEND') => {
    try {
      setIsProcessing(true);
      await UsersService.updateUserStatus(user.id, action);
      onRefresh();
    } catch (error) {
      console.error('Failed to update status', error);
      alert('Erreur lors de la mise à jour du statut');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetPin = async () => {
    if (!window.confirm('Voulez-vous forcer la réinitialisation du PIN de cet utilisateur ?')) return;
    
    try {
      setIsProcessing(true);
      await UsersService.resetUserPin(user.id);
      alert('Demande de réinitialisation envoyée avec succès.');
      onRefresh();
    } catch (error) {
      console.error('Failed to reset pin', error);
      alert('Erreur lors de la réinitialisation du PIN');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerifyTestAccount = async () => {
    if (!window.confirm('Voulez-vous valider ce compte de test manuellement ?')) return;
    
    try {
      setIsProcessing(true);
      await UsersService.verifyTestAccount(user.id);
      alert('Compte de test validé avec succès');
      onRefresh();
    } catch (error: any) {
      console.error('Failed to verify test account', error);
      alert(error?.response?.data?.message || error?.message || 'Erreur lors de la validation du compte de test');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMarkTestAccount = async () => {
    if (!window.confirm('Voulez-vous marquer cet utilisateur comme compte de test ?')) return;
    
    try {
      setIsProcessing(true);
      await UsersService.markTestAccount(user.id);
      alert('Compte marqué comme compte de test avec succès');
      onRefresh();
    } catch (error: any) {
      console.error('Failed to mark test account', error);
      alert(error?.response?.data?.message || error?.message || 'Erreur lors du marquage du compte de test');
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
              onClick={() => handleStatusChange('SUSPEND')}
              disabled={isProcessing}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-rose-50 text-rose-600 dark:hover:bg-rose-500/10 transition-colors text-left w-full font-semibold text-sm disabled:opacity-50"
            >
              <ShieldBan className="w-5 h-5 shrink-0" />
              Suspendre le compte
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
          <button className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-700 dark:hover:bg-slate-800 dark:text-slate-300 transition-colors text-left w-full font-semibold text-sm">
            <Clock className="w-5 h-5 shrink-0" />
            Voir l'historique de sécurité
          </button>
        )}
      </div>
    </div>
  );
}