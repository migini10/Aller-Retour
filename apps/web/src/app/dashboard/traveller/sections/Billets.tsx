'use client';
import React, { useState, useEffect } from 'react';
import QRCodeBrandEngine from '../../../../components/QRCodeBrandEngine';
import { Download, Share2, Printer, Eye, QrCode, CheckCircle2, Clock, XCircle, Bus, ArrowRight, MessageCircle, User } from 'lucide-react';
import { useModal } from '../../../../components/ModalContext';
import html2canvas from 'html2canvas';

const initialMockBillets = [
  { id: 'AR-74892374', trajet: 'Dakar → Touba', date: '2026-06-05', heure: '08:00', siege: '14A VIP', compagnie: 'Sénégal Express', vehicule: 'Bus Climatisé 50 places', statut: 'actif', passager: 'Abdou Bakhe' },
  { id: 'AR-84512987', trajet: 'Dakar → Saint-Louis', date: '2026-05-20', heure: '07:00', siege: '03B', compagnie: 'Dakar Dem Dikk', vehicule: 'Mercedes Sprinter', statut: 'utilisé', passager: 'Mamadou Ndiaye' },
  { id: 'AR-62019384', trajet: 'Thiès → Ziguinchor', date: '2026-04-15', heure: '06:30', siege: '08C', compagnie: 'Mouride Express', vehicule: 'Bus 35 places', statut: 'annulé', passager: 'Fatou Diop' },
];

const statutStyle: Record<string, string> = {
  actif: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
  utilisé: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  annulé: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
};

const StatutIcon = ({ s }: { s: string }) =>
  s === 'actif' ? <Clock className="w-3 h-3" /> : s === 'utilisé' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />;

export default function SectionBillets() {
  const [selected, setSelected] = useState<string | null>(null);
  const [myBillets, setMyBillets] = useState<any[]>(initialMockBillets);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const { openBookingWizard } = useModal();

  useEffect(() => {
    const loadTickets = () => {
      try {
        const stored = localStorage.getItem('my_tickets');
        if (stored) {
          const parsed = JSON.parse(stored);
          // Only update if it's different to prevent infinite re-renders or flashing
          setMyBillets([...parsed, ...initialMockBillets]);
        }
      } catch (e) {}
    };
    
    loadTickets();
    
    // Poll for new tickets since they are generated in a modal
    const interval = setInterval(loadTickets, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleShare = async (b: any) => {
    setSelected(b.id);
    try {
      const el = document.getElementById(`capture-ticket-${b.id}`);
      if (el && navigator.share) {
        // Wait for rendering
        await new Promise(r => setTimeout(r, 400));
        const canvas = await html2canvas(el, { scale: 2, backgroundColor: '#ffffff', useCORS: true });
        
        await new Promise<void>((resolve, reject) => {
          try {
            canvas.toBlob(async (blob) => {
              if (blob) {
                const file = new File([blob], `billet-${b.id}.png`, { type: 'image/png' });
                try {
                  if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                      title: 'Mon billet AllerRetour',
                      text: `Billet ${b.trajet} le ${b.date} à ${b.heure}. Siège: ${b.siege}. Réf: ${b.id}`,
                      files: [file]
                    });
                  } else {
                    await navigator.share({
                      title: 'Mon billet AllerRetour',
                      text: `Billet ${b.trajet} le ${b.date} à ${b.heure}. Siège: ${b.siege}. Réf: ${b.id}\n👉 https://aller-retour.sn`,
                    });
                  }
                  resolve();
                } catch (shareErr) {
                  reject(shareErr);
                }
              } else {
                reject(new Error("Blob is null"));
              }
            }, 'image/png');
          } catch (e) {
            reject(e);
          }
        });
      }
    } catch (err) {
      console.error('Erreur de partage', err);
    }
  };

  const handleWhatsApp = async (b: any) => {
    setSelected(b.id);
    const text = `*Mon billet AllerRetour*\n\nTrajet: ${b.trajet}\nDate: ${b.date} à ${b.heure}\nSiège: ${b.siege}\nRéf: ${b.id}\n\nhttps://aller-retour.sn`;
    
    try {
      const el = document.getElementById(`capture-ticket-${b.id}`);
      if (el) {
        // Give time for the QR code to render
        await new Promise(r => setTimeout(r, 200));
        const canvas = await html2canvas(el, { scale: 2, backgroundColor: '#ffffff', useCORS: true });
        canvas.toBlob(async (blob) => {
          if (blob) {
            try {
              const item = new ClipboardItem({ 'image/png': blob });
              await navigator.clipboard.write([item]);
            } catch (err) {
              console.error('Clipboard write failed:', err);
            }
          }
          window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
        }, 'image/png');
        return;
      }
    } catch (err) {
      console.error('Error generating image:', err);
    }
    
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handlePrint = async (id: string) => {
    setSelected(id);
    await new Promise(r => setTimeout(r, 200)); // wait for QR
    
    const el = document.getElementById(`ticket-${id}`);
    if (el) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Impression Billet ${id}</title>
              <script src="https://cdn.tailwindcss.com"></script>
              <style>
                [data-html2canvas-ignore] { display: none !important; }
                body { display: flex; justify-content: center; padding: 40px; background: #f8fafc; }
                .ticket { background: #101728; color: white; padding: 24px; border-radius: 16px; width: 100%; max-width: 400px; }
              </style>
            </head>
            <body>
              <div class="ticket">
                ${el.innerHTML}
              </div>
              <script>
                setTimeout(() => {
                  window.print();
                  window.close();
                }, 1000);
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  const handleDownload = async (id: string) => {
    const el = document.getElementById(`capture-ticket-${id}`);
    if (!el) return;
    
    setIsDownloading(id);
    try {
      await new Promise(r => setTimeout(r, 400)); 

      const canvas = await html2canvas(el, { scale: 2, backgroundColor: '#ffffff', useCORS: true });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = image;
      link.download = `Billet-${id}.png`;
      link.click();
    } catch (err) {
      console.error("Erreur lors de la génération du billet", err);
    } finally {
      setIsDownloading(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white flex items-center gap-2"><QrCode className="w-5 h-5 text-orange-400" /> Mes Billets</h2>
        <button 
          onClick={() => openBookingWizard('allo-dakar')}
          className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(234,88,12,0.3)] transition-all flex items-center gap-2"
        >
          <QrCode className="w-4 h-4 hidden sm:block" />
          Trouver une voiture
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {myBillets.map(b => (
          <div id={`ticket-${b.id}`} key={b.id} className="bg-[#101728] border border-slate-800/80 rounded-2xl p-5 space-y-4 hover:border-orange-500/30 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="font-mono text-xs text-slate-400">{b.id}</p>
                <p className="font-bold text-white text-base">{b.trajet}</p>
                <p className="text-sm text-slate-400 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span className="font-medium text-slate-300">{b.passager || 'Abdou Bakhe'}</span>
                </p>
                <p className="text-sm text-slate-400">{b.date} • {b.heure} — Siège {b.siege}</p>
                <p className="text-xs text-slate-500">{b.compagnie} • {b.vehicule}</p>
              </div>
              <span className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold shrink-0 ${statutStyle[b.statut] || statutStyle['actif']}`}>
                <StatutIcon s={b.statut} /> {b.statut}
              </span>
            </div>
            {selected === b.id && (
              <div className="flex justify-center pt-2 border-t border-slate-800">
                <div className="bg-white p-2 rounded-xl">
                  <QRCodeBrandEngine value={b.id} size={160} />
                </div>
              </div>
            )}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800" data-html2canvas-ignore>
              <button onClick={() => setSelected(selected === b.id ? null : b.id)} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors">
                <Eye className="w-3 h-3" /> {selected === b.id ? 'Masquer' : 'Voir QR'}
              </button>
              <button onClick={() => handleDownload(b.id)} disabled={isDownloading === b.id} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors disabled:opacity-50">
                <Download className="w-3 h-3" /> {isDownloading === b.id ? 'Génération...' : 'Image'}
              </button>
              <button onClick={() => handleShare(b)} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors">
                <Share2 className="w-3 h-3" /> Partager
              </button>
              <button onClick={() => handleWhatsApp(b)} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#1DA851] text-white transition-colors">
                <MessageCircle className="w-3 h-3" /> WhatsApp
              </button>
              <button onClick={() => handlePrint(b.id)} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors">
                <Printer className="w-3 h-3" /> Imprimer
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Off-screen ticket for capturing white background image */}
      <div style={{ position: 'fixed', top: 0, left: 0, zIndex: -50, opacity: 0, pointerEvents: 'none' }}>
        {myBillets.map(b => (
          <div id={`capture-ticket-${b.id}`} key={`cap-${b.id}`} className="w-[400px] bg-white rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-[#0B0F19] p-4 text-center border-b-[3px] border-orange-500">
              <h3 className="text-xl font-bold text-white tracking-tight flex justify-center items-center gap-2">
                <Bus className="w-5 h-5 text-orange-500" />
                Aller<span className="text-orange-500">Retour</span>
              </h3>
              <p className="text-slate-400 text-xs mt-1">{b.compagnie}</p>
            </div>
            
            <div className="p-6 relative">
              <div className="flex justify-between items-center mb-6 gap-2">
                <div className="flex-1">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Départ</p>
                  <p className="text-lg font-black text-slate-900 leading-tight">{b.trajet.split('→')[0]?.trim() || 'Dakar'}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-orange-500 shrink-0" />
                <div className="flex-1 text-right">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Arrivée</p>
                  <p className="text-lg font-black text-slate-900 leading-tight">{b.trajet.split('→')[1]?.trim() || 'Touba'}</p>
                </div>
              </div>

              <div className="border-t-2 border-dashed border-slate-200 py-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Passager</p>
                  <p className="font-bold text-slate-900 break-words leading-tight">{b.passager || 'Abdou Bakhe'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Siège</p>
                  <p className="font-bold text-orange-600 text-lg">{b.siege}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Date & Heure</p>
                  <p className="font-bold text-slate-900">{b.date} • {b.heure}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Référence</p>
                  <p className="font-bold text-slate-900">{b.id}</p>
                </div>
              </div>

              <div className="border-t-2 border-dashed border-slate-200 pt-4 flex justify-center">
                <div className="text-center">
                  <div className="flex justify-center mb-4 mt-2">
                    <QRCodeBrandEngine 
                      value={b.id} 
                      size={120} 
                    />
                  </div>
                  <p className="text-[10px] text-slate-500">Scanner au moment de l'embarquement</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
