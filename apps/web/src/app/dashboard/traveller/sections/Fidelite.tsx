'use client';
import React from 'react';
import { Gift, Star, Tag } from 'lucide-react';

const recompenses = [
  { titre: 'Voyage Gratuit Dakar-Touba', points: 5000, dispo: true },
  { titre: 'Réduction 20% prochain trajet', points: 1500, dispo: true },
  { titre: 'Bagage gratuit (15 kg)', points: 800, dispo: false },
];

export default function SectionFidelite() {
  const points = 1240;
  const pointsMax = 5000;
  const pct = Math.round((points / pointsMax) * 100);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-white flex items-center gap-2"><Gift className="w-5 h-5 text-orange-400" /> Programme Fidélité</h2>

      {/* Carte points */}
      <div className="bg-gradient-to-br from-purple-700 via-purple-600 to-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-purple-500/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm opacity-80">Mes points fidélité</p>
            <p className="text-4xl font-bold mt-1">{points.toLocaleString('fr-FR')} <span className="text-lg font-semibold">pts</span></p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
            <Star className="w-7 h-7 fill-white text-white" />
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs opacity-80">
            <span>Progression niveau Gold</span>
            <span>{points} / {pointsMax}</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-xs opacity-70">{pointsMax - points} points restants pour le niveau Gold</p>
        </div>
      </div>

      {/* Niveaux */}
      <div className="grid grid-cols-3 gap-3">
        {[{ n: 'Bronze', min: 0, max: 999, col: 'text-amber-700' }, { n: 'Silver', min: 1000, max: 2999, col: 'text-slate-400' }, { n: 'Gold', min: 3000, max: 5000, col: 'text-yellow-400' }].map(l => (
          <div key={l.n} className={`bg-[#101728] border rounded-xl p-3 text-center ${points >= l.min ? 'border-orange-500/40' : 'border-slate-800'}`}>
            <p className={`font-bold text-sm ${l.col}`}>{l.n}</p>
            <p className="text-xs text-slate-500 mt-0.5">{l.min}-{l.max} pts</p>
          </div>
        ))}
      </div>

      {/* Récompenses */}
      <div>
        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-3">Récompenses disponibles</p>
        <div className="space-y-3">
          {recompenses.map(r => (
            <div key={r.titre} className="bg-[#101728] border border-slate-800/80 rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-500/20 flex items-center justify-center">
                  <Tag className="w-4 h-4 text-orange-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{r.titre}</p>
                  <p className="text-xs text-orange-400 font-bold mt-0.5">{r.points} points</p>
                </div>
              </div>
              <button disabled={points < r.points} className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${points >= r.points ? 'bg-orange-600 hover:bg-orange-500 text-white' : 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'}`}>
                {points >= r.points ? 'Échanger' : 'Insuffisant'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
