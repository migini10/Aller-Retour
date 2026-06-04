import 'package:flutter/material.dart';
import 'dart:ui' as ui;
import 'widgets/recharge_modal.dart';
class WalletScreen extends StatelessWidget {
  const WalletScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF020617), // slate-950
      appBar: AppBar(
        backgroundColor: const Color(0xFF0F172A),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Row(
          children: [
            Icon(Icons.account_balance_wallet, color: Colors.blueAccent),
            SizedBox(width: 12),
            Text('Mon Wallet', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          ],
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Recharger Button at Top
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () {
                  showRechargeModal(context);
                },
                icon: const Icon(Icons.add, color: Colors.white),
                label: const Text('Recharger le compte'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blueAccent,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  textStyle: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
              ),
            ),
            const SizedBox(height: 24),
            
            // Main Balance Card
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Colors.blueAccent, Colors.indigo],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(color: Colors.blueAccent.withOpacity(0.3), blurRadius: 15, offset: const Offset(0, 5)),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: Colors.white.withOpacity(0.3)),
                        ),
                        child: const Row(
                          children: [
                            Icon(Icons.auto_awesome, color: Colors.white, size: 14),
                            SizedBox(width: 6),
                            Text('COMPTE PRINCIPAL', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1.0)),
                          ],
                        ),
                      ),
                      const Icon(Icons.account_balance_wallet, color: Colors.white70),
                    ],
                  ),
                  const SizedBox(height: 24),
                  const Text('Solde disponible', style: TextStyle(color: Colors.white70, fontSize: 14)),
                  const SizedBox(height: 4),
                  RichText(
                    text: const TextSpan(
                      children: [
                        TextSpan(text: '45 000 ', style: TextStyle(color: Colors.white, fontSize: 40, fontWeight: FontWeight.w900)),
                        TextSpan(text: 'FCFA', style: TextStyle(color: Colors.white70, fontSize: 20, fontWeight: FontWeight.bold)),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Module d\'envoi...')));
                      },
                      icon: const Icon(Icons.call_made, color: Colors.blueAccent),
                      label: const Text('Envoyer du solde'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white,
                        foregroundColor: Colors.blueAccent,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        textStyle: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Statistiques du mois
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: const Color(0xFF0F172A),
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: Colors.white10),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Row(
                    children: [
                      Icon(Icons.analytics_outlined, color: Colors.white54, size: 20),
                      SizedBox(width: 8),
                      Text('Statistiques du mois', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
                    ],
                  ),
                  const SizedBox(height: 20),
                  
                  // Dépenses Progress
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: const [
                      Text('Dépenses', style: TextStyle(color: Colors.white54, fontSize: 14)),
                      Text('12 500 FCFA', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Stack(
                    children: [
                      Container(height: 8, width: double.infinity, decoration: BoxDecoration(color: Colors.white10, borderRadius: BorderRadius.circular(4))),
                      Container(height: 8, width: 140, decoration: BoxDecoration(color: Colors.amber, borderRadius: BorderRadius.circular(4))),
                    ],
                  ),
                  const SizedBox(height: 20),

                  // Recharges Progress
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: const [
                      Text('Recharges', style: TextStyle(color: Colors.white54, fontSize: 14)),
                      Text('25 000 FCFA', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Stack(
                    children: [
                      Container(height: 8, width: double.infinity, decoration: BoxDecoration(color: Colors.white10, borderRadius: BorderRadius.circular(4))),
                      Container(height: 8, width: 220, decoration: BoxDecoration(color: Colors.blueAccent, borderRadius: BorderRadius.circular(4))),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),
            
            // Transactions Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Dernières Transactions', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                TextButton.icon(
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Relevé PDF en préparation...')));
                  },
                  icon: const Icon(Icons.download, size: 16, color: Colors.blueAccent),
                  label: const Text('Relevé PDF', style: TextStyle(color: Colors.blueAccent)),
                ),
              ],
            ),
            const SizedBox(height: 16),
            
            // Transaction 1
            _buildTransactionItem(
              icon: Icons.arrow_downward,
              iconColor: Colors.blueAccent,
              title: 'Dépôt Wave Mobile Money',
              date: '17 Mai 2026 • 10:45',
              amount: '+ 15 000 FCFA',
              amountColor: Colors.blueAccent,
              status: 'Complété',
              statusColor: Colors.greenAccent,
            ),
            
            // Transaction 2
            _buildTransactionItem(
              icon: Icons.arrow_upward,
              iconColor: Colors.orangeAccent,
              title: 'Réservation Dakar ➔ Touba',
              date: '15 Mai 2026 • 14:20',
              amount: '- 4 500 FCFA',
              amountColor: Colors.white,
              status: 'En Séquestre',
              statusColor: Colors.orangeAccent,
            ),
            
            // Transaction 3
            _buildTransactionItem(
              icon: Icons.credit_card,
              iconColor: Colors.purpleAccent,
              title: 'Paiement Colis Express',
              date: '12 Mai 2026 • 09:15',
              amount: '- 2 500 FCFA',
              amountColor: Colors.white,
              status: 'Terminé',
              statusColor: Colors.grey,
            ),
            
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              child: OutlinedButton(
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Historique...')));
                },
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: Colors.white24, style: BorderStyle.solid),
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                child: const Text('Voir tout l\'historique', style: TextStyle(color: Colors.white70, fontWeight: FontWeight.bold)),
              ),
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _buildTransactionItem({
    required IconData icon,
    required Color iconColor,
    required String title,
    required String date,
    required String amount,
    required Color amountColor,
    required String status,
    required Color statusColor,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF0F172A),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFF1E293B)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: iconColor.withOpacity(0.15),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Icon(icon, color: iconColor, size: 24),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                const SizedBox(height: 4),
                Text(date, style: const TextStyle(color: Colors.white54, fontSize: 12)),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(amount, style: TextStyle(color: amountColor, fontWeight: FontWeight.w900, fontSize: 16)),
              const SizedBox(height: 6),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: statusColor.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(4),
                  border: Border.all(color: statusColor.withOpacity(0.3)),
                ),
                child: Text(status.toUpperCase(), style: TextStyle(color: statusColor, fontSize: 9, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        ],
      ),
    );
  }


}
