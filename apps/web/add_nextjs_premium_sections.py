import os

file_path = '/Users/macbookair/Aller-Retour/apps/web/src/app/dashboard/client/page.tsx'

with open(file_path, 'r') as f:
    content = f.read()

old_block = """          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="pt-2">"""

new_block = """          </div>
        </div>

        {/* Statut en Direct */}
        <div className="pt-4">
          <div className="bg-gradient-to-br from-green-50 to-white dark:from-[#1E293B] dark:to-[#0F172A] border border-green-200 dark:border-green-500/30 p-5 rounded-3xl shadow-lg dark:shadow-[0_8px_20px_rgba(0,0,0,0.4)] flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 w-6 h-6"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Colis en transit</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Dakar &rarr; Touba &bull; Arrivée estimée : 14h30</p>
            </div>
            <div className="w-8 h-8 rounded-full border border-green-500/50 bg-white dark:bg-[#0F172A] flex items-center justify-center shrink-0">
              <ArrowRight className="text-green-500 w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="pt-8">"""

content = content.replace(old_block, new_block)

old_footer = """          </div>
        </div>

        {/* Responsive Footer */}"""

new_footer = """          </div>
        </div>

        {/* Carrousel Promo */}
        <div className="pt-8 -mx-5 px-5 overflow-x-auto no-scrollbar">
          <div className="flex gap-4 min-w-max pb-4">
            {/* Promo 1 */}
            <div className="w-80 h-40 rounded-3xl bg-gradient-to-br from-orange-500 to-orange-400 p-6 relative overflow-hidden shadow-lg shadow-orange-500/20">
              <Gift className="absolute -bottom-6 -right-6 w-32 h-32 text-white/20" />
              <div className="relative z-10 flex flex-col justify-center h-full">
                <span className="bg-white/30 text-white text-[10px] font-bold px-2.5 py-1 rounded-full w-max mb-3">NOUVEAU</span>
                <h3 className="text-white font-bold text-xl mb-1">Parrainez un proche !</h3>
                <p className="text-white/90 text-sm line-clamp-2">Gagnez 2000 FCFA sur votre prochain trajet pour chaque parrainage.</p>
              </div>
            </div>
            {/* Promo 2 */}
            <div className="w-80 h-40 rounded-3xl bg-gradient-to-br from-blue-500 to-blue-400 p-6 relative overflow-hidden shadow-lg shadow-blue-500/20">
              <Map className="absolute -bottom-6 -right-6 w-32 h-32 text-white/20" />
              <div className="relative z-10 flex flex-col justify-center h-full">
                <span className="bg-white/30 text-white text-[10px] font-bold px-2.5 py-1 rounded-full w-max mb-3">NOUVEAU</span>
                <h3 className="text-white font-bold text-xl mb-1">Nouveau Service</h3>
                <p className="text-white/90 text-sm line-clamp-2">Suivez désormais vos colis en temps réel sur la carte.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Historique Récent */}
        <div className="pt-8">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <div className="w-2 h-6 bg-orange-500 rounded-full"></div> 
              Activité Récente
            </h2>
            <button className="text-orange-500 font-bold text-sm">Voir tout</button>
          </div>
          <div className="flex flex-col">
            {/* Item 1 */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-green-500/15 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                </div>
                <div className="w-[2px] h-10 bg-slate-200 dark:bg-slate-800 my-1"></div>
              </div>
              <div className="flex-1 pb-4 flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Colis livré</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Dakar &rarr; Thiès</p>
                </div>
                <span className="text-slate-400 text-xs font-bold">Hier, 14:30</span>
              </div>
            </div>
            {/* Item 2 */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-blue-500/15 flex items-center justify-center shrink-0">
                  <CarFront className="w-4 h-4 text-blue-500" />
                </div>
              </div>
              <div className="flex-1 pb-4 flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Trajet terminé</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Aller-Retour : Dakar &rarr; Touba</p>
                </div>
                <span className="text-slate-400 text-xs font-bold">10 Juin, 08:00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Destinations Populaires */}
        <div className="pt-6 pb-8">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <div className="w-2 h-6 bg-orange-500 rounded-full"></div> 
            Destinations Populaires
          </h2>
          <div className="-mx-5 px-5 overflow-x-auto no-scrollbar">
            <div className="flex gap-3 min-w-max pb-4">
              <div className="w-36 h-36 rounded-[20px] bg-gradient-to-br from-amber-500/80 to-amber-500 relative overflow-hidden shadow-lg shadow-amber-500/20 p-4 flex flex-col justify-end">
                <Building2 className="absolute -bottom-4 -right-4 w-20 h-20 text-white/20" />
                <h3 className="text-white font-bold text-lg relative z-10">Touba</h3>
                <p className="text-white/90 text-[10px] relative z-10 mt-1">À partir de 4000 FCFA</p>
              </div>
              <div className="w-36 h-36 rounded-[20px] bg-gradient-to-br from-emerald-500/80 to-emerald-500 relative overflow-hidden shadow-lg shadow-emerald-500/20 p-4 flex flex-col justify-end">
                <Building2 className="absolute -bottom-4 -right-4 w-20 h-20 text-white/20" />
                <h3 className="text-white font-bold text-lg relative z-10">Thiès</h3>
                <p className="text-white/90 text-[10px] relative z-10 mt-1">À partir de 2000 FCFA</p>
              </div>
              <div className="w-36 h-36 rounded-[20px] bg-gradient-to-br from-cyan-500/80 to-cyan-500 relative overflow-hidden shadow-lg shadow-cyan-500/20 p-4 flex flex-col justify-end">
                <Building2 className="absolute -bottom-4 -right-4 w-20 h-20 text-white/20" />
                <h3 className="text-white font-bold text-lg relative z-10">Mbour</h3>
                <p className="text-white/90 text-[10px] relative z-10 mt-1">À partir de 2500 FCFA</p>
              </div>
            </div>
          </div>
        </div>

        {/* Responsive Footer */}"""

content = content.replace(old_footer, new_footer)

# Import the new icons
old_import = """import { 
  Menu, X, Search, Bell, Home, CarFront, Ticket, Package, 
  Wallet, LogOut, ChevronRight, MapPin, Map, Navigation, 
  ArrowRight, ShieldCheck, Sun, Moon, ArrowUpRight, Check, CheckCircle2 
} from "lucide-react";"""

new_import = """import { 
  Menu, X, Search, Bell, Home, CarFront, Ticket, Package, 
  Wallet, LogOut, ChevronRight, MapPin, Map, Navigation, 
  ArrowRight, ShieldCheck, Sun, Moon, ArrowUpRight, Check, CheckCircle2, Gift, Building2
} from "lucide-react";"""

content = content.replace(old_import, new_import)

with open(file_path, 'w') as f:
    f.write(content)
