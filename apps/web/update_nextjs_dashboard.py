import os

file_path = '/Users/macbookair/Aller-Retour/apps/web/src/app/dashboard/client/page.tsx'

with open(file_path, 'r') as f:
    content = f.read()

old_block = """          </div>
        </div>

        {/* Responsive Footer */}"""

new_block = """          </div>
        </div>

        {/* Aperçu de l'activité */}
        <div className="pt-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <div className="w-2 h-6 bg-orange-500 rounded-full"></div> 
            Aperçu de l'activité
          </h2>
          <div className="flex flex-col gap-3 sm:gap-4">
            
            {/* Points Cumulés */}
            <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 p-4 sm:p-5 rounded-2xl flex items-center shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center mr-4 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 dark:text-white">Points Cumulés</h3>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl">
                <span className="font-black text-slate-900 dark:text-white">X</span>
              </div>
            </div>

            {/* Dernier Billet */}
            <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 p-4 sm:p-5 rounded-2xl flex items-center shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mr-4 shrink-0">
                <CarFront className="text-blue-500 w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 dark:text-white">Dernier Billet</h3>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl">
                <span className="font-black text-slate-900 dark:text-white">X</span>
              </div>
            </div>

            {/* Dernier Colis */}
            <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 p-4 sm:p-5 rounded-2xl flex items-center shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mr-4 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 dark:text-white">Dernier Colis</h3>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl">
                <span className="font-black text-slate-900 dark:text-white">X</span>
              </div>
            </div>

          </div>
        </div>

        {/* Responsive Footer */}"""

if old_block in content:
    content = content.replace(old_block, new_block)
    with open(file_path, 'w') as f:
        f.write(content)
    print("Next.js dashboard updated successfully.")
else:
    print("Could not find the insertion block in Next.js.")

