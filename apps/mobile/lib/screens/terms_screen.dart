import 'package:flutter/material.dart';
import '../widgets/app_drawer.dart';

class TermsScreen extends StatelessWidget {
  const TermsScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.background,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                color: Colors.orange.withOpacity(0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(Icons.local_taxi, color: Colors.orange, size: 20),
            ),
            const SizedBox(width: 8),
            const Text(
              'Conditions',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
            ),
          ],
        ),
        actions: [
          Builder(
            builder: (context) => IconButton(
              icon: const Icon(Icons.menu),
              onPressed: () => Scaffold.of(context).openEndDrawer(),
            ),
          ),
        ],
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
      ),
      endDrawer: const AppDrawer(isDriverMode: false),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.orange.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.description_outlined, color: Colors.orange, size: 32),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Conditions Générales', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Colors.orange)),
                          const SizedBox(height: 4),
                          Text('Dernière mise à jour : 22 Juin 2026', style: TextStyle(color: Colors.orange.shade700, fontSize: 12)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 30),
              
              _buildSection(
                context,
                title: '1. Acceptation des Conditions',
                content: 'En accédant et en utilisant l\'application mobile Allogoo, vous acceptez d\'être lié par les présentes Conditions d\'Utilisation. Si vous n\'acceptez pas ces conditions, veuillez ne pas utiliser nos services.',
              ),
              
              _buildSection(
                context,
                title: '2. Description du Service',
                content: 'Allogoo est une plateforme de mise en relation permettant de :\n\n'
                    '• Réserver des trajets inter-urbains.\n'
                    '• Expédier et suivre des colis via des chauffeurs partenaires.\n'
                    '• Recharger et utiliser un portefeuille électronique (Wallet).\n\n'
                    'Allogoo agit en tant qu\'intermédiaire technologique et non en tant que transporteur direct.',
              ),
              
              _buildSection(
                context,
                title: '3. Inscription et Compte Utilisateur',
                content: 'Pour utiliser certains services, vous devez créer un compte. Vous vous engagez à :\n\n'
                    '• Fournir des informations exactes et à jour.\n'
                    '• Maintenir la sécurité de vos identifiants.\n'
                    '• Être responsable de toutes les activités sous votre compte.',
              ),
              
              _buildSection(
                context,
                title: '4. Réservations et Annulations',
                content: 'Toute réservation est ferme une fois le paiement validé. Vous pouvez annuler votre réservation gratuitement jusqu\'à 24h avant l\'heure prévue. Les annulations tardives peuvent entraîner des frais.',
              ),
              
              _buildSection(
                context,
                title: '5. Tarifs et Paiements',
                content: 'Les prix affichés sont TTC. Le paiement peut s\'effectuer par Mobile Money ou via le Wallet Allogoo. Le solde du Wallet n\'est pas productif d\'intérêts.',
              ),
              
              _buildSection(
                context,
                title: '6. Engagements de l\'Utilisateur',
                content: 'Il est formellement interdit de :\n\n'
                    '• Envoyer des colis contenant des marchandises illicites.\n'
                    '• Avoir un comportement inapproprié envers les chauffeurs.\n'
                    '• Tenter de frauder le système de paiement.',
              ),
              
              _buildSection(
                context,
                title: '7. Droit Applicable',
                content: 'Les présentes conditions sont régies par le droit sénégalais. En cas de litige, une solution à l\'amiable sera recherchée en contactant notre service client.',
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
