import type { Metadata } from 'next';
import './globals.css';
import { ModalProvider } from '../components/ModalContext';

import { AuthProvider } from '../components/AuthContext';

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
        <AuthProvider>
          <ModalProvider>
            {children}
          </ModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
