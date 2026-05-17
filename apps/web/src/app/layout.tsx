import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Aller-Retour | SaaS & Marketplace Transport Inter-Urbain Afrique',
  description: 'Réservez votre trajet inter-urbain au Sénégal et en Afrique avec horaires garantis, QR Code et paiement Wave/Orange Money.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        {children}
      </body>
    </html>
  );
}
