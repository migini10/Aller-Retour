import 'package:flutter/material.dart';
import '../../widgets/app_drawer.dart';

class FideliteScreen extends StatelessWidget {
  const FideliteScreen({super.key});

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
            Icon(Icons.workspace_premium, color: Colors.amberAccent),
            SizedBox(width: 12),
            Text('Points Fidélité', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          ],
        ),
        actions: [
          Builder(
            builder: (context) => IconButton(
              icon: const Icon(Icons.menu, color: Colors.white),
              onPressed: () => Scaffold.of(context).openEndDrawer(),
            ),
          ),
        ],
      ),
      endDrawer: const AppDrawer(isDriverMode: false),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Gagnez des points à chaque trajet et débloquez des récompenses.',
              style: TextStyle(color: Colors.white54, fontSize: 14),
            ),
            const SizedBox(height: 24),
            
            // Main Card (Balance & Level)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Colors.teal, Color(0xFF004D40)], // emerald-600 to teal-800
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(color: Colors.teal.withOpacity(0.3), blurRadius: 15, offset: const Offset(0, 5)),
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
                            Icon(Icons.workspace_premium, color: Colors.amberAccent, size: 14),
                            SizedBox(width: 6),
                            Text('STATUT GOLD', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1.0)),
                          ],
                        ),
                      ),
                      const Icon(Icons.workspace_premium_outlined, color: Colors.white70, size: 28),
                    ],
                  ),
                  const SizedBox(height: 24),
                  const Text('Solde actuel', style: TextStyle(color: Colors.white70, fontSize: 14)),
                  const SizedBox(height: 4),
                  RichText(
                    text: const TextSpan(
                      children: [
                        TextSpan(text: '450 ', style: TextStyle(color: Colors.white, fontSize: 48, fontWeight: FontWeight.w900)),
                        TextSpan(text: 'PTS', style: TextStyle(color: Colors.white70, fontSize: 24, fontWeight: FontWeight.bold)),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
                  
                  // Progress to Next Level
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.black.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.white10),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: const [
                            Row(
                              children: [
                                Icon(Icons.track_changes, color: Colors.white, size: 16),
                                SizedBox(width: 8),
                                Text('Prochain Palier', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12)),
                              ],
                            ),
                            Text('550 PTS', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12)),
                          ],
                        ),
                        const SizedBox(height: 12),
                        Stack(
                          children: [
                            Container(height: 12, width: double.infinity, decoration: BoxDecoration(color: Colors.black38, borderRadius: BorderRadius.circular(6))),
                            Container(
                              height: 12, 
                              width: 220, 
                              decoration: BoxDecoration(
                                gradient: const LinearGradient(colors: [Colors.tealAccent, Colors.amberAccent]),
                                borderRadius: BorderRadius.circular(6),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        const Text('Plus que 100 PTS pour un trajet Dakar ➔ Thiès gratuit !', style: TextStyle(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.w600)),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            
            // Info Cards
            Row(
              children: [
                Expanded(
                  child: _buildInfoCard(
                    Icons.bolt,
                    Colors.tealAccent,
                    'Comment gagner des points ?',
                    'Gagnez 10 points par tranche de 1000 FCFA dépensée.',
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildInfoCard(
                    Icons.star,
                    Colors.amberAccent,
                    'Avantages VIP',
                    'Embarquement prioritaire, support 24/7, annulation gratuite.',
                  ),
                ),
              ],
            ),
            const SizedBox(height: 32),
            
            // Rewards List
            const Row(
              children: [
                Icon(Icons.card_giftcard, color: Colors.tealAccent),
                SizedBox(width: 8),
                Text('Récompenses', style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
              ],
            ),
            const SizedBox(height: 16),
            
            // Reward 1
            _buildRewardItem(
              title: 'Billet Gratuit (Thiès)',
              desc: 'Valable pour 1 trajet simple',
              points: '550 pts',
              pointsColor: Colors.tealAccent,
              buttonText: 'Bientôt',
              buttonColor: Colors.grey.shade800,
              textColor: Colors.white54,
              borderColor: Colors.teal.withOpacity(0.3),
            ),
            
            // Reward 2
            _buildRewardItem(
              title: 'Billet Gratuit (Touba)',
              desc: 'Valable pour 1 trajet simple',
              points: '800 pts',
              pointsColor: Colors.white54,
              buttonText: 'Bloqué',
              buttonColor: Colors.grey.shade900,
              textColor: Colors.white38,
              borderColor: Colors.white10,
            ),
            
            // Reward 3
            _buildRewardItem(
              title: 'Franchise Colis (10kg)',
              desc: 'Envoyez 10kg gratuitement',
              points: '300 pts',
              pointsColor: Colors.white54,
              buttonText: 'Débloquer',
              buttonColor: Colors.teal,
              textColor: Colors.white,
              borderColor: Colors.white10,
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoCard(IconData icon, Color iconColor, String title, String desc) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF0F172A),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white10),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: iconColor.withOpacity(0.15),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: iconColor, size: 20),
          ),
          const SizedBox(height: 12),
          Text(title, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
          const SizedBox(height: 4),
          Text(desc, style: const TextStyle(color: Colors.white54, fontSize: 11)),
        ],
      ),
    );
  }

  Widget _buildRewardItem({
    required String title,
    required String desc,
    required String points,
    required Color pointsColor,
    required String buttonText,
    required Color buttonColor,
    required Color textColor,
    required Color borderColor,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF0F172A),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: borderColor),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15)),
          const SizedBox(height: 4),
          Text(desc, style: const TextStyle(color: Colors.white54, fontSize: 12)),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(points, style: TextStyle(color: pointsColor, fontWeight: FontWeight.w900, fontSize: 16)),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: buttonColor,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(buttonText, style: TextStyle(color: textColor, fontSize: 12, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
