'use client';
import React from 'react';
import { Building2, FileText, CheckCircle2, MapPin, Briefcase } from 'lucide-react';

export default function SectionEntreprise() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-white flex items-center gap-2"><Building2 className="w-5 h-5 text-indigo-400" /> Profil Entreprise / GIE</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations Générales */}
        <div className="bg-[#101728] border border-slate-800/80 rounded-2xl p-6 lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white flex items-center gap-2"><Briefcase className="w-4 h-4 text-indigo-400" /> Informations Légales</h3>
            <button className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg border border-slate-700 transition-colors">Modifier</button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs text-slate-500 font-semibold mb-1 block">Raison Sociale</label>
              <input type="text" value="Sénégal Express GIE" readOnly className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 outline-none" />
            </div>
            <div>
              <label className="text-xs text-slate-500 font-semibold mb-1 block">Numéro NINEA</label>
              <input type="text" value="001234567 2V2" readOnly className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 outline-none font-mono" />
            </div>
            <div>
              <label className="text-xs text-slate-500 font-semibold mb-1 block">Registre du Commerce (RCCM)</label>
              <input type="text" value="SN-DKR-2019-B-12345" readOnly className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 outline-none font-mono" />
            </div>
            <div>
              <label className="text-xs text-slate-500 font-semibold mb-1 block">Type de structure</label>
              <input type="text" value="Groupement d'Intérêt Économique (GIE)" readOnly className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 outline-none" />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <h3 className="font-bold text-white flex items-center gap-2 mb-4"><MapPin className="w-4 h-4 text-orange-400" /> Adresses & Contacts</h3>
            <div className="grid grid-cols-1 gap-5">
              <div>
                <label className="text-xs text-slate-500 font-semibold mb-1 block">Siège Social</label>
                <input type="text" value="Gare Routière des Baux Maraîchers, Pikine, Dakar" readOnly className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 outline-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Documents Administratifs */}
        <div className="bg-[#101728] border border-slate-800/80 rounded-2xl p-6">
          <h3 className="font-bold text-white flex items-center gap-2 mb-6"><FileText className="w-4 h-4 text-emerald-400" /> Documents Validés</h3>
          
          <div className="space-y-3">
            {[
              { nom: 'Statuts du GIE', date: '12 Jan 2024' },
              { nom: 'Certificat NINEA', date: '12 Jan 2024' },
              { nom: 'Agrément Transport', date: '05 Mar 2024' },
              { nom: 'Attestation Fiscale', date: 'En attente' }
            ].map((doc, i) => (
              <div key={i} className={`p-3 rounded-xl border ${doc.date === 'En attente' ? 'bg-amber-500/10 border-amber-500/20' : 'bg-slate-900/50 border-slate-800'} flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <FileText className={`w-5 h-5 ${doc.date === 'En attente' ? 'text-amber-400' : 'text-emerald-400'}`} />
                  <div>
                    <p className="text-sm font-semibold text-white">{doc.nom}</p>
                    <p className="text-[10px] text-slate-500">{doc.date}</p>
                  </div>
                </div>
                {doc.date !== 'En attente' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <button className="text-[10px] bg-amber-500 text-amber-950 font-bold px-2 py-1 rounded">Uploader</button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
