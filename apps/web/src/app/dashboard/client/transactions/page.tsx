'use client';

import React, { useState } from 'react';
import { ArrowLeft, Clock, CreditCard, ArrowDownLeft, ArrowUpRight, Search, Download, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function TransactionsHistoryPage() {
  const transactions = [
    {
      id: 'TRX_001',
      type: 'transfer_out',
      title: 'Transfert vers Mamadou N.',
      date: 'Aujourd\'hui • 10:42',
      amount: '- 15 000 FCFA',
      status: 'En attente',
      icon: ArrowUpRight,
      color: 'bg-orange-500/10 text-orange-500',
      isNegative: true,
      isCancelable: true,
    },
    {
      id: 'TRX_002',
      type: 'recharge',
      title: 'Recharge Wave',
      date: 'Hier • 15:30',
      amount: '+ 20 000 FCFA',
      status: 'Terminé',
      icon: ArrowDownLeft,
      color: 'bg-green-500/10 text-green-500',
      isNegative: false,
    },
    {
      id: 'TRX_003',
      type: 'payment',
      title: 'Paiement Colis Express',
      date: '12 Mai 2026 • 09:15',
      amount: '- 2 500 FCFA',
      status: 'Terminé',
      icon: CreditCard,
      color: 'bg-purple-500/10 text-purple-500',
      isNegative: true,
    },
    {
      id: 'TRX_004',
      type: 'payment',
      title: 'Réservation Billet Dakar-Touba',
      date: '10 Mai 2026 • 18:20',
      amount: '- 7 500 FCFA',
      status: 'Terminé',
      icon: CreditCard,
      color: 'bg-purple-500/10 text-purple-500',
      isNegative: true,
    },
    {
      id: 'TRX_005',
      type: 'recharge',
      title: 'Recharge Orange Money',
      date: '05 Mai 2026 • 11:00',
      amount: '+ 50 000 FCFA',
      status: 'Terminé',
      icon: ArrowDownLeft,
      color: 'bg-green-500/10 text-green-500',
      isNegative: false,
    }
  ];

  const [txs, setTxs] = useState(transactions);

  const handleCancel = (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir annuler ce transfert ? Les fonds vous seront restitués car le bénéficiaire ne les a pas encore utilisés.")) {
      setTxs(txs.map(tx => tx.id === id ? { 
        ...tx, 
        status: 'Annulé', 
        isCancelable: false, 
        color: 'bg-slate-500/10 text-slate-500',
        amount: '+ 15 000 FCFA', // Refund simulated
        isNegative: false 
      } : tx));
    }
  };

  return (
    <div className="flex flex-col items-center bg-slate-50 dark:bg-black transition-colors duration-300">
      <div className="w-full max-w-[1000px] px-5 sm:px-8 lg:px-12 py-8 pb-24 space-y-8 animate-fade-in">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-200 dark:border-[#2A2A2A]">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/client/wallet" className="p-2.5 bg-white dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#2A2A2A] rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors shadow-sm">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                <Clock className="w-7 h-7 text-slate-500" /> Historique
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Toutes vos transactions récentes</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#333333] rounded-xl text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-[#222222] transition-colors shadow-sm">
            <Download className="w-4 h-4" /> Exporter
          </button>
        </div>

        {/* Search & Filter (Mock) */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Rechercher une transaction..."
              className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#333333] rounded-xl focus:border-blue-500 dark:focus:border-blue-500 outline-none transition-colors text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white dark:bg-[#1A1A1A] rounded-3xl border border-slate-200 dark:border-[#2A2A2A] overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 dark:border-[#222222]">
            <h3 className="font-bold text-slate-900 dark:text-white">Toutes les opérations</h3>
          </div>
          
          <div className="divide-y divide-slate-100 dark:divide-[#222222]">
            {txs.map((tx) => (
              <div key={tx.id} className="p-5 sm:p-6 hover:bg-slate-50 dark:hover:bg-[#222222]/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${tx.color}`}>
                    <tx.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-base">{tx.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> {tx.date} • Réf: {tx.id}
                    </p>
                  </div>
                </div>
                <div className="sm:text-right ml-16 sm:ml-0 flex flex-col items-start sm:items-end">
                  <p className={`font-black text-lg ${
                    tx.status === 'Annulé' ? 'text-slate-500 line-through' :
                    tx.isNegative ? 'text-slate-900 dark:text-white' : 'text-green-600 dark:text-green-500'
                  }`}>
                    {tx.amount}
                  </p>
                  <p className={`text-[10px] uppercase font-bold inline-block px-2 py-0.5 rounded border mt-1 ${
                    tx.status === 'Annulé' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                    tx.status === 'En attente' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                    'bg-slate-500/10 text-slate-500 border-slate-500/20'
                  }`}>
                    {tx.status}
                  </p>
                  
                  {tx.isCancelable && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleCancel(tx.id); }}
                      className="mt-2 text-xs font-bold text-red-500 hover:text-red-400 hover:underline flex items-center gap-1 bg-red-50 dark:bg-red-500/10 px-2 py-1 rounded-md transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Annuler dans les (24H)
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
}
