import type { Metadata } from 'next';
import './globals.css';
import { ModalProvider } from '../components/ModalContext';
import { AuthProvider } from '../components/AuthContext';
import { ThemeProvider } from '../components/ThemeProvider';

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
    <html lang="fr" suppressHydrationWarning className="overflow-hidden">
      <body className="min-h-[100dvh] overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col transition-colors duration-300 m-0 p-0">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AuthProvider>
            <ModalProvider>
              {children}
            </ModalProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
