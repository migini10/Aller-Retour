import React from 'react';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0F172A] pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 border-b border-slate-200 dark:border-slate-800 pb-8">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">Politique de Confidentialité</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Dernière mise à jour : 22 Juin 2026
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:text-slate-600 dark:prose-p:text-slate-300">
          <h2>1. Introduction</h2>
          <p>
            Bienvenue sur <strong>Allogoo</strong>. Nous accordons une grande importance à la confidentialité et à la sécurité de vos données personnelles. Cette politique de confidentialité explique comment nous recueillons, utilisons, partageons et protégeons vos informations lorsque vous utilisez notre site web et notre application mobile.
          </p>

          <h2>2. Informations que nous collectons</h2>
          <p>Nous pouvons collecter les catégories d'informations suivantes :</p>
          <ul>
            <li><strong>Informations d'identification :</strong> Nom, prénom, numéro de téléphone, adresse email.</li>
            <li><strong>Données de localisation :</strong> Coordonnées GPS pour le suivi des chauffeurs et l'estimation des trajets (si vous l'autorisez).</li>
            <li><strong>Informations de paiement :</strong> Historique des transactions (Note : Les paiements sont traités de manière sécurisée par nos partenaires comme Wave ou Orange Money, nous ne stockons pas vos numéros de carte).</li>
            <li><strong>Données d'utilisation :</strong> Informations sur la façon dont vous interagissez avec notre plateforme.</li>
          </ul>

          <h2>3. Comment nous utilisons vos informations</h2>
          <p>Les données collectées sont utilisées pour :</p>
          <ul>
            <li>Faciliter et gérer vos réservations et envois de colis.</li>
            <li>Assurer la sécurité des trajets (suivi en temps réel).</li>
            <li>Améliorer nos services et personnaliser votre expérience utilisateur.</li>
            <li>Communiquer avec vous (confirmations, alertes, support client).</li>
            <li>Respecter nos obligations légales et réglementaires.</li>
          </ul>

          <h2>4. Partage des informations</h2>
          <p>
            Nous ne vendons <strong>jamais</strong> vos données personnelles. Cependant, nous pouvons partager certaines informations avec :
          </p>
          <ul>
            <li><strong>Les chauffeurs et partenaires :</strong> Uniquement les informations nécessaires à la réalisation de votre trajet ou livraison (votre prénom, lieu de prise en charge et numéro de téléphone masqué).</li>
            <li><strong>Les prestataires de services :</strong> Fournisseurs de paiement, hébergeurs cloud, services d'envoi de SMS (ex: Twilio).</li>
            <li><strong>Les autorités compétentes :</strong> Si la loi l'exige ou pour protéger les droits de nos utilisateurs.</li>
          </ul>

          <h2>5. Sécurité de vos données</h2>
          <p>
            Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles conformes aux standards de l'industrie (chiffrement, contrôles d'accès stricts) pour protéger vos données contre l'accès non autorisé, l'altération ou la destruction.
          </p>

          <h2>6. Vos droits</h2>
          <p>
            Conformément à la législation en vigueur (notamment la loi sur la protection des données au Sénégal), vous disposez des droits suivants :
          </p>
          <ul>
            <li>Droit d'accès et de rectification de vos données.</li>
            <li>Droit de suppression de votre compte et de vos données.</li>
            <li>Droit d'opposition ou de limitation du traitement.</li>
          </ul>
          <p>
            Pour exercer ces droits, vous pouvez nous contacter via notre page de <Link href="/contact" className="text-orange-500 hover:underline">contact</Link> ou par email à privacy@allogoo.sn.
          </p>

          <h2>7. Modifications de cette politique</h2>
          <p>
            Nous pouvons mettre à jour cette politique périodiquement. En cas de changement significatif, nous vous en informerons par email ou via une notification sur l'application.
          </p>
        </div>
      </div>
    </div>
  );
}
