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
  Check, 
  X, 
  Star, 
  ChevronRight, 
  ArrowRight, 
  ShieldCheck, 
  Eye, 
  Layers
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

  const [selectedModalVehicle, setSelectedModalVehicle] = useState<Vehicle | null>(null);
  const [comparedVehicleIds, setComparedVehicleIds] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);

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
    <section id="showcase" className="py-12 px-6 max-w-6xl mx-auto scroll-mt-28 font-sans">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-xl bg-slate-900 border border-orange-500/20 text-slate-300 text-xs font-medium mb-4 shadow-sm">
          <Car className="w-3.5 h-3.5 text-orange-500" />
          <span>Flotte & Options de Transport</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight mb-4">
          Visualisez et comparez les options disponibles
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed font-normal">
          Du covoiturage particulier économique aux autocars climatisés. Filtrez selon vos critères de confort et réservez votre place numérotée.
        </p>
      </div>

      {/* Barre de Filtres Épurée */}
      <div className="bg-[#101728] border border-slate-800/80 rounded-3xl p-6 shadow-xl mb-12">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-6">
          <div className="flex items-center gap-2 font-semibold text-white text-sm">
            <SlidersHorizontal className="w-4 h-4 text-orange-500" />
            <span>Filtres en direct ({filteredVehicles.length} véhicules)</span>
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
              className="text-xs text-slate-400 hover:text-white font-medium transition-colors flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Réinitialiser
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-slate-400 mb-2 block">Catégorie</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-white focus:border-slate-600 outline-none cursor-pointer"
            >
              <option value="all">Tous les véhicules</option>
              <option value="covoiturage">Covoiturage (Particulier)</option>
              <option value="taxi">Taxi Inter-Urbain</option>
              <option value="minibus">Minibus VIP</option>
              <option value="bus">Bus régulier</option>
              <option value="car">Car longue distance</option>
              <option value="premium">Véhicule VIP</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-slate-400 mb-2 block">Confort</label>
            <select
              value={filterComfort}
              onChange={(e) => setFilterComfort(e.target.value)}
              className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-white focus:border-slate-600 outline-none cursor-pointer"
            >
              <option value="all">Tous les conforts</option>
              <option value="Standard">Standard</option>
              <option value="Confort">Confort</option>
              <option value="Supérieur">Supérieur</option>
              <option value="Luxe VIP">Luxe VIP</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-medium uppercase tracking-wider text-slate-400">Budget Max</label>
              <span className="text-xs font-bold text-orange-400">{maxPrice.toLocaleString('fr-FR')} FCFA</span>
            </div>
            <input 
              type="range" 
              min="4000" 
              max="15000" 
              step="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-orange-500 cursor-pointer h-1.5 bg-[#0B0F19] rounded-lg appearance-none"
            />
          </div>

          <div className="lg:col-span-2 flex items-center gap-3 pt-6">
            <button
              onClick={() => setFilterAcOnly(!filterAcOnly)}
              className={`flex-1 px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                filterAcOnly 
                  ? 'bg-orange-600 text-white border-orange-500' 
                  : 'bg-[#0B0F19] border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Wind className="w-3.5 h-3.5" />
              <span>Climatisé {filterAcOnly ? '✓' : ''}</span>
            </button>

            <button
              onClick={() => setFilterWifiOnly(!filterWifiOnly)}
              className={`flex-1 px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                filterWifiOnly 
                  ? 'bg-orange-600 text-white border-orange-500' 
                  : 'bg-[#0B0F19] border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Wifi className="w-3.5 h-3.5" />
              <span>Wi-Fi {filterWifiOnly ? '✓' : ''}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grille des Véhicules Épurée */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => {
          const isCompared = comparedVehicleIds.includes(vehicle.id);
          return (
            <div 
              key={vehicle.id} 
              className={`bg-[#101728] border rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between group ${
                isCompared ? 'border-orange-500 ring-1 ring-orange-500/20' : 'border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-[#0B0F19]">
                  <img 
                    src={vehicle.img} 
                    alt={vehicle.name} 
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300 opacity-90"
                  />
                  <div className="absolute top-3 left-3 bg-[#0B0F19]/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-xs font-bold text-white flex items-center gap-1 shadow-sm">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>{vehicle.rating}</span>
                  </div>

                  <div className="absolute top-3 right-3 bg-slate-900 border border-slate-800 text-white px-3 py-1 rounded-lg text-xs font-semibold">
                    {vehicle.comfort}
                  </div>

                  <div className="absolute bottom-3 left-3 bg-[#0B0F19]/90 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-800 text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-orange-400" />
                    <span>Capacité : {vehicle.capacity}</span>
                  </div>
                </div>

                <div className="p-6">
                  <span className="text-[11px] uppercase font-bold tracking-wider text-orange-400 block mb-1">
                    {vehicle.category}
                  </span>
                  <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors mb-4">
                    {vehicle.name}
                  </h3>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2.5 py-1 rounded-lg bg-[#0B0F19] text-slate-300 text-xs font-medium flex items-center gap-1.5 border border-slate-800/80">
                      <Wind className={`w-3.5 h-3.5 ${vehicle.ac ? 'text-orange-400' : 'text-slate-500'}`} />
                      <span>{vehicle.ac ? 'Climatisé' : 'Standard'}</span>
                    </span>

                    {vehicle.wifi && (
                      <span className="px-2.5 py-1 rounded-lg bg-[#0B0F19] text-slate-300 text-xs font-medium flex items-center gap-1.5 border border-slate-800/80">
                        <Wifi className="w-3.5 h-3.5 text-orange-400" /> Wi-Fi
                      </span>
                    )}

                    <span className="px-2.5 py-1 rounded-lg bg-[#0B0F19] text-slate-300 text-xs font-medium flex items-center gap-1.5 border border-slate-800/80">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                      <span>{vehicle.luggage}</span>
                    </span>
                  </div>

                  <div className="space-y-1.5 py-3 border-y border-slate-800/80 text-xs text-slate-400">
                    {vehicle.features.slice(0, 2).map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 font-normal">
                        <Check className="w-3.5 h-3.5 text-orange-400" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center mt-6">
                    <div>
                      <span className="text-xs text-slate-400 block">Tarif estimé</span>
                      <span className="text-xl font-bold text-white tracking-tight">{vehicle.priceStr}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Disponibilité</span>
                      <span className="text-xs font-semibold text-orange-400 flex items-center gap-1 justify-end">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                        {vehicle.availableSeats} places libres
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#0B0F19]/60 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => toggleCompare(vehicle.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    isCompared 
                      ? 'bg-orange-600 text-white shadow-sm' 
                      : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-orange-400" />
                  <span>{isCompared ? 'Sélectionné' : 'Comparer'}</span>
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedModalVehicle(vehicle)}
                    className="p-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white transition-colors border border-slate-800"
                    title="Détails"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <Link
                    href="/dashboard/client"
                    className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs transition-colors flex items-center gap-1 shadow-sm"
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

      {/* Barre de Comparaison Flottante */}
      {comparedVehicleIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4 animate-fade-in">
          <div className="bg-[#0B0F19]/95 border border-slate-800 shadow-2xl rounded-2xl p-4 backdrop-blur-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-orange-500">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white text-xs block">Comparaison en cours</span>
                <span className="text-[11px] text-slate-400">{comparedVehicleIds.length} véhicule(s) sur 3</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCompareModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs shadow-sm transition-colors"
              >
                Comparer
              </button>
              <button
                onClick={() => setComparedVehicleIds([])}
                className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Détails */}
      {selectedModalVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0F19]/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#101728] border border-slate-800 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl">
            <div className="relative h-60 w-full bg-[#0B0F19]">
              <img 
                src={selectedModalVehicle.img} 
                alt={selectedModalVehicle.name} 
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedModalVehicle(null)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900/80 text-white border border-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur px-4 py-2 rounded-xl border border-slate-800">
                <span className="text-xs uppercase font-bold text-orange-400 block">{selectedModalVehicle.category}</span>
                <h3 className="text-xl font-bold text-white">{selectedModalVehicle.name}</h3>
              </div>
            </div>

            <div className="p-8 space-y-6 font-sans">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#0B0F19] p-4 rounded-2xl border border-slate-800/80 text-center">
                <div>
                  <span className="text-xs text-slate-400 block">Capacité</span>
                  <span className="font-semibold text-white text-sm">{selectedModalVehicle.capacity}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Confort</span>
                  <span className="font-semibold text-orange-400 text-sm">{selectedModalVehicle.comfort}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Clim (A/C)</span>
                  <span className="font-semibold text-white text-sm">{selectedModalVehicle.ac ? 'Inclus' : 'Non'}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Wi-Fi</span>
                  <span className="font-semibold text-white text-sm">{selectedModalVehicle.wifi ? 'Inclus' : 'Non'}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Garanties & Inclusions</h4>
                <div className="space-y-2">
                  {selectedModalVehicle.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-[#0B0F19]/60 border border-slate-800 text-xs text-slate-200 font-normal">
                      <ShieldCheck className="w-4 h-4 text-orange-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0B0F19]/60 border border-slate-800 text-xs text-slate-200 font-normal">
                    <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Bagages : {selectedModalVehicle.luggage}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-800">
                <div>
                  <span className="text-xs text-slate-400 block font-normal">Tarif estimé par place</span>
                  <span className="text-2xl font-bold text-white">{selectedModalVehicle.priceStr}</span>
                </div>
                <Link
                  href="/dashboard/client"
                  className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-sm transition-colors flex items-center gap-2 shadow-sm"
                >
                  <span>Réserver ma place</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Comparaison */}
      {isCompareModalOpen && comparedVehicles.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0F19]/80 backdrop-blur-md animate-fade-in font-sans">
          <div className="bg-[#101728] border border-slate-800 rounded-3xl max-w-4xl w-full p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-6 border-b border-slate-800 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-orange-500 flex items-center justify-center font-bold">
                  VS
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Comparaison des Véhicules</h3>
                  <p className="text-xs text-slate-400 font-normal">Examen détaillé des équipements et tarifs</p>
                </div>
              </div>
              <button
                onClick={() => setIsCompareModalOpen(false)}
                className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white transition-colors border border-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400 w-1/4">Critères</th>
                    {comparedVehicles.map(v => (
                      <th key={v.id} className="p-4 w-1/4">
                        <img src={v.img} alt={v.name} className="w-full h-20 object-cover rounded-xl mb-2 border border-slate-800" />
                        <span className="font-bold text-white text-sm block">{v.name}</span>
                        <span className="text-xs text-orange-400 font-medium">{v.priceStr}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-xs">
                  <tr>
                    <td className="p-4 font-medium text-slate-400">Catégorie</td>
                    {comparedVehicles.map(v => <td key={v.id} className="p-4 text-slate-200 font-medium">{v.category}</td>)}
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-slate-400">Capacité</td>
                    {comparedVehicles.map(v => <td key={v.id} className="p-4 text-slate-200">{v.capacity}</td>)}
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-slate-400">Confort</td>
                    {comparedVehicles.map(v => (
                      <td key={v.id} className="p-4 font-semibold text-orange-400">{v.comfort}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-slate-400">Climatisation (A/C)</td>
                    {comparedVehicles.map(v => (
                      <td key={v.id} className="p-4">
                        {v.ac ? <span className="px-2 py-1 bg-slate-900 text-orange-400 rounded-md border border-slate-800 font-medium">Oui</span> : <span className="text-slate-500 font-medium">Non</span>}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-slate-400">Wi-Fi</td>
                    {comparedVehicles.map(v => (
                      <td key={v.id} className="p-4">
                        {v.wifi ? <span className="px-2 py-1 bg-slate-900 text-orange-400 rounded-md border border-slate-800 font-medium">Oui</span> : <span className="text-slate-500 font-medium">Non</span>}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-slate-400">Bagages</td>
                    {comparedVehicles.map(v => <td key={v.id} className="p-4 text-slate-300">{v.luggage}</td>)}
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-slate-400">Note moyenne</td>
                    {comparedVehicles.map(v => (
                      <td key={v.id} className="p-4 flex items-center gap-1 font-semibold text-white">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {v.rating}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-slate-400">Réservation</td>
                    {comparedVehicles.map(v => (
                      <td key={v.id} className="p-4">
                        <Link
                          href="/dashboard/client"
                          className="w-full py-2 px-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs flex items-center justify-center gap-1 shadow-sm transition-colors"
                        >
                          <span>Réserver</span>
                          <ArrowRight className="w-3 h-3" />
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
