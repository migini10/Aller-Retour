'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, MapPin, Package, User, ArrowRight, CheckCircle2, 
  Smartphone, QrCode, Download, Share2, Box
} from 'lucide-react';
import QRCodeBrandEngine from './QRCodeBrandEngine';
import html2canvas from 'html2canvas';

interface ColisWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ColisWizardModal({ isOpen, onClose }: ColisWizardModalProps) {
  const [step, setStep] = useState(1);
  const [isClosing, setIsClosing] = useState(false);

  const [colisParams, setColisParams] = useState({
    depart: '',
    arrivee: '',
    destinataireNom: '',
    destinataireTel: '',
    taille: 'Moyen'
  });

  const [generatedTicket, setGeneratedTicket] = useState<any>(null);

  const departInputRef = useRef<HTMLInputElement>(null);
  const arriveeInputRef = useRef<HTMLInputElement>(null);
  const ticketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || step !== 1) return;

    const initAutocomplete = () => {
      if (!window.google || !window.google.maps || !window.google.maps.places) return;
      const options = { componentRestrictions: { country: 'sn' }, fields: ['formatted_address'] };

      if (departInputRef.current) {
        const autocomplete = new window.google.maps.places.Autocomplete(departInputRef.current, options);
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place.formatted_address) setColisParams(s => ({ ...s, depart: place.formatted_address || '' }));
        });
      }
      if (arriveeInputRef.current) {
        const autocomplete = new window.google.maps.places.Autocomplete(arriveeInputRef.current, options);
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place.formatted_address) setColisParams(s => ({ ...s, arrivee: place.formatted_address || '' }));
        });
      }
    };

    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initAutocomplete;
      document.head.appendChild(script);
    } else {
      setTimeout(initAutocomplete, 500);
    }
  }, [isOpen, step]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setStep(1);
      setIsClosing(false);
      setColisParams({
        depart: '',
        arrivee: '',
        destinataireNom: '',
        destinataireTel: '',
        taille: 'Moyen'
      });
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  const nextStep = () => {
    if (step === 2) {
      // Générer le reçu du colis
      const newTicket = {
        id: `COLIS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        qrCodeToken: 'TOKEN-COLIS',
        trajet: `${colisParams.depart} → ${colisParams.arrivee}`,
        date: new Date().toLocaleDateString('fr-FR'),
        taille: colisParams.taille,
        destinataire: colisParams.destinataireNom,
        tel: colisParams.destinataireTel,
        statut: 'En attente de prise en charge'
      };
      
      setGeneratedTicket(newTicket);
      try {
        const existing = JSON.parse(localStorage.getItem('my_colis') || '[]');
        localStorage.setItem('my_colis', JSON.stringify([newTicket, ...existing]));
      } catch (e) {}
    }
    setStep(s => Math.min(s + 1, 3));
  };
  
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleDownload = async () => {
    if (ticketRef.current) {
      try {
        const canvas = await html2canvas(ticketRef.current, { scale: 2 });
        const image = canvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.href = image;
        link.download = `Recu-Colis-AlloDakar.png`;
        link.click();
      } catch (err) {
        console.error("Erreur téléchargement", err);
      }
    }
  };

  if (!isOpen && !isClosing) return null;

  const renderStep1Lieux = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-[#1A1A1A]/50 p-4 sm:p-6 rounded-2xl border border-[#2A2A2A]">
        <h3 className="text-lg font-bold text-white mb-4">Où envoyer votre colis ?</h3>
        <div className="space-y-3">
          <div className="relative z-[60]">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              ref={departInputRef}
              type="text" 
              placeholder="Adresse de retrait (Expéditeur)"
              className="w-full bg-black border border-[#2A2A2A] rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              value={colisParams.depart}
              onChange={(e) => setColisParams({...colisParams, depart: e.target.value})}
            />
          </div>

          <div className="relative z-[40]">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400" />
            <input 
              ref={arriveeInputRef}
              type="text" 
              placeholder="Adresse de livraison (Destinataire)"
              className="w-full bg-black border border-[#2A2A2A] rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              value={colisParams.arrivee}
              onChange={(e) => setColisParams({...colisParams, arrivee: e.target.value})}
            />
          </div>
        </div>
      </div>
      <button 
        disabled={!colisParams.depart || !colisParams.arrivee}
        onClick={nextStep}
        className="w-full bg-orange-600 hover:bg-orange-500 text-white py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-600/20"
      >
        Continuer <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );

  const renderStep2Details = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="bg-[#1A1A1A]/50 p-4 sm:p-6 rounded-2xl border border-[#2A2A2A] space-y-5">
        <h3 className="text-lg font-bold text-white mb-2">Détails du destinataire</h3>
        
        <div className="space-y-3">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Nom complet du destinataire"
              className="w-full bg-black border border-[#2A2A2A] rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-orange-500"
              value={colisParams.destinataireNom}
              onChange={(e) => setColisParams({...colisParams, destinataireNom: e.target.value})}
            />
          </div>
          <div className="relative">
            <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="tel" 
              placeholder="Numéro de téléphone"
              className="w-full bg-black border border-[#2A2A2A] rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-orange-500"
              value={colisParams.destinataireTel}
              onChange={(e) => setColisParams({...colisParams, destinataireTel: e.target.value})}
            />
          </div>
        </div>

        <div className="pt-2 border-t border-[#333333]">
          <h3 className="text-sm font-bold text-slate-300 mb-3 uppercase tracking-wider">Taille du Colis</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'Enveloppe', icon: Box, desc: 'Documents', price: '5000F + Frais' },
              { id: 'Petit', icon: Package, desc: 'Boîte à chaussures', price: '5000F + Frais' },
              { id: 'Moyen', icon: Package, desc: 'Valise cabine', price: '5000F + Frais' },
              { id: 'Grand', icon: Box, desc: 'Gros carton', price: 'À négocier' }
            ].map(size => (
              <div 
                key={size.id}
                onClick={() => setColisParams({...colisParams, taille: size.id})}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                  colisParams.taille === size.id 
                    ? 'bg-orange-600/20 border-orange-500 text-orange-500' 
                    : 'bg-black border-[#2A2A2A] text-slate-400 hover:border-[#444444]'
                }`}
              >
                <size.icon className="w-6 h-6" />
                <div className="text-center">
                  <p className={`font-bold text-sm ${colisParams.taille === size.id ? 'text-white' : 'text-slate-300'}`}>{size.id}</p>
                  <p className="text-[10px] opacity-80 mb-1">{size.desc}</p>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${colisParams.taille === size.id ? 'bg-orange-500 text-white' : 'bg-[#1A1A1A] text-slate-400'}`}>
                    {size.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button 
        disabled={!colisParams.destinataireNom || !colisParams.destinataireTel}
        onClick={nextStep}
        className="w-full bg-orange-600 hover:bg-orange-500 text-white py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-600/20 disabled:opacity-50"
      >
        Valider et créer le reçu <CheckCircle2 className="w-5 h-5" />
      </button>
    </div>
  );

  const renderStep3Ticket = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div 
        ref={ticketRef}
        className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6 shadow-2xl relative overflow-hidden"
      >
        {/* Déco */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-bl-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-tr-full blur-2xl"></div>
        
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div>
            <p className="text-xs text-orange-500 font-bold tracking-wider uppercase mb-1">Reçu de Colis</p>
            <h3 className="text-2xl font-black text-white tracking-tight">{generatedTicket?.id}</h3>
          </div>
          <div className="bg-orange-500/20 p-2 rounded-xl">
            <Package className="w-6 h-6 text-orange-500" />
          </div>
        </div>

        <div className="space-y-4 relative z-10">
          <div className="bg-black/50 rounded-xl p-4 border border-[#2A2A2A]">
            <p className="text-xs text-slate-500 font-medium mb-1">Trajet</p>
            <p className="text-sm font-bold text-white">{generatedTicket?.trajet}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-black/50 rounded-xl p-3 border border-[#2A2A2A]">
              <p className="text-[10px] text-slate-500 font-medium mb-1 uppercase">Destinataire</p>
              <p className="text-sm font-bold text-white truncate">{generatedTicket?.destinataire}</p>
              <p className="text-xs text-slate-400 mt-0.5">{generatedTicket?.tel}</p>
            </div>
            <div className="bg-black/50 rounded-xl p-3 border border-[#2A2A2A]">
              <p className="text-[10px] text-slate-500 font-medium mb-1 uppercase">Taille</p>
              <p className="text-sm font-bold text-white">{generatedTicket?.taille}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center relative z-10">
          <div className="bg-white p-3 rounded-2xl shadow-xl">
            <QRCodeBrandEngine value={`https://aller-retour.sn/verify/${generatedTicket?.id}`} size={160} />
          </div>
        </div>
        <p className="text-center text-xs text-slate-500 mt-4 font-medium relative z-10">
          À présenter au chauffeur lors du dépôt.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={handleDownload}
          className="bg-[#1A1A1A] hover:bg-[#222222] border border-[#333333] text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <Download className="w-4 h-4" /> Enregistrer
        </button>
        <button 
          className="bg-[#1A1A1A] hover:bg-[#222222] border border-[#333333] text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <Share2 className="w-4 h-4" /> Partager
        </button>
      </div>

      <button 
        onClick={handleClose}
        className="w-full bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-xl font-bold text-base transition-colors mt-2"
      >
        Fermer
      </button>
    </div>
  );

  return (
    <div className={`fixed inset-0 z-[100] flex justify-center items-end sm:items-center p-0 sm:p-4 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <div 
        className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${isOpen && !isClosing ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
      />
      
      <div 
        className={`
          relative w-full sm:w-[500px] bg-[#0A0A0A] sm:rounded-[32px] rounded-t-[32px] 
          flex flex-col max-h-[90dvh] shadow-2xl border-t sm:border border-[#2A2A2A]
          transition-all duration-300 ease-out
          ${isOpen && !isClosing ? 'translate-y-0 opacity-100' : 'translate-y-full sm:translate-y-8 sm:opacity-0'}
        `}
      >
        <div className="flex-shrink-0 flex items-center justify-between p-6 pb-4 border-b border-[#1A1A1A]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">Envoi de Colis</h2>
              {step < 3 && <p className="text-xs font-bold text-orange-500 uppercase tracking-wider">Étape {step} sur 2</p>}
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="w-10 h-10 rounded-full bg-[#1A1A1A] hover:bg-[#222222] flex items-center justify-center text-slate-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar flex flex-col justify-center min-h-[50vh] sm:min-h-0">
          {step === 1 && renderStep1Lieux()}
          {step === 2 && renderStep2Details()}
          {step === 3 && renderStep3Ticket()}
        </div>
      </div>
    </div>
  );
}
