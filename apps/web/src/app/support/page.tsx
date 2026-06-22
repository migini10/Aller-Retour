'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search, MessageCircle, PhoneCall } from 'lucide-react';
import Link from 'next/link';

const FAQS = [
  {
    category: 'Réservations & Trajets',
    questions: [
      {
        q: 'Comment annuler une réservation ?',
        a: 'Vous pouvez annuler votre réservation gratuitement jusqu\'à 24h avant le départ depuis votre tableau de bord, section "Historique". Passé ce délai, des frais d\'annulation peuvent s\'appliquer.'
      },
      {
        q: 'Le chauffeur peut-il venir me chercher à domicile ?',
        a: 'Oui, lors de votre réservation, vous pouvez préciser une adresse de prise en charge. Si celle-ci est dans la zone couverte, le chauffeur viendra vous récupérer directement.'
      },
      {
        q: 'Quels sont les modes de paiement acceptés ?',
        a: 'Nous acceptons les paiements via Wave, Orange Money, et directement depuis votre Wallet Allogoo.'
      }
    ]
  },
  {
    category: 'Colis & Livraisons',
    questions: [
      {
        q: 'Comment suivre mon colis ?',
        a: 'Dès que votre colis est pris en charge, vous recevez un code de suivi. Entrez ce code dans la section "Colis" de votre application pour voir sa position en temps réel.'
      },
      {
        q: 'Que faire si mon colis est endommagé ?',
        a: 'Toutes nos livraisons sont couvertes par une assurance de base. En cas de dommage, prenez une photo du colis à réception et contactez immédiatement notre service client.'
      }
    ]
  }
];

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggleFaq = (idx: string) => {
    if (openIndex === idx) setOpenIndex(null);
    else setOpenIndex(idx);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0F172A] pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-500">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">Centre d'Aide & Support</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Trouvez rapidement les réponses à vos questions.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-2xl mx-auto mb-16">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-6 h-6 text-slate-400" />
          </div>
          <input 
            type="text" 
            placeholder="Rechercher (ex: annulation, colis, paiement...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-[#1E293B] border-none rounded-2xl shadow-lg focus:ring-2 focus:ring-orange-500 outline-none text-lg text-slate-900 dark:text-white transition-shadow placeholder-slate-400"
          />
        </div>

        {/* FAQ Categories */}
        <div className="space-y-12">
          {FAQS.map((category, cIdx) => (
            <div key={cIdx}>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 pl-2 border-l-4 border-orange-500">{category.category}</h2>
              <div className="space-y-4">
                {category.questions.filter(q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) || q.a.toLowerCase().includes(searchQuery.toLowerCase())).map((faq, qIdx) => {
                  const id = `${cIdx}-${qIdx}`;
                  const isOpen = openIndex === id;
                  return (
                    <div 
                      key={qIdx}
                      className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-all"
                    >
                      <button 
                        onClick={() => toggleFaq(id)}
                        className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                      >
                        <span className="font-bold text-slate-900 dark:text-white pr-8">{faq.q}</span>
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-orange-500 shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                        )}
                      </button>
                      
                      {isOpen && (
                        <div className="px-5 pb-5 pt-0">
                          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            {faq.a}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Still need help? */}
        <div className="mt-16 bg-gradient-to-br from-slate-900 to-[#1E293B] rounded-3xl p-8 md:p-12 text-center text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid-pattern.svg')] opacity-10"></div>
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Vous n'avez pas trouvé votre réponse ?</h2>
            <p className="text-slate-300 mb-8 max-w-xl mx-auto">
              Notre équipe d'assistance est disponible 7j/7 pour vous accompagner par email ou par téléphone.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/contact" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors">
                <MessageCircle className="w-5 h-5" />
                Nous écrire
              </Link>
              <a href="tel:+221770000000" className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors border border-white/20">
                <PhoneCall className="w-5 h-5" />
                Appeler le support
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
