'use client';
import React, { useState } from 'react';
import { Navigation, MapPin, Phone, MessageSquare, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SectionLocalisation() {
  const router = useRouter();
  const [eta] = useState('3 min');
  const [distance] = useState('1.2 km');

  const [isNavigating, setIsNavigating] = useState(false);

  // URL par défaut (vue générale de Dakar)
  const defaultMapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d123689.70287413813!2d-17.5113945935741!3d14.736021669460292!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x168b2aba9d9b6d8b%3A0xc621b16c80210e7b!2sDakar%2C%20Senegal!5e0!3m2!1sen!2sfr!4v1716650454320!5m2!1sen!2sfr";
  
  // URL de l'itinéraire du chauffeur vers le client (Navigation)
  const clientLocationUrl = "https://maps.google.com/maps?saddr=Avenue+Cheikh+Anta+Diop,+Dakar,+Senegal&daddr=Mermoz,+Dakar,+Senegal&output=embed";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white flex items-center gap-2"><Navigation className="w-5 h-5 text-orange-400" /> Récupération Client</h2>
        <span className="bg-orange-500/10 text-orange-400 px-3 py-1.5 rounded-xl text-xs font-bold border border-orange-500/20 animate-pulse">
          {isNavigating ? 'EN ROUTE VERS LE CLIENT' : 'EN APPROCHE'}
        </span>
      </div>

      <div className="bg-[#101728] border border-slate-800/80 rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Destination</p>
            <h3 className="text-xl font-bold text-white">Point de rendez-vous</h3>
            <p className="text-sm text-slate-300 flex items-center gap-1 mt-1"><MapPin className="w-4 h-4 text-orange-400" /> Mermoz, Dakar</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-orange-400">{eta}</p>
            <p className="text-sm text-slate-400">{distance}</p>
          </div>
        </div>
      </div>

      {/* Carte Interactive avec Fond Satellite */}
      <div 
        className="relative h-96 border border-slate-700/60 rounded-3xl overflow-hidden shadow-xl"
        style={{ backgroundImage: "url('/dakar-map-bg.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        {/* Intégration Google Maps */}
        <iframe 
          src={isNavigating ? clientLocationUrl : defaultMapUrl}
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen={false} 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          className={`absolute inset-0 z-0 ${isNavigating ? 'opacity-100' : 'opacity-80'}`}
        ></iframe>

        {/* Overlays protecteurs pour empêcher les clics sur les logos/liens Google en haut et en bas */}
        <div className="absolute top-0 left-0 right-0 h-16 z-10" onPointerDownCapture={(e) => e.stopPropagation()} />
        <div className="absolute bottom-0 left-0 right-0 h-16 z-10" onPointerDownCapture={(e) => e.stopPropagation()} />

        {/* Overlay sombre pour garder le contraste des éléments UI */}
        <div className="absolute inset-0 bg-[#0a1520]/20 pointer-events-none z-10" />

        <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-none z-20">
           <div className="bg-slate-900/80 backdrop-blur border border-slate-700 px-3 py-1.5 rounded-xl flex items-center gap-2">
             <ShieldCheck className="w-4 h-4 text-emerald-400" />
             <span className="text-xs font-semibold text-white">Trajet sécurisé</span>
           </div>
           <button className="bg-slate-900/80 backdrop-blur border border-slate-700 w-10 h-10 flex items-center justify-center rounded-xl pointer-events-auto hover:bg-slate-800 transition-colors">
             <AlertTriangle className="w-5 h-5 text-amber-400" />
           </button>
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex gap-3 pointer-events-auto z-20">
          <button 
            onClick={() => setIsNavigating(true)}
            className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-bold py-3.5 rounded-2xl transition-colors shadow-lg shadow-orange-500/20 text-sm flex justify-center items-center gap-2"
          >
            <Navigation className="w-4 h-4" /> {isNavigating ? 'Recentrer sur le client' : 'Démarrer Navigation Intégrée'}
          </button>
        </div>
      </div>

      {/* Actions Client */}
      <div className="bg-[#101728] border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 font-bold text-lg">F</div>
          <div>
            <p className="font-bold text-white">Fatou Diop</p>
            <p className="text-xs text-slate-400">Passager • Paiement Wave</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="w-10 h-10 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl flex items-center justify-center text-white transition-colors"><MessageSquare className="w-4 h-4" /></button>
          <button className="w-10 h-10 bg-emerald-600 hover:bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 transition-colors"><Phone className="w-4 h-4" /></button>
        </div>
      </div>

    </div>
  );
}
