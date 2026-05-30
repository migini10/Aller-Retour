'use client';
import React, { useState } from 'react';
import { Route, Clock, Play, CheckCircle2, AlertTriangle, MessageSquare, MapPin, Plus, X, Loader2, CarFront } from 'lucide-react';

const missions = [
  { id: 'TRIP-402', trajet: 'Dakar → Touba', date: 'Aujourd\'hui', heure: '14:30', vehicule: 'Bus 50 Places', statut: 'à venir', passagers: 45 },
  { id: 'TRIP-398', trajet: 'Thiès → Dakar', date: 'Aujourd\'hui', heure: '08:00', vehicule: 'Bus 50 Places', statut: 'terminé', passagers: 48 },
  { id: 'TRIP-405', trajet: 'Dakar → Saint-Louis', date: 'Demain', heure: '07:00', vehicule: 'Bus 50 Places', statut: 'programmé', passagers: 22 },
];

const tabs = ['Toutes', 'Aujourd\'hui', 'Programmées', 'Historique'];

const statutStyle: Record<string, string> = {
  'à venir': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'terminé': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'programmé': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'en cours': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

export default function SectionMissions() {
  const [tab, setTab] = useState('Toutes');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    originCity: 'Dakar',
    destinationCity: 'Touba',
    date: new Date().toISOString().split('T')[0],
    heure: '14:00',
    pricePerSeat: 5000
  });

  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const departureTime = new Date(`${formData.date}T${formData.heure}`);
      const res = await fetch('http://localhost:3333/api/trips/create-allo-dakar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originCity: formData.originCity,
          destinationCity: formData.destinationCity,
          pricePerSeat: formData.pricePerSeat,
          departureTime: departureTime.toISOString()
        })
      });
      if (res.ok) {
        setIsModalOpen(false);
        alert('Trajet Allo Dakar créé avec succès sur le serveur ! Il est maintenant visible par les passagers.');
      } else {
        throw new Error('Erreur serveur');
      }
    } catch (err) {
      console.warn("Le serveur backend n'est pas accessible. Simulation de réussite pour la démo Vercel.");
      // Simuler le succès pour la démo si le backend n'est pas déployé
      setTimeout(() => {
        setIsModalOpen(false);
        alert('Mode Démo: Le trajet a été virtuellement créé (Le serveur backend NestJS n\'est pas accessible depuis Vercel).');
      }, 800);
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2"><Route className="w-5 h-5 text-orange-400" /> Mes Missions & Trajets</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-orange-600 hover:bg-orange-500 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors flex items-center gap-2"
        >
          <CarFront className="w-4 h-4" /> Proposer un Trajet Allo Dakar
        </button>
      </div>
      
      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors ${tab === t ? 'bg-orange-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {missions.map(m => (
          <div key={m.id} className="bg-[#101728] border border-slate-800/80 hover:border-orange-500/30 rounded-2xl p-5 transition-colors space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-slate-500">{m.id}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-lg border font-bold ${statutStyle[m.statut]}`}>{m.statut}</span>
                </div>
                <p className="font-bold text-white text-lg">{m.trajet}</p>
                <p className="text-sm text-slate-400 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {m.date} à {m.heure}</p>
                <p className="text-xs text-slate-500">{m.vehicule} • {m.passagers} passagers prévus</p>
              </div>
              
              <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
                {m.statut === 'à venir' && (
                  <button 
                    onClick={() => window.location.hash = 'localisation'}
                    className="flex items-center justify-center gap-1.5 text-xs px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold transition-colors"
                  >
                    <Play className="w-3.5 h-3.5" /> Démarrer trajet
                  </button>
                )}
                {m.statut === 'en cours' && (
                  <button className="flex items-center justify-center gap-1.5 text-xs px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Terminer trajet
                  </button>
                )}
                <button className="flex items-center justify-center gap-1.5 text-xs px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 transition-colors">
                  <MapPin className="w-3.5 h-3.5" /> Voir détails
                </button>
                {(m.statut === 'à venir' || m.statut === 'en cours') && (
                  <button className="flex items-center justify-center gap-1.5 text-xs px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-700 transition-colors">
                    <AlertTriangle className="w-3.5 h-3.5" /> Signaler incident
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Création Trajet */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-md bg-[#050A15] sm:rounded-3xl border border-slate-800/80 shadow-2xl p-6 animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-900 rounded-full border border-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <CarFront className="w-6 h-6 text-orange-500" /> Nouveau Trajet
            </h3>

            <form onSubmit={handleCreateTrip} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-medium">Départ</label>
                  <input type="text" value={formData.originCity} onChange={e => setFormData({...formData, originCity: e.target.value})} className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-orange-500 outline-none" required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-medium">Arrivée</label>
                  <input type="text" value={formData.destinationCity} onChange={e => setFormData({...formData, destinationCity: e.target.value})} className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-orange-500 outline-none" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-medium">Date</label>
                  <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-orange-500 outline-none" required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-medium">Heure</label>
                  <input type="time" value={formData.heure} onChange={e => setFormData({...formData, heure: e.target.value})} className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-orange-500 outline-none" required />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-medium">Prix par place (FCFA)</label>
                <input type="number" min="500" value={formData.pricePerSeat} onChange={e => setFormData({...formData, pricePerSeat: parseInt(e.target.value)})} className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-orange-500 outline-none" required />
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full mt-4 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Publier le trajet'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
