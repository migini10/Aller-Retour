'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Bus, Phone, Mail, MapPin, 
  Facebook, Instagram, Twitter, Linkedin, Youtube,
  ShieldCheck, ArrowRight, Download, Send, Globe2, HeartHandshake,
  Smartphone, Apple
} from 'lucide-react';

// Configuration exportable pour permettre l'édition depuis le BackOffice
export const defaultFooterConfig = {
  identity: {
    logoText: "AllerRetour",
    slogan: "Voyagez plus simplement partout au Sénégal et bientôt dans toute l'Afrique.",
    certification: "Certifié ISO 27001 - Plateforme Sécurisée",
  },
  sections: {
    liensRapides: [
      { label: "Accueil", href: "/" },
      { label: "Réserver un billet", href: "/#search" },
      { label: "Trajets", href: "/trajets" },
      { label: "Mes billets", href: "/dashboard/client" },
      { label: "Allo Dakar", href: "/allo-dakar" },
      { label: "Covoiturage Éco", href: "/covoiturage" },
      { label: "Transporteurs", href: "/transporteurs" },
      { label: "Devenir chauffeur", href: "/devenir-chauffeur" },
    ],
    services: [
      { label: "Transport inter-urbain", href: "/services/inter-urbain" },
      { label: "Taxi Inter-Urbain", href: "/services/taxi" },
      { label: "Covoiturage Éco", href: "/services/covoiturage" },
      { label: "Réservation Gare", href: "/services/gare" },
      { label: "Chauffeurs libres", href: "/services/chauffeurs" },
      { label: "Billets QR", href: "/services/qr" },
      { label: "Transport premium", href: "/services/premium" },
    ],
    support: [
      { label: "Centre aide", href: "/support" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
      { label: "Assistance", href: "/assistance" },
      { label: "Réclamations", href: "/reclamations" },
      { label: "Support WhatsApp", href: "https://wa.me/221000000000" },
    ],
    entreprise: [
      { label: "À propos", href: "/about" },
      { label: "Carrières", href: "/careers" },
      { label: "Partenaires", href: "/partners" },
      { label: "Presse", href: "/press" },
      { label: "Blog", href: "/blog" },
      { label: "Investisseurs", href: "/investors" },
    ],
    legal: [
      { label: "Conditions utilisation", href: "/legal/terms" },
      { label: "Politique confidentialité", href: "/legal/privacy" },
      { label: "Cookies", href: "/legal/cookies" },
      { label: "Conditions chauffeurs", href: "/legal/driver-terms" },
      { label: "Conditions transporteurs", href: "/legal/carrier-terms" },
    ]
  },
  contact: {
    phone: "+221 33 800 00 00",
    email: "contact@allogoo.com",
    address: "Point E, Dakar",
    country: "Sénégal",
    hours: "Lun-Dim: 24h/24, 7j/7"
  },
  socials: [
    { name: "Facebook", icon: Facebook, href: "#" },
    { name: "Instagram", icon: Instagram, href: "#" },
    { name: "X", icon: Twitter, href: "#" }, // Utilisation de l'icône Twitter pour X
    { name: "LinkedIn", icon: Linkedin, href: "#" },
    { name: "YouTube", icon: Youtube, href: "#" },
  ],
  bottom: {
    year: "2026",
    companyName: "Allogoo Inc.",
    version: "v2.4.1"
  }
};

export default function Footer({ config = defaultFooterConfig }) {
  return (
    <footer className="bg-[#050A15] border-t border-slate-800/60 pt-20 pb-8 text-slate-300 font-sans relative overflow-hidden">
      {/* Background embellishments */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>
      <div className="absolute -top-[500px] left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] rounded-full bg-orange-600/5 blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Newsletter & App Download (Top Section) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pb-16 border-b border-slate-800/80">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 lg:p-10 flex flex-col sm:flex-row items-center justify-between gap-8 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-[40px] rounded-full"></div>
            <div className="flex-1 z-10">
              <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Application Mobile</h3>
              <p className="text-slate-400 text-sm mb-6">Embarquez votre billet QR, suivez votre bus en temps réel et payez en un clic.</p>
              <div className="flex flex-wrap gap-3">
                <button className="flex items-center gap-2 bg-black hover:bg-slate-900 text-white border border-slate-800 rounded-xl px-4 py-2.5 transition-all">
                  <Apple className="w-6 h-6" />
                  <div className="text-left">
                    <p className="text-[9px] uppercase tracking-wider text-slate-400 leading-none">Télécharger sur</p>
                    <p className="text-sm font-bold leading-none mt-1">App Store</p>
                  </div>
                </button>
                <button className="flex items-center gap-2 bg-black hover:bg-slate-900 text-white border border-slate-800 rounded-xl px-4 py-2.5 transition-all">
                  <Smartphone className="w-6 h-6" />
                  <div className="text-left">
                    <p className="text-[9px] uppercase tracking-wider text-slate-400 leading-none">Disponible sur</p>
                    <p className="text-sm font-bold leading-none mt-1">Google Play</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-3xl p-8 lg:p-10 text-white relative overflow-hidden shadow-[0_0_40px_rgba(234,88,12,0.15)]">
            <div className="absolute -right-10 -bottom-10 opacity-10">
              <Mail className="w-64 h-64" />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2 tracking-tight">Restez informé</h3>
              <p className="text-orange-100 text-sm mb-6">Recevez nos nouveautés, offres exclusives et alertes de trafic directement par email.</p>
              <form className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  placeholder="Votre adresse email" 
                  className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3.5 text-white placeholder:text-orange-200 focus:outline-none focus:bg-white/20 transition-all backdrop-blur-md"
                />
                <button type="button" className="bg-white text-orange-600 hover:bg-orange-50 px-6 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg">
                  S'abonner <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 border-b border-slate-800/80">
          
          {/* Identity Section */}
          <div className="lg:col-span-3 space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-600/20 group-hover:scale-105 transition-transform">
                <Bus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  {config.identity.logoText.replace('Retour', '')}
                  <span className="text-orange-500">Retour</span>
                </h2>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mt-0.5">Mobilité & Escrow</p>
              </div>
            </Link>
            
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              {config.identity.slogan}
            </p>

            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-3 py-2 rounded-lg w-fit">
              <ShieldCheck className="w-4 h-4" />
              <span className="font-semibold">{config.identity.certification}</span>
            </div>

            <div className="pt-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Partenaires Confiance</h4>
              <div className="flex flex-wrap items-center gap-4 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                {/* Simulated Partner Logos */}
                <span className="font-bold text-xl text-blue-400">wave</span>
                <span className="font-bold text-xl text-orange-500">OrangeMoney</span>
                <span className="font-bold text-xl text-indigo-400">stripe</span>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-white font-bold tracking-tight">Liens Rapides</h4>
            <ul className="space-y-2.5 text-sm">
              {config.sections.liensRapides.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-slate-400 hover:text-orange-400 transition-colors flex items-center gap-1 group">
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-white font-bold tracking-tight">Services</h4>
            <ul className="space-y-2.5 text-sm">
              {config.sections.services.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-slate-400 hover:text-orange-400 transition-colors flex items-center gap-1 group">
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-white font-bold tracking-tight">Entreprise & Légal</h4>
            <ul className="space-y-2.5 text-sm mb-6">
              {config.sections.entreprise.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-slate-400 hover:text-orange-400 transition-colors flex items-center gap-1 group">
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="space-y-2.5 text-xs">
              {config.sections.legal.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-slate-500 hover:text-slate-300 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-white font-bold tracking-tight">Contact & Support</h4>
            <ul className="space-y-3.5 text-sm">
              <li>
                <a href={`tel:${config.contact.phone.replace(/\s+/g, '')}`} className="flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 group-hover:bg-orange-600 group-hover:border-orange-500 transition-colors">
                    <Phone className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Téléphone / WhatsApp</p>
                    <p className="text-slate-300 group-hover:text-white font-medium transition-colors">{config.contact.phone}</p>
                  </div>
                </a>
              </li>
              <li>
                <a href={`mailto:${config.contact.email}`} className="flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 group-hover:bg-orange-600 group-hover:border-orange-500 transition-colors">
                    <Mail className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Email Support</p>
                    <p className="text-slate-300 group-hover:text-white font-medium transition-colors">{config.contact.email}</p>
                  </div>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Siège Social</p>
                    <p className="text-slate-300">{config.contact.address}<br/>{config.contact.country}</p>
                  </div>
                </div>
              </li>
            </ul>
            <div className="pt-2">
              <button className="w-full bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 hover:border-slate-600 rounded-xl px-4 py-3 text-sm font-bold transition-all flex items-center justify-center gap-2">
                <HeartHandshake className="w-4 h-4" /> Nous contacter
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-slate-500">
            <p>© {config.bottom.year} {config.bottom.companyName}. Tous droits réservés.</p>
            <div className="hidden md:block w-1 h-1 bg-slate-800 rounded-full"></div>
            <p className="flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-slate-400" />
              <span>Pays actif : <strong className="text-slate-300">Sénégal 🇸🇳</strong></span>
              <span className="text-slate-600">|</span>
              <span>Bientôt : <strong className="text-orange-500">Afrique 🌍</strong></span>
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex gap-3">
              {config.socials.map((social, idx) => {
                const SocialIcon = social.icon;
                return (
                  <a 
                    key={idx} 
                    href={social.href} 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-orange-600 hover:text-white hover:border-orange-500 transition-all hover:-translate-y-1"
                    aria-label={social.name}
                  >
                    <SocialIcon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
            <div className="text-xs text-slate-600 font-mono hidden sm:block">
              {config.bottom.version}
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
