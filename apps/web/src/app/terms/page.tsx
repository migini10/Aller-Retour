import React from 'react';
import { FileText } from 'lucide-react';
import PublicNavbar from '../../components/PublicNavbar';
import Footer from '../../components/Footer';

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicNavbar />
      <div className="flex-1 bg-white dark:bg-[#0F172A] pt-12 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 border-b border-slate-200 dark:border-slate-800 pb-8">
          <div className="w-16 h-16 bg-orange-100 dark:bg-orange-500/20 rounded-2xl flex items-center justify-center mb-6 text-orange-600 dark:text-orange-400">
            <FileText className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">Conditions d'Utilisation</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Dernière mise à jour : 22 Juin 2026
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:text-slate-600 dark:prose-p:text-slate-300">
          <h2>1. Acceptation des Conditions</h2>
          <p>
            En accédant et en utilisant la plateforme <strong>Allogoo</strong> (site web et application mobile), vous acceptez d'être lié par les présentes Conditions d'Utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos services.
          </p>

          <h2>2. Description du Service</h2>
          <p>
            Allogoo est une plateforme de mise en relation permettant de :
          </p>
          <ul>
            <li>Réserver des trajets inter-urbains (bus, taxi, covoiturage).</li>
            <li>Expédier et suivre des colis via des chauffeurs partenaires.</li>
            <li>Recharger et utiliser un portefeuille électronique (Wallet) pour faciliter les transactions sur la plateforme.</li>
          </ul>
          <p>
            Allogoo agit en tant qu'intermédiaire technologique et non en tant que transporteur direct. Le contrat de transport est conclu directement entre l'utilisateur et le transporteur partenaire.
          </p>

          <h2>3. Inscription et Compte Utilisateur</h2>
          <p>
            Pour utiliser certains services, vous devez créer un compte. Vous vous engagez à :
          </p>
          <ul>
            <li>Fournir des informations exactes et à jour.</li>
            <li>Maintenir la sécurité et la confidentialité de vos identifiants.</li>
            <li>Être responsable de toutes les activités effectuées sous votre compte.</li>
          </ul>

          <h2>4. Réservations et Annulations</h2>
          <p><strong>Réservations :</strong> Toute réservation est ferme une fois le paiement validé (ou le débit du Wallet effectué). Un billet électronique (QR Code) vous sera délivré.</p>
          <p><strong>Annulations :</strong> Vous pouvez annuler votre réservation gratuitement jusqu'à 24h avant l'heure prévue. Les annulations tardives peuvent entraîner des frais selon la politique du transporteur concerné.</p>

          <h2>5. Tarifs et Paiements</h2>
          <p>
            Les prix affichés sur la plateforme sont TTC. Le paiement des services peut s'effectuer par Mobile Money (Wave, Orange Money) ou via le Wallet Allogoo.
            Le solde de votre Wallet n'est pas productif d'intérêts et ne peut être échangé contre des espèces en dehors du cadre strict de remboursement prévu par nos CGV.
          </p>

          <h2>6. Engagements de l'Utilisateur</h2>
          <p>
            L'utilisateur s'engage à utiliser la plateforme de manière licite. Il est formellement interdit de :
          </p>
          <ul>
            <li>Envoyer des colis contenant des marchandises illicites, dangereuses ou interdites par la loi sénégalaise.</li>
            <li>Avoir un comportement inapproprié envers les chauffeurs ou les autres passagers.</li>
            <li>Tenter de frauder le système de paiement.</li>
          </ul>

          <h2>7. Responsabilités</h2>
          <p>
            <strong>Responsabilité d'Allogoo :</strong> Nous nous engageons à maintenir la plateforme accessible et fonctionnelle. Toutefois, notre responsabilité ne saurait être engagée en cas de force majeure, de panne de réseau ou d'actions imputables aux transporteurs.
          </p>
          <p>
            <strong>Responsabilité du Transporteur :</strong> Le transporteur partenaire est seul responsable de l'exécution du trajet et de l'intégrité des colis transportés.
          </p>

          <h2>8. Droit Applicable et Litiges</h2>
          <p>
            Les présentes conditions sont régies par le droit sénégalais. En cas de litige, une solution à l'amiable sera recherchée en contactant notre service client. À défaut d'accord, les tribunaux de Dakar seront seuls compétents.
          </p>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
}
