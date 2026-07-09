'use client';

import React from 'react';
import { AdminPageContainer } from '../components/shared/AdminPageContainer';
import { AdminPageHeader } from '../components/shared/AdminPageHeader';
import { AdminBreadcrumb } from '../components/layout/AdminBreadcrumb';
import { EmptyState } from '../components/ui/EmptyState';
import { motion } from 'framer-motion';
import { useMonitoring } from '../hooks/useMonitoring';
import { RefreshCw, Server, Database, Activity, MemoryStick, AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';

export default function MonitoringPage() {
  const { health, alerts, isLoading, refresh } = useMonitoring();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'HIGH': return 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400';
      case 'MEDIUM': return 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400';
      case 'LOW': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  const getStatusIcon = (status: string | undefined) => {
    if (status === 'ONLINE') return <CheckCircle className="w-5 h-5 text-emerald-500" />;
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  return (
    <AdminPageContainer>
      <AdminBreadcrumb />
      
      <AdminPageHeader 
        title="Monitoring & Santé" 
        description="Vue opérationnelle en temps réel de l'état du système."
        action={
          <button 
            onClick={refresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Rafraîchir
          </button>
        }
      />

      {isLoading && (!health || !alerts) ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-6 mt-6">
          
          {/* SECTION A : SANTÉ SYSTÈME */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">A. Santé système</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              
              {/* API Status */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                className="bg-white dark:bg-[#141414] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Server className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Statut API</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{health?.apiStatus || 'INCONNU'}</p>
                  </div>
                </div>
                {getStatusIcon(health?.apiStatus)}
              </motion.div>

              {/* DB Status */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-white dark:bg-[#141414] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-500">
                    <Database className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Base de données</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{health?.dbStatus || 'INCONNU'}</p>
                  </div>
                </div>
                {getStatusIcon(health?.dbStatus)}
              </motion.div>

              {/* Uptime */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}
                className="bg-white dark:bg-[#141414] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Uptime</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{health?.uptimeFormatted || '0s'}</p>
                  </div>
                </div>
              </motion.div>

              {/* Memory */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }}
                className="bg-white dark:bg-[#141414] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-500">
                    <MemoryStick className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Mémoire Node</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                      {health ? `${health.memoryUsedMb} / ${health.memoryTotalMb} MB` : '0 MB'}
                    </p>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>

          {/* SECTION B : ALERTES RÉCENTES */}
          <div className="pt-4">
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">B. Alertes récentes (7 jours)</h2>
              
              {/* Summary KPIs */}
              {alerts?.summary && (
                <div className="flex gap-4 text-sm font-medium">
                  <span className="text-red-500 bg-red-50 dark:bg-red-500/10 px-3 py-1 rounded-full">
                    Paiements FAILED: {alerts.summary.failedPayments7d}
                  </span>
                  <span className="text-orange-500 bg-orange-50 dark:bg-orange-500/10 px-3 py-1 rounded-full">
                    Notifs FAILED: {alerts.summary.failedNotifications7d}
                  </span>
                  <span className="text-blue-500 bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-full">
                    Gains PENDING: {alerts.summary.pendingDriverEarnings}
                  </span>
                </div>
              )}
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.4 }}
              className="bg-white dark:bg-[#141414] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="px-6 py-4">Gravité</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Message</th>
                      <th className="px-6 py-4">Référence</th>
                      <th className="px-6 py-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(!alerts?.items || alerts.items.length === 0) ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12">
                          <EmptyState 
                            icon={<CheckCircle className="w-12 h-12 text-emerald-500" />}
                            title="Aucune alerte" 
                            description="Tout fonctionne parfaitement. Aucune anomalie n'a été détectée récemment." 
                          />
                        </td>
                      </tr>
                    ) : (
                      alerts.items.map((item, idx) => (
                        <tr key={idx} className="border-b last:border-0 border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${getSeverityColor(item.severity)}`}>
                              {item.severity}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                            {item.type}
                          </td>
                          <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                            {item.message}
                          </td>
                          <td className="px-6 py-4 font-mono text-xs text-slate-500">
                            {item.reference}
                          </td>
                          <td className="px-6 py-4 text-slate-500">
                            {new Date(item.occurredAt).toLocaleString('fr-FR')}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>

        </div>
      )}
    </AdminPageContainer>
  );
}
