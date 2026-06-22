import 'package:flutter/material.dart';

class PrivacyScreen extends StatelessWidget {
  const PrivacyScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.background,
      appBar: AppBar(
        title: const Text('Confidentialité', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.blue.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.shield_outlined, color: Colors.blue, size: 32),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Politique de Confidentialité', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Colors.blue)),
                          const SizedBox(height: 4),
                          Text('Dernière mise à jour : 22 Juin 2026', style: TextStyle(color: Colors.blue.shade700, fontSize: 12)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 30),
              
              _buildSection(
                context,
                title: '1. Introduction',
                content: 'Bienvenue sur Allogoo. Nous accordons une grande importance à la confidentialité et à la sécurité de vos données personnelles. Cette politique de confidentialité explique comment nous recueillons, utilisons, partageons et protégeons vos informations lorsque vous utilisez notre application mobile.',
              ),
              
              _buildSection(
                context,
                title: '2. Informations que nous collectons',
                content: 'Nous pouvons collecter les catégories d\'informations suivantes :\n\n'
                    '• Informations d\'identification : Nom, prénom, numéro de téléphone, adresse email.\n'
                    '• Données de localisation : Coordonnées GPS pour le suivi des chauffeurs et l\'estimation des trajets (si vous l\'autorisez).\n'
                    '• Informations de paiement : Historique des transactions (Les paiements sont traités de manière sécurisée par nos partenaires, nous ne stockons pas vos numéros de carte).\n'
                    '• Données d\'utilisation : Informations sur la façon dont vous interagissez avec notre plateforme.',
              ),
              
              _buildSection(
                context,
                title: '3. Comment nous utilisons vos informations',
                content: 'Les données collectées sont utilisées pour :\n\n'
                    '• Faciliter et gérer vos réservations et envois de colis.\n'
                    '• Assurer la sécurité des trajets (suivi en temps réel).\n'
                    '• Améliorer nos services et personnaliser votre expérience utilisateur.\n'
                    '• Communiquer avec vous (confirmations, alertes, support client).',
              ),
              
              _buildSection(
                context,
                title: '4. Partage des informations',
                content: 'Nous ne vendons jamais vos données personnelles. Cependant, nous pouvons partager certaines informations avec :\n\n'
                    '• Les chauffeurs et partenaires : Uniquement les informations nécessaires à la réalisation de votre trajet ou livraison.\n'
                    '• Les prestataires de services : Fournisseurs de paiement, services d\'envoi de SMS.\n'
                    '• Les autorités compétentes : Si la loi l\'exige ou pour protéger les droits de nos utilisateurs.',
              ),
              
              _buildSection(
                context,
                title: '5. Sécurité de vos données',
                content: 'Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles conformes aux standards de l\'industrie pour protéger vos données contre l\'accès non autorisé, l\'altération ou la destruction.',
              ),
              
              _buildSection(
                context,
                title: '6. Vos droits',
                content: 'Vous disposez des droits d\'accès, de rectification, de suppression et d\'opposition concernant vos données. Pour exercer ces droits, vous pouvez nous contacter via la page Contact ou par email à privacy@allogoo.sn.',
              ),
              
              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSection(BuildContext context, {required String title, required String content}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 24.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            content,
            style: TextStyle(
              fontSize: 15,
              height: 1.6,
              color: Theme.of(context).colorScheme.onSurfaceVariant,
            ),
          ),
        ],
      ),
    );
  }
}
