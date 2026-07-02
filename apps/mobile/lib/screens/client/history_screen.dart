import 'package:flutter/material.dart';
import '../../widgets/shared_scaffold.dart';

class HistoryScreen extends StatelessWidget {
  const HistoryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return SharedScaffold(
      title: 'Historique',
      subtitle: 'Retrouvez tous vos trajets et réservations passés.',
      icon: Icons.history,
      iconColor: Colors.greenAccent,
      body: ListView(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        padding: const EdgeInsets.all(20),
        children: [
           _buildHistoryItem(
            context: context,
            isRecent: true,
            isColis: true,
            title: 'Dakar ➔ Touba',
            date: 'Il y a 2 jours • En attente expirée',
            price: '3 000 FCFA',
            status: 'EXPIRÉ',
            color: Colors.redAccent,
          ),
          _buildHistoryItem(
            context: context,
            isRecent: true,
            isColis: true,
            title: 'Dakar ➔ Thiès',
            date: 'Il y a 3 jours • Livreur: Ousmane D.',
            price: '2 500 FCFA',
            status: 'LIVRÉ',
            color: Colors.greenAccent,
          ),
          _buildHistoryItem(
            context: context,
            isRecent: false,
            isColis: false,
            title: 'Dakar ➔ Touba',
            date: '12 Mai 2026 • Chauffeur: Amadou N.',
            price: '4 500 FCFA',
            status: 'TERMINÉ',
            color: Colors.white54,
          ),
          _buildHistoryItem(
            context: context,
            isRecent: false,
            isColis: false,
            title: 'Saint-Louis ➔ Dakar',
            date: '08 Mai 2026 • Chauffeur: Cheikh T.',
            price: '6 000 FCFA',
            status: 'TERMINÉ',
            color: Colors.white54,
          ),
        ],
      ),
    );
  }

  Widget _buildHistoryItem({
    required BuildContext context,
    required bool isRecent,
    required bool isColis,
    required String title,
    required String date,
    required String price,
    required String status,
    required Color color,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: isRecent ? color.withValues(alpha: 0.5) : Colors.white10),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: isRecent ? color.withValues(alpha: 0.15) : Colors.white10,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  status,
                  style: TextStyle(
                    color: isRecent ? color : Colors.white54,
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              Text(price, style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.bold, fontSize: 16)),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Icon(isColis ? Icons.inventory_2 : Icons.directions_car, color: isColis ? Colors.greenAccent : Colors.blueAccent, size: 24),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title, style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 16, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 4),
                    Text(date, style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 12)),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            child: OutlinedButton(
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Détails à venir !')));
              },
              style: OutlinedButton.styleFrom(
                side: BorderSide(color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.24)),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              child: Text(isColis ? 'Voir le reçu du colis' : 'Voir le reçu', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant)),
            ),
          ),
        ],
      ),
    );
  }
}
