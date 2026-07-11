'use client';

import { getApiUrl } from '@/lib/config';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Wallet, ArrowDownLeft, ArrowUpRight, Plus, Sparkles, CreditCard, Clock, Activity, Download } from 'lucide-react';
import Link from 'next/link';
import { useModal } from '../../../../components/ModalContext';

export default function WalletPage() {
  const { openModal, openRechargeWizard, openTransferWizard } = useModal();
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const fetchBalance = async () => {
      const token = localStorage.getItem('ar_auth_token');
      if (!token) return;
      try {
        const apiUrl = getApiUrl();
        
        const res = await fetch(`${apiUrl}/v1/wallets/my-balance`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setWalletBalance(data.balance);
        }

        const resTx = await fetch(`${apiUrl}/v1/wallets/my-transactions`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resTx.ok) {
          const dataTx = await resTx.json();
          setTransactions(dataTx);
        }
      } catch (e) {
        console.error("Erreur solde wallet", e);
      }
    };
    
    fetchBalance();

    window.addEventListener('focus', fetchBalance);
    window.addEventListener('wallet_updated', fetchBalance);

    return () => {
      window.removeEventListener('focus', fetchBalance);
      window.removeEventListener('wallet_updated', fetchBalance);
    };
  }, []);
  
  return (
    <div className="flex flex-col items-center bg-slate-50 dark:bg-black transition-colors duration-300">
      <div className="w-full max-w-[1200px] px-5 sm:px-8 lg:px-12 py-8 pb-24 space-y-8 animate-fade-in">
        
        {/* Header with Back Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-200 dark:border-[#2A2A2A]">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/client" className="p-2.5 bg-white dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#2A2A2A] rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors shadow-sm">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                <Wallet className="w-7 h-7 text-blue-500" /> Mon Wallet
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Gérez vos fonds et vos paiements en toute sécurité.</p>
            </div>
          </div>
          <button onClick={openRechargeWizard} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3.5 rounded-2xl transition-colors shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" /> Recharger le compte
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Main Card (Balance & Quick Actions) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-900/20">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 blur-3xl rounded-full"></div>
              <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-indigo-900/40 blur-3xl rounded-full"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                    <Sparkles className="w-4 h-4 text-blue-200" />
                    <span className="text-xs font-bold text-blue-50 tracking-wider uppercase">Compte Principal</span>
                  </div>
                  <Wallet className="w-6 h-6 text-blue-200 opacity-80" />
                </div>
                
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">Solde disponible</p>
                  <p className="text-4xl sm:text-5xl font-black tracking-tight">{walletBalance !== null ? walletBalance.toLocaleString('fr-FR') : '---'} <span className="text-xl font-bold text-blue-200">FCFA</span></p>
                </div>
                
                <div className="mt-8">
                  <button onClick={openTransferWizard} className="w-full bg-white text-blue-600 hover:bg-blue-50 font-bold py-3.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-black/10">
                    <ArrowUpRight className="w-5 h-5" /> Envoyer du solde
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A] rounded-3xl p-6 shadow-xl">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-slate-400" /> Statistiques du mois</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-500 dark:text-slate-400">Dépenses</span>
                    <span className="font-bold text-slate-900 dark:text-white">12 500 FCFA</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-[#222222] rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-500 dark:text-slate-400">Recharges</span>
                    <span className="font-bold text-slate-900 dark:text-white">25 000 FCFA</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-[#222222] rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Transactions List */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A] rounded-3xl p-6 sm:p-8 shadow-xl h-full flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Dernières Transactions</h2>
                <button className="text-blue-600 dark:text-blue-400 font-bold text-sm hover:underline flex items-center gap-1">
                  <Download className="w-4 h-4" /> Relevé PDF
                </button>
              </div>

              <div className="space-y-4 flex-1 overflow-y-auto pr-2">
                {transactions.length === 0 ? (
                  <p className="text-slate-500 text-sm italic py-4">Aucune transaction pour le moment.</p>
                ) : (
                  transactions.map((tx) => (
                    <div key={tx.id} className="flex flex-col sm:flex-row justify-between sm:items-center p-4 bg-slate-50 dark:bg-[#1A1A1A] rounded-2xl border border-slate-100 dark:border-[#222222] group hover:border-blue-500/30 transition-colors gap-3">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          tx.type === 'DEPOSIT' || tx.type === 'REFUND' 
                            ? 'bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white' 
                            : 'bg-amber-500/10 text-amber-500 group-hover:bg-amber-500 group-hover:text-white'
                        }`}>
                          {tx.type === 'DEPOSIT' || tx.type === 'REFUND' ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white text-base">
                            {tx.type === 'DEPOSIT' ? 'Rechargement Wallet' : tx.type === 'TICKET_PURCHASE' ? 'Achat de Billet' : tx.type === 'TRANSFER' ? 'Transfert' : 'Transaction'}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" /> {new Date(tx.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })} • Réf: {tx.id.split('-')[0].toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <div className="sm:text-right ml-16 sm:ml-0">
                        <p className={`font-black text-lg ${tx.type === 'DEPOSIT' || tx.type === 'REFUND' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                          {tx.type === 'DEPOSIT' || tx.type === 'REFUND' ? '+' : '-'} {tx.amount.toLocaleString('fr-FR')} FCFA
                        </p>
                        <p className={`text-[10px] uppercase font-bold inline-block px-2 py-0.5 rounded border mt-1 ${
                          tx.status === 'COMPLETED' ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' : 
                          tx.status === 'ESCROW' ? 'text-amber-500 bg-amber-500/10 border-amber-500/20' :
                          'text-slate-500 bg-slate-500/10 border-slate-500/20'
                        }`}>
                          {tx.status}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <Link href="/dashboard/client/transactions" className="block text-center w-full mt-6 py-3.5 rounded-xl border-2 border-dashed border-slate-200 dark:border-[#333333] text-slate-500 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-[#1A1A1A] hover:text-slate-900 dark:hover:text-white transition-colors">
                Voir tout l'historique
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
