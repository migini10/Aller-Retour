'use client';
import React, { useState, useEffect } from 'react';
import { Wallet, ArrowUpRight, TrendingUp, Calendar, CreditCard, ChevronRight, Loader2 } from 'lucide-react';
import { useAuth } from '../../../../components/AuthContext';

export default function SectionRevenus() {
  const { token, fetchWithAuth } = useAuth();
  const [balance, setBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFinanceData = async () => {
      if (!token) return;
      try {
        const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
        const apiUrl = base.endsWith('/v1') ? base : `${base}/v1`;
        
        // Fetch driver wallet balance
        const balanceRes = await fetchWithAuth(`${apiUrl}/wallets/driver-balance`);
        if (balanceRes.ok) {
          const balanceData = await balanceRes.json();
          setBalance(balanceData.balance);
        }

        // Fetch driver transactions
        const txRes = await fetchWithAuth(`${apiUrl}/wallets/driver-transactions`);
        if (txRes.ok) {
          const txData = await txRes.json();
          setTransactions(txData);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données financières du chauffeur", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFinanceData();
  }, [token]);

  // Calculate stats dynamically from transaction history
  const today = new Date();
  
  // Today's earnings (positive amounts only)
  const todayEarnings = transactions
    .filter(t => {
      const txDate = new Date(t.createdAt);
      return txDate.toDateString() === today.toDateString() && t.amount > 0;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  // This week's earnings (7 days ago till now)
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(today.getDate() - 7);
  const weekEarnings = transactions
    .filter(t => {
      const txDate = new Date(t.createdAt);
      return txDate >= oneWeekAgo && txDate <= today && t.amount > 0;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  // This month's earnings (30 days ago till now)
  const oneMonthAgo = new Date();
  oneMonthAgo.setDate(today.getDate() - 30);
  const monthEarnings = transactions
    .filter(t => {
      const txDate = new Date(t.createdAt);
      return txDate >= oneMonthAgo && txDate <= today && t.amount > 0;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const stats = [
    { label: 'Revenus aujourd\'hui', val: `${todayEarnings.toLocaleString('fr-FR')} F`, type: 'jour' },
    { label: 'Revenus semaine', val: `${weekEarnings.toLocaleString('fr-FR')} F`, type: 'semaine' },
    { label: 'Revenus mois', val: `${monthEarnings.toLocaleString('fr-FR')} F`, type: 'mois' },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        <p className="text-sm text-slate-500 dark:text-slate-400">Chargement de vos revenus...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 transition-colors"><Wallet className="w-5 h-5 text-orange-500 dark:text-orange-400" /> Revenus & Wallet</h2>

      {/* Main Balance Card */}
      <div className="bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 rounded-3xl p-6 text-white shadow-xl shadow-orange-500/20 relative overflow-hidden">
        <Wallet className="absolute -right-6 -bottom-6 w-48 h-48 text-white/10" />
        <div className="relative z-10">
          <p className="text-sm font-medium opacity-80 uppercase tracking-wider">Solde Disponible</p>
          <p className="text-4xl sm:text-5xl font-bold mt-2">{(balance ?? 0).toLocaleString('fr-FR')} <span className="text-2xl font-semibold">FCFA</span></p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button className="flex-1 bg-white text-orange-600 hover:bg-slate-50 font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2">
              <ArrowUpRight className="w-5 h-5" /> Retrait instantané
            </button>
            <button className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2">
              <CreditCard className="w-5 h-5" /> Méthodes de retrait
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(s => (
          <div key={s.type} className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A]/80 rounded-2xl p-5 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold transition-colors">{s.label}</p>
              <TrendingUp className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">{s.val}</p>
          </div>
        ))}
      </div>

      {/* History */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold transition-colors">Historique récent</p>
          <button className="text-xs text-orange-600 dark:text-orange-400 hover:text-orange-500 dark:hover:text-orange-300 font-semibold flex items-center gap-1 transition-colors">Voir tout <ChevronRight className="w-3.5 h-3.5" /></button>
        </div>
        
        {transactions.length === 0 ? (
          <div className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A]/80 rounded-2xl p-8 text-center text-slate-500 dark:text-slate-400 transition-colors">
            Aucune transaction dans votre historique.
          </div>
        ) : (
          <div className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A]/80 rounded-2xl overflow-hidden divide-y divide-slate-200 dark:divide-slate-800/60 transition-colors">
            {transactions.map(t => {
              const txDate = new Date(t.createdAt);
              const formattedDate = `${txDate.toLocaleDateString('fr-FR')} ${txDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
              return (
                <div key={t.id} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 dark:hover:bg-[#222222]/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${t.amount > 0 ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-[#222222] text-slate-500 dark:text-slate-400'}`}>
                      {t.amount > 0 ? <TrendingUp className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-sm text-slate-900 dark:text-white font-semibold transition-colors">{t.description || (t.amount > 0 ? 'Crédit reçu' : 'Débit / Retrait')}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5 transition-colors"><Calendar className="w-3 h-3" /> {formattedDate}</p>
                    </div>
                  </div>
                  <span className={`font-bold text-sm whitespace-nowrap transition-colors ${t.amount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                    {t.amount > 0 ? '+' : ''}{t.amount.toLocaleString('fr-FR')} F
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
