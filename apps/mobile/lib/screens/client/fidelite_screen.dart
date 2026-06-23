import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../widgets/shared_scaffold.dart';

class FideliteScreen extends StatefulWidget {
  const FideliteScreen({super.key});

  @override
  State<FideliteScreen> createState() => _FideliteScreenState();
}

class _FideliteScreenState extends State<FideliteScreen> {
  int _transportPoints = 20;

  @override
  void initState() {
    super.initState();
    _loadPoints();
  }

  Future<void> _loadPoints() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _transportPoints = prefs.getInt('transportPoints') ?? 20;
    });
  }

  @override
  Widget build(BuildContext context) {
    int nextPalier = 300;
    String nextPalierText = "une franchise colis !";
    if (_transportPoints >= 300) {
      nextPalier = 550;
      nextPalierText = "un trajet Dakar ➔ Thiès gratuit !";
    }
    if (_transportPoints >= 550) {
      nextPalier = 800;
      nextPalierText = "un trajet Dakar ➔ Touba gratuit !";
    }
    if (_transportPoints >= 800) {
      nextPalier = 1500;
      nextPalierText = "le statut VIP exclusif !";
    }
    
    int pointsNeeded = nextPalier - _transportPoints;
    double progress = (_transportPoints / nextPalier).clamp(0.0, 1.0);

    return SharedScaffold(
      title: 'Points de transport',
      subtitle: 'Cumulez des points et profitez d\'avantages exclusifs.',
      icon: Icons.stars,
      iconColor: Colors.amberAccent,
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Gagnez des points à chaque trajet et débloquez des récompenses.', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 14),
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
                  BoxShadow(color: Colors.teal.withValues(alpha: 0.3), blurRadius: 15, offset: const Offset(0, 5)),
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
                          color: Colors.white.withValues(alpha: 0.2),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.workspace_premium, color: Colors.amberAccent, size: 14),
                            const SizedBox(width: 6),
                            Text('STATUT GOLD', style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1.0)),
                          ],
                        ),
                      ),
                      Icon(Icons.workspace_premium_outlined, color: Theme.of(context).colorScheme.onSurfaceVariant, size: 28),
                    ],
                  ),
                  const SizedBox(height: 24),
                  Text('Solde actuel', style: const TextStyle(color: Color(0xFFD1FAE5), fontSize: 14)),
                  const SizedBox(height: 4),
                  RichText(
                    text: TextSpan(
                      children: [
                        TextSpan(text: '$_transportPoints ', style: const TextStyle(color: Colors.white, fontSize: 48, fontWeight: FontWeight.w900)),
                        TextSpan(text: 'PTS', style: const TextStyle(color: Color(0xFFA7F3D0), fontSize: 24, fontWeight: FontWeight.bold)),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
                  
                  // Progress to Next Level
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.black.withValues(alpha: 0.2),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Theme.of(context).dividerColor.withValues(alpha: 0.5)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Row(
                              children: [
                                Icon(Icons.track_changes, color: const Color(0xFFD1FAE5), size: 16),
                                SizedBox(width: 8),
                                Text('Prochain Palier', style: const TextStyle(color: Color(0xFFD1FAE5), fontWeight: FontWeight.bold, fontSize: 12)),
                              ],
                            ),
                            Text('$nextPalier PTS', style: const TextStyle(color: Color(0xFFD1FAE5), fontWeight: FontWeight.bold, fontSize: 12)),
                          ],
                        ),
                        const SizedBox(height: 12),
                        ClipRRect(
                          borderRadius: BorderRadius.circular(6),
                          child: LinearProgressIndicator(
                            value: progress,
                            backgroundColor: Colors.black38,
                            valueColor: const AlwaysStoppedAnimation<Color>(Colors.tealAccent),
                            minHeight: 12,
                          ),
                        ),
                        const SizedBox(height: 12),
                        Text('Plus que $pointsNeeded PTS pour $nextPalierText', style: const TextStyle(color: Color(0xFFA7F3D0), fontSize: 11, fontWeight: FontWeight.w600)),
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
                    context,
                    Icons.bolt,
                    Colors.tealAccent,
                    'Comment gagner des points ?',
                    'Gagnez 1 point pour chaque 1000 FCFA dépensé.',
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildInfoCard(
                    context,
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
            Row(
              children: [
                const Icon(Icons.card_giftcard, color: Colors.tealAccent),
                const SizedBox(width: 8),
                Text('Récompenses', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 20, fontWeight: FontWeight.bold)),
              ],
            ),
            const SizedBox(height: 16),
            
            // Reward 1
            _buildRewardItem(
              context: context,
              title: 'Franchise Colis (10kg)',
              desc: 'Envoyez 10kg gratuitement',
              points: '300 pts',
              pointsColor: _transportPoints >= 300 ? Colors.tealAccent : Colors.white54,
              buttonText: _transportPoints >= 300 ? 'Débloquer' : 'Bloqué',
              buttonColor: _transportPoints >= 300 ? Colors.teal : Colors.grey.shade900,
              textColor: _transportPoints >= 300 ? Colors.white : Colors.white38,
              borderColor: _transportPoints >= 300 ? Colors.teal.withValues(alpha: 0.3) : Colors.white10,
            ),
            
            // Reward 2
            _buildRewardItem(
              context: context,
              title: 'Billet Gratuit (Thiès)',
              desc: 'Valable pour 1 trajet simple',
              points: '550 pts',
              pointsColor: _transportPoints >= 550 ? Colors.tealAccent : Colors.white54,
              buttonText: _transportPoints >= 550 ? 'Débloquer' : 'Bloqué',
              buttonColor: _transportPoints >= 550 ? Colors.teal : Colors.grey.shade900,
              textColor: _transportPoints >= 550 ? Colors.white : Colors.white38,
              borderColor: _transportPoints >= 550 ? Colors.teal.withValues(alpha: 0.3) : Colors.white10,
            ),
            
            // Reward 3
            _buildRewardItem(
              context: context,
              title: 'Billet Gratuit (Touba)',
              desc: 'Valable pour 1 trajet simple',
              points: '800 pts',
              pointsColor: _transportPoints >= 800 ? Colors.tealAccent : Colors.white54,
              buttonText: _transportPoints >= 800 ? 'Débloquer' : 'Bloqué',
              buttonColor: _transportPoints >= 800 ? Colors.teal : Colors.grey.shade900,
              textColor: _transportPoints >= 800 ? Colors.white : Colors.white38,
              borderColor: _transportPoints >= 800 ? Colors.teal.withValues(alpha: 0.3) : Colors.white10,
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoCard(BuildContext context, IconData icon, Color iconColor, String title, String desc) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Theme.of(context).dividerColor.withValues(alpha: 0.5)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: iconColor.withValues(alpha: 0.15),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: iconColor, size: 20),
          ),
          const SizedBox(height: 12),
          Text(title, style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.bold, fontSize: 13)),
          const SizedBox(height: 4),
          Text(desc, style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 11)),
        ],
      ),
    );
  }

  Widget _buildRewardItem({
    required BuildContext context,
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
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: borderColor),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.bold, fontSize: 15)),
          const SizedBox(height: 4),
          Text(desc, style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 12)),
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
