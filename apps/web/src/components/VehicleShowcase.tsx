'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Bus, 
  Car, 
  Wifi, 
  Wind, 
  Briefcase, 
  Users, 
  CheckCircle2, 
  SlidersHorizontal, 
  Sparkles, 
  Check, 
  X, 
  Star, 
  ChevronRight, 
  ArrowRight, 
  ShieldCheck, 
  Eye, 
  Layers,
  Sparkle
} from 'lucide-react';

interface Vehicle {
  id: string;
  name: string;
  category: string;
  type: 'covoiturage' | 'taxi' | 'minibus' | 'bus' | 'car' | 'premium';
  capacity: string;
  capacityNum: number;
  comfort: 'Standard' | 'Confort' | 'Supérieur' | 'Luxe VIP';
  ac: boolean;
  wifi: boolean;
  luggage: string;
  price: number;
  priceStr: string;
  availableSeats: number;
  rating: number;
  img: string;
  features: string[];
}

const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'cov-eco',
    name: 'Covoiturage Éco',
    category: 'Particulier (Covoiturage)',
    type: 'covoiturage',
    capacity: '4 passagers',
    capacityNum: 4,
    comfort: 'Standard',
    ac: true,
    wifi: false,
    luggage: 'Valise cabine (10kg)',
    price: 4500,
    priceStr: '4 500 FCFA',
    availableSeats: 3,
    rating: 4.8,
    img: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
    features: ['Chauffeur certifié KYC', 'Trajet direct sans arrêt', 'Ambiance conviviale']
  },
  {
    id: 'taxi-7',
    name: 'Taxi Inter-Urbain (7 Places)',
    category: 'Taxi Express',
    type: 'taxi',
    capacity: '7 passagers',
    capacityNum: 7,
    comfort: 'Confort',
    ac: true,
    wifi: false,
    luggage: 'Soute bagages (20kg)',
    price: 5500,
    priceStr: '5 500 FCFA',
    availableSeats: 5,
    rating: 4.7,
    img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
    features: ['Départ rapide en gare', 'Porte-bagages de toit', 'Sièges arrière renforcés']
  },
  {
    id: 'minibus-vip',
    name: 'Minibus VIP Climatisé',
    category: 'Minibus Express',
    type: 'minibus',
    capacity: '18 passagers',
    capacityNum: 18,
    comfort: 'Supérieur',
    ac: true,
    wifi: true,
    luggage: 'Soute dédiée (25kg)',
    price: 6000,
    priceStr: '6 000 FCFA',
    availableSeats: 12,
    rating: 4.9,
    img: 'https://images.unsplash.com/photo-1557223562-6c77ef16210f?auto=format&fit=crop&w=600&q=80',
    features: ['Prises de recharge USB', 'Wi-Fi 4G Haut Débit', 'Chauffeur professionnel GIE']
  },
  {
    id: 'bus-salam',
    name: 'Bus Express GIE Salam',
    category: 'Bus Ligne Régulière',
    type: 'bus',
    capacity: '50 passagers',
    capacityNum: 50,
    comfort: 'Confort',
    ac: true,
    wifi: true,
    luggage: 'Soute illimitée (30kg inclus)',
    price: 4500,
    priceStr: '4 500 FCFA',
    availableSeats: 28,
    rating: 4.9,
    img: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=600&q=80',
    features: ['Toilettes à bord', 'Écrans vidéo & films', 'Suivi GPS en direct']
  },
  {
    id: 'car-nuit',
    name: 'Car Couchette Panafricain',
    category: 'Car Longue Distance',
    type: 'car',
    capacity: '40 passagers',
    capacityNum: 40,
    comfort: 'Luxe VIP',
    ac: true,
    wifi: true,
    luggage: 'Franchise 40kg inclus',
    price: 12000,
    priceStr: '12 000 FCFA',
    availableSeats: 14,
    rating: 5.0,
    img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
    features: ['Sièges inclinables 160°', 'Repas et boisson offerts', 'Double chauffeur de relais']
  },
  {
    id: 'cov-premium',
    name: 'Covoiturage Premium VIP',
    category: 'Particulier VIP',
    type: 'premium',
    capacity: '3 passagers max',
    capacityNum: 3,
    comfort: 'Luxe VIP',
    ac: true,
    wifi: true,
    luggage: '2 Valises soute (30kg)',
    price: 9000,
    priceStr: '9 000 FCFA',
    availableSeats: 2,
    rating: 5.0,
    img: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80',
    features: ['Véhicule SUV Récent', 'Prise en charge à domicile', 'Playlist sur mesure']
  }
];

export default function VehicleShowcase() {
  const [filterType, setFilterType] = useState<string>('all');
  const [filterComfort, setFilterComfort] = useState<string>('all');
  const [filterAcOnly, setFilterAcOnly] = useState<boolean>(false);
  const [filterWifiOnly, setFilterWifiOnly] = useState<boolean>(false);
  const [maxPrice, setMaxPrice] = useState<number>(15000);

  // Modal de détail d'un véhicule
  const [selectedModalVehicle, setSelectedModalVehicle] = useState<Vehicle | null>(null);

  // Sélection pour comparaison de véhicules
  const [comparedVehicleIds, setComparedVehicleIds] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);

  // Filtrage dynamique
  const filteredVehicles = useMemo(() => {
    return INITIAL_VEHICLES.filter(v => {
      if (filterType !== 'all' && v.type !== filterType) return false;
      if (filterComfort !== 'all' && v.comfort !== filterComfort) return false;
      if (filterAcOnly && !v.ac) return false;
      if (filterWifiOnly && !v.wifi) return false;
      if (v.price > maxPrice) return false;
      return true;
    });
  }, [filterType, filterComfort, filterAcOnly, filterWifiOnly, maxPrice]);

  const toggleCompare = (id: string) => {
    if (comparedVehicleIds.includes(id)) {
      setComparedVehicleIds(comparedVehicleIds.filter(item => item !== id));
    } else {
      if (comparedVehicleIds.length >= 3) {
        alert("Vous pouvez comparer au maximum 3 véhicules simultanément.");
        return;
      }
      setComparedVehicleIds([...comparedVehicleIds, id]);
    }
  };

  const comparedVehicles = useMemo(() => {
    return INITIAL_VEHICLES.filter(v => comparedVehicleIds.includes(v.id));
  }, [comparedVehicleIds]);

  return (
    <section id="showcase" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-28">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold uppercase tracking-wider mb-4 shadow-lg shadow-emerald-500/10">
          <Car className="w-4 h-4" /> Options de Flotte & Catégories de Transport
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
          Trouvez le véhicule parfait pour votre trajet inter-urbain
        </h2>
        <p className="text-slate-400 text-base leading-relaxed">
          Du covoiturage particulier économique au car de nuit VIP en passant par les emblématiques taxis 7 places. Filtrez, comparez en direct et réservez votre place exacte.
        </p>
      </div>

      {/* Barre de Filtres Avancés */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl mb-12">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-2 font-bold text-white text-sm">
            <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
            <span>Filtres de recherche en direct ({filteredVehicles.length} résultats)</span>
          </div>
          {(filterType !== 'all' || filterComfort !== 'all' || filterAcOnly || filterWifiOnly || maxPrice < 15000) && (
            <button 
              onClick={() => {
                setFilterType('all');
                setFilterComfort('all');
                setFilterAcOnly(false);
                setFilterWifiOnly(false);
                setMaxPrice(15000);
              }}
              className="text-xs text-rose-400 hover:text-rose-300 font-bold transition-colors flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Réinitialiser les filtres
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Type Véhicule */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">Catégorie</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs font-bold text-white focus:border-emerald-500 outline-none cursor-pointer"
            >
              <option value="all">Tous les véhicules</option>
              <option value="covoiturage">Covoiturage (Particulier 4 pl.)</option>
              <option value="taxi">Taxi Inter-Urbain (7 pl.)</option>
              <option value="minibus">Minibus VIP</option>
              <option value="bus">Bus régulier</option>
              <option value="car">Car longue distance</option>
              <option value="premium">Véhicule Particulier VIP</option>
            </select>
          </div>

          {/* Confort */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">Niveau de Confort</label>
            <select
              value={filterComfort}
              onChange={(e) => setFilterComfort(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs font-bold text-white focus:border-emerald-500 outline-none cursor-pointer"
            >
              <option value="all">Tous les conforts</option>
              <option value="Standard">Standard</option>
              <option value="Confort">Confort</option>
              <option value="Supérieur">Supérieur</option>
              <option value="Luxe VIP">Luxe VIP</option>
            </select>
          </div>

          {/* Budget / Prix */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Budget Max</label>
              <span className="text-xs font-black text-emerald-400">{maxPrice.toLocaleString('fr-FR')} FCFA</span>
            </div>
            <input 
              type="range" 
              min="4000" 
              max="15000" 
              step="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-950 rounded-lg appearance-none"
            />
          </div>

          {/* Équipements (Toggles) */}
          <div className="lg:col-span-2 flex flex-wrap items-center gap-3 pt-6">
            <button
              onClick={() => setFilterAcOnly(!filterAcOnly)}
              className={`flex-1 px-4 py-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${
                filterAcOnly 
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-emerald-500/20' 
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
              }`}
            >
              <Wind className="w-4 h-4" />
              <span>Climatisé {filterAcOnly ? '✓' : ''}</span>
            </button>

            <button
              onClick={() => setFilterWifiOnly(!filterWifiOnly)}
              className={`flex-1 px-4 py-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${
                filterWifiOnly 
                  ? 'bg-blue-500 text-slate-950 border-blue-400 shadow-blue-500/20' 
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
              }`}
            >
              <Wifi className="w-4 h-4" />
              <span>Wi-Fi à bord {filterWifiOnly ? '✓' : ''}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grille des Véhicules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredVehicles.map((vehicle) => {
          const isCompared = comparedVehicleIds.includes(vehicle.id);
          return (
            <div 
              key={vehicle.id} 
              className={`bg-slate-900/60 border rounded-3xl overflow-hidden shadow-xl backdrop-blur-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 hover:shadow-2xl ${
                isCompared ? 'border-emerald-500 shadow-emerald-500/10 ring-2 ring-emerald-500/20' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Image & Badges en superposition */}
                <div className="relative h-52 w-full overflow-hidden bg-slate-950">
                  <img 
                    src={vehicle.img} 
                    alt={vehicle.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-700 text-xs font-bold text-white flex items-center gap-1.5 shadow-lg">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>{vehicle.rating}</span>
                  </div>

                  <div className="absolute top-3 right-3 bg-emerald-500 text-slate-950 px-3 py-1 rounded-xl text-xs font-black shadow-lg shadow-emerald-500/20">
                    {vehicle.comfort}
                  </div>

                  <div className="absolute bottom-3 left-3 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] font-bold text-slate-300 flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-blue-400" />
                    <span>Capacité : {vehicle.capacity}</span>
                  </div>
                </div>

                {/* Contenu de la fiche */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400 block mb-1">
                        {vehicle.category}
                      </span>
                      <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {vehicle.name}
                      </h3>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 my-4">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium flex items-center gap-1.5 border border-slate-700/50">
                      <Wind className={`w-3.5 h-3.5 ${vehicle.ac ? 'text-teal-400' : 'text-slate-500'}`} />
                      <span>{vehicle.ac ? 'Climatisé' : 'Non climatisé'}</span>
                    </span>

                    {vehicle.wifi && (
                      <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-bold flex items-center gap-1.5">
                        <Wifi className="w-3.5 h-3.5" /> Wi-Fi 4G
                      </span>
                    )}

                    <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium flex items-center gap-1.5 border border-slate-700/50">
                      <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                      <span>{vehicle.luggage}</span>
                    </span>
                  </div>

                  <div className="space-y-1.5 py-3 border-y border-slate-800 text-xs text-slate-400">
                    {vehicle.features.slice(0, 2).map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center mt-6">
                    <div>
                      <span className="text-xs text-slate-400 block">Prix estimatif</span>
                      <span className="text-2xl font-black text-white tracking-tight">{vehicle.priceStr}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Disponibilité</span>
                      <span className="text-sm font-bold text-emerald-400 flex items-center gap-1 justify-end">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        {vehicle.availableSeats} places libres
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pied de carte : Actions (Détails & Comparaison) */}
              <div className="p-4 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => toggleCompare(vehicle.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isCompared 
                      ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-sm' 
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/80'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{isCompared ? 'En comparaison' : 'Comparer'}</span>
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedModalVehicle(vehicle)}
                    className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors border border-slate-700/80"
                    title="Voir les détails complets"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <Link
                    href="/dashboard/client"
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1 shadow-md shadow-emerald-500/20"
                  >
                    <span>Réserver</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredVehicles.length === 0 && (
        <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl">
          <Car className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Aucun véhicule ne correspond à vos filtres</h3>
          <p className="text-slate-400 text-sm mb-6">Essayez d'élargir vos critères de budget ou d'équipements.</p>
          <button 
            onClick={() => {
              setFilterType('all');
              setFilterComfort('all');
              setFilterAcOnly(false);
              setFilterWifiOnly(false);
              setMaxPrice(15000);
            }}
            className="px-6 py-3 rounded-2xl bg-slate-800 text-white font-bold text-sm border border-slate-700 hover:bg-slate-700 transition-colors"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}

      {/* Barre Fixe de Comparaison en bas d'écran */}
      {comparedVehicleIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4 animate-fade-in">
          <div className="bg-slate-900/95 border-2 border-emerald-500 shadow-2xl shadow-emerald-500/20 rounded-3xl p-4 backdrop-blur-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-white text-sm block">Comparateur Aller-Retour</span>
                <span className="text-xs text-slate-400">{comparedVehicleIds.length} véhicule(s) sélectionné(s) sur 3 max</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCompareModalOpen(true)}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/30 transition-all hover:scale-105"
              >
                Lancer la comparaison
              </button>
              <button
                onClick={() => setComparedVehicleIds([])}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Vider la sélection"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 1 : Détails complets d'un véhicule */}
      {selectedModalVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl">
            <div className="relative h-64 w-full bg-slate-950">
              <img 
                src={selectedModalVehicle.img} 
                alt={selectedModalVehicle.name} 
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedModalVehicle(null)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-slate-950/80 text-white hover:bg-slate-900 transition-colors border border-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-4 bg-slate-950/90 backdrop-blur px-4 py-2 rounded-2xl border border-slate-800">
                <span className="text-xs uppercase font-extrabold text-emerald-400 block">{selectedModalVehicle.category}</span>
                <h3 className="text-2xl font-black text-white tracking-tight">{selectedModalVehicle.name}</h3>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div>
                  <span className="text-xs text-slate-400 block">Capacité</span>
                  <span className="font-bold text-white text-sm">{selectedModalVehicle.capacity}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Confort</span>
                  <span className="font-bold text-emerald-400 text-sm">{selectedModalVehicle.comfort}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Climatisation</span>
                  <span className="font-bold text-teal-400 text-sm">{selectedModalVehicle.ac ? 'Inclus (A/C)' : 'Non'}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Wi-Fi 4G</span>
                  <span className="font-bold text-blue-400 text-sm">{selectedModalVehicle.wifi ? 'Inclus' : 'Non'}</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Services & Garanties à bord</h4>
                <div className="space-y-2.5">
                  {selectedModalVehicle.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 text-sm text-slate-200">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 text-sm text-slate-200">
                    <Briefcase className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Franchise bagages : {selectedModalVehicle.luggage}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-800">
                <div>
                  <span className="text-xs text-slate-400 block">Tarif estimé par place</span>
                  <span className="text-3xl font-black text-white">{selectedModalVehicle.priceStr}</span>
                </div>
                <Link
                  href="/dashboard/client"
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 hover:scale-105 transition-transform flex items-center gap-2"
                >
                  <span>Réserver ma place</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2 : Tableau Comparateur de Véhicules */}
      {isCompareModalOpen && comparedVehicles.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-6 border-b border-slate-800 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 font-bold">
                  VS
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight">Comparaison des Véhicules</h3>
                  <p className="text-xs text-slate-400">Examen détaillé des spécifications et équipements</p>
                </div>
              </div>
              <button
                onClick={() => setIsCompareModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400 w-1/4">Critères</th>
                    {comparedVehicles.map(v => (
                      <th key={v.id} className="p-4 w-1/4">
                        <img src={v.img} alt={v.name} className="w-full h-24 object-cover rounded-xl mb-2 border border-slate-700" />
                        <span className="font-extrabold text-white text-base block">{v.name}</span>
                        <span className="text-xs text-emerald-400">{v.priceStr}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  <tr>
                    <td className="p-4 font-bold text-slate-400">Catégorie</td>
                    {comparedVehicles.map(v => <td key={v.id} className="p-4 text-slate-200 font-semibold">{v.category}</td>)}
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-slate-400">Capacité</td>
                    {comparedVehicles.map(v => <td key={v.id} className="p-4 text-slate-200">{v.capacity}</td>)}
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-slate-400">Niveau de Confort</td>
                    {comparedVehicles.map(v => (
                      <td key={v.id} className="p-4 font-extrabold text-emerald-400">{v.comfort}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-slate-400">Climatisation (A/C)</td>
                    {comparedVehicles.map(v => (
                      <td key={v.id} className="p-4">
                        {v.ac ? <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-xs font-bold">Oui</span> : <span className="text-slate-500 font-bold">Non</span>}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-slate-400">Wi-Fi 4G à bord</td>
                    {comparedVehicles.map(v => (
                      <td key={v.id} className="p-4">
                        {v.wifi ? <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-xs font-bold">Oui</span> : <span className="text-slate-500 font-bold">Non</span>}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-slate-400">Espace Bagages</td>
                    {comparedVehicles.map(v => <td key={v.id} className="p-4 text-amber-400 font-medium">{v.luggage}</td>)}
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-slate-400">Note & Avis</td>
                    {comparedVehicles.map(v => (
                      <td key={v.id} className="p-4 flex items-center gap-1 font-bold text-white">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> {v.rating}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-slate-400">Action de Réservation</td>
                    {comparedVehicles.map(v => (
                      <td key={v.id} className="p-4">
                        <Link
                          href="/dashboard/client"
                          className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 shadow-md shadow-emerald-500/20 transition-all"
                        >
                          <span>Réserver</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
