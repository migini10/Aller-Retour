'use client';
import React from 'react';
import { ShieldCheck, FileText, CheckCircle2, XCircle, AlertTriangle, Eye } from 'lucide-react';

const validations = [
  { id: 'VAL-091', type: 'Création GIE', subject: 'Nouveau Transporteur - Touba Voyage', date: 'Il y a 2h', priority: 'Haute' },
  { id: 'VAL-092', type: 'Permis Chauffeur', subject: 'Renouvellement Permis - Ousmane Fall', date: 'Il y a 4h', priority: 'Normale' },
  { id: 'VAL-093', type: 'Véhicule', subject: 'Assurance & Visite Tech - DK-789-AA', date: 'Hier', priority: 'Haute' },
  { id: 'VAL-094', type: 'KYC Voyageur', subject: 'Vérification Identité - Aissatou Diop', date: 'Hier', priority: 'Basse' },
];

export default function SectionValidations() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-orange-400" /> Centre de Validations & Conformité</h2>
          <p className="text-sm text-slate-400 mt-1">Approuvez les documents légaux, KYC et inscriptions B2B pour garantir la conformité.</p>
        </div>
        <div className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" /> 14 en attente
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Liste des demandes */}
        <div className="bg-[#101728] border border-slate-800/80 rounded-2xl overflow-hidden h-[600px] flex flex-col">
          <div className="p-4 border-b border-slate-800 bg-slate-900/50">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">File d'attente</h3>
          </div>
          <div className="overflow-y-auto p-4 space-y-3 flex-1">
            {validations.map((v, i) => (
              <div key={v.id} className={`p-4 rounded-xl border cursor-pointer transition-all ${i === 0 ? 'bg-orange-500/10 border-orange-500/30' : 'bg-slate-900/50 border-slate-800 hover:border-slate-600'}`}>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold uppercase bg-slate-800 text-slate-300 px-2 py-0.5 rounded">{v.type}</span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${v.priority === 'Haute' ? 'text-rose-400 bg-rose-500/10' : v.priority === 'Normale' ? 'text-amber-400 bg-amber-500/10' : 'text-slate-400 bg-slate-800'}`}>{v.priority}</span>
                </div>
                <p className="font-bold text-white text-sm mb-1">{v.subject}</p>
                <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
                  <span className="font-mono">{v.id}</span>
                  <span>{v.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Détail d'une demande */}
        <div className="bg-[#101728] border border-slate-800/80 rounded-2xl p-6 flex flex-col h-[600px]">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-1 block">Création GIE</span>
              <h3 className="text-xl font-bold text-white">Touba Voyage GIE</h3>
              <p className="text-sm text-slate-400 mt-1">Soumis par: Cheikh Mbaye (Gérant)</p>
            </div>
            <span className="bg-amber-500/10 text-amber-400 text-xs font-bold px-2 py-1 rounded border border-amber-500/20">En révision</span>
          </div>

          <div className="flex-1 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <h4 className="text-sm font-bold text-white mb-3">Informations Légales</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-slate-500 block text-xs">NINEA</span><span className="text-white font-mono">009876543 2V2</span></div>
                <div><span className="text-slate-500 block text-xs">RCCM</span><span className="text-white font-mono">SN-DKR-2023-B-998</span></div>
                <div className="col-span-2"><span className="text-slate-500 block text-xs">Siège</span><span className="text-white">Gare Routière Touba, Sénégal</span></div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <h4 className="text-sm font-bold text-white mb-3">Documents Joints</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-slate-800 p-2 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-white"><FileText className="w-4 h-4 text-orange-400" /> Statuts_GIE.pdf</div>
                  <button className="text-orange-400 hover:text-orange-300 p-1"><Eye className="w-4 h-4" /></button>
                </div>
                <div className="flex items-center justify-between bg-slate-800 p-2 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-white"><FileText className="w-4 h-4 text-orange-400" /> Certificat_NINEA.pdf</div>
                  <button className="text-orange-400 hover:text-orange-300 p-1"><Eye className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex gap-3 mt-auto">
            <button className="flex-1 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 font-bold py-3 rounded-xl border border-rose-500/20 transition-colors flex items-center justify-center gap-2">
              <XCircle className="w-5 h-5" /> Rejeter
            </button>
            <button className="flex-[2] bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5" /> Approuver & Activer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
