'use client';

import React, { useState, useEffect } from 'react';
import { AdminPageContainer } from '../components/shared/AdminPageContainer';
import { AdminPageHeader } from '../components/shared/AdminPageHeader';
import { AdminBreadcrumb } from '../components/layout/AdminBreadcrumb';
import { motion } from 'framer-motion';
import { useSettings } from '../hooks/useSettings';
import { Save, Settings2, ShieldCheck, Mail, Phone, DollarSign, Activity, HelpCircle } from 'lucide-react';
import { UpdateSettingsPayload } from '../types/settings.types';

export default function SettingsPage() {
  const { settings, isLoading, isSaving, fetchSettings, updateSettings } = useSettings();
  
  const [formData, setFormData] = useState<UpdateSettingsPayload>({});

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    if (settings) {
      setFormData({
        platformName: settings.platformName,
        supportEmail: settings.supportEmail,
        supportPhone: settings.supportPhone,
        defaultCurrency: settings.defaultCurrency,
        clientCommissionRate: settings.clientCommissionRate,
        driverCommissionRate: settings.driverCommissionRate,
        maintenanceMode: settings.maintenanceMode,
      });
    }
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      const parsed = parseFloat(value);
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 20) {
        setFormData(prev => ({ ...prev, [name]: parsed }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    if (formData.clientCommissionRate === undefined || isNaN(formData.clientCommissionRate)) {
      alert("Le taux de commission client est invalide.");
      return;
    }
    if (formData.driverCommissionRate === undefined || isNaN(formData.driverCommissionRate)) {
      alert("Le taux de commission chauffeur est invalide.");
      return;
    }

    const success = await updateSettings(formData);
    if (success) {
      alert('Paramètres sauvegardés avec succès !');
    }
  };

  if (isLoading && !settings) {
    return (
      <AdminPageContainer>
        <AdminBreadcrumb />
        <AdminPageHeader title="Paramètres" description="Chargement de la configuration..." />
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminPageContainer>
    );
  }

  return (
    <AdminPageContainer>
      <AdminBreadcrumb />
      
      <AdminPageHeader 
        title="Paramètres Globaux" 
        description="Configuration de la marketplace, des commissions et du statut du système."
        action={
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Sauvegarder
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        
        {/* SECTION GÉNÉRAL */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-[#141414] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800/60">
            <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-500">
              <Settings2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Identité & Contact</h2>
              <p className="text-sm text-slate-500">Informations publiques de la plateforme</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2">
                Nom de la plateforme
              </label>
              <input 
                type="text" 
                name="platformName"
                value={formData.platformName || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" /> Email Support
                </label>
                <input 
                  type="email" 
                  name="supportEmail"
                  value={formData.supportEmail || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" /> Téléphone Support
                </label>
                <input 
                  type="text" 
                  name="supportPhone"
                  value={formData.supportPhone || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* SECTION FINANCES */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white dark:bg-[#141414] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800/60">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-500">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Finances & Commissions</h2>
              <p className="text-sm text-slate-500">Règles métier et tarification</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2">
                Devise par défaut
              </label>
              <input 
                type="text" 
                name="defaultCurrency"
                value={formData.defaultCurrency || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors uppercase"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Commission Client (%)</span>
                  <div className="group relative">
                    <HelpCircle className="w-4 h-4 text-slate-400" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-xs text-white rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 text-center">
                      Frais ajoutés au prix du billet (Max: 20%)
                    </div>
                  </div>
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    min="0" max="20" step="0.1"
                    name="clientCommissionRate"
                    value={formData.clientCommissionRate ?? ''}
                    onChange={handleChange}
                    className="w-full pl-4 pr-8 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">%</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Commission Chauffeur (%)</span>
                  <div className="group relative">
                    <HelpCircle className="w-4 h-4 text-slate-400" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-xs text-white rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 text-center">
                      Part déduite du gain du chauffeur (Max: 20%)
                    </div>
                  </div>
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    min="0" max="20" step="0.1"
                    name="driverCommissionRate"
                    value={formData.driverCommissionRate ?? ''}
                    onChange={handleChange}
                    className="w-full pl-4 pr-8 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">%</span>
                </div>
              </div>
            </div>

            {/* Simulation */}
            <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Simulation sur 10 000 FCFA</h4>
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-slate-600 dark:text-slate-400">Le client paie :</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {(10000 + (10000 * (formData.clientCommissionRate || 0) / 100)).toLocaleString('fr-FR')} FCFA
                </span>
              </div>
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-slate-600 dark:text-slate-400">Le chauffeur reçoit :</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {(10000 - (10000 * (formData.driverCommissionRate || 0) / 100)).toLocaleString('fr-FR')} FCFA
                </span>
              </div>
              <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400">Revenu plateforme :</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-500">
                  {((10000 * (formData.clientCommissionRate || 0) / 100) + (10000 * (formData.driverCommissionRate || 0) / 100)).toLocaleString('fr-FR')} FCFA
                </span>
              </div>
            </div>

          </div>
        </motion.div>

        {/* SECTION SYSTEME */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white dark:bg-[#141414] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm lg:col-span-2"
        >
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800/60">
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-500/10 flex items-center justify-center text-red-600 dark:text-red-500">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Système & Maintenance</h2>
              <p className="text-sm text-slate-500">Gestion de l'état global de la plateforme</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl">
            <div className="flex gap-4 items-start">
              <div className="mt-1">
                <Activity className={`w-5 h-5 ${formData.maintenanceMode ? 'text-red-500' : 'text-emerald-500'}`} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">Mode Maintenance</h3>
                <p className="text-sm text-slate-500 max-w-2xl">
                  Désactive temporairement les réservations, les créations de trajets et les paiements pour les passagers et chauffeurs. Le back-office et les webhooks restent actifs.
                </p>
              </div>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer ml-4">
              <input 
                type="checkbox" 
                name="maintenanceMode"
                className="sr-only peer" 
                checked={formData.maintenanceMode || false}
                onChange={handleChange}
              />
              <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-slate-600 peer-checked:bg-red-500"></div>
            </label>
          </div>

        </motion.div>

      </div>

    </AdminPageContainer>
  );
}
