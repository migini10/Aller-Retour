import os

file_path = '/Users/macbookair/Aller-Retour/apps/mobile/lib/screens/client/client_dashboard_screen.dart'

with open(file_path, 'r') as f:
    content = f.read()

# 1. Add the calls in the ListView
old_list_view = """                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 32.0),
                      child: _buildServicesSection(context),
                    ),
                    SizedBox(height: MediaQuery.of(context).padding.bottom + 40),"""

new_list_view = """                    // Statut en Direct
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16.0),
                      child: _buildLiveStatusSection(context),
                    ),
                    
                    // Vos Services
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 32.0),
                      child: _buildServicesSection(context),
                    ),

                    // Carrousel Promo
                    _buildPromoCarousel(context),

                    // Historique Récent
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 32.0),
                      child: _buildRecentHistory(context),
                    ),

                    // Destinations Populaires
                    Padding(
                      padding: const EdgeInsets.only(bottom: 32.0),
                      child: _buildPopularDestinations(context),
                    ),

                    SizedBox(height: MediaQuery.of(context).padding.bottom + 40),"""
content = content.replace(old_list_view, new_list_view)

# 2. Define the new methods
old_services_end = """        ),
      ],
    );
  }


  void _showReservationBottomSheet(BuildContext context) {"""

new_methods = """        ),
      ],
    );
  }

  // --- NOUVELLES SECTIONS PREMIUM ---

  Widget _buildLiveStatusSection(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Container(
      margin: const EdgeInsets.only(top: 24),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: isDark ? [const Color(0xFF1E293B), const Color(0xFF0F172A)] : [const Color(0xFFF0FDF4), Colors.white],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: isDark ? const Color(0xFF22C55E).withValues(alpha: 0.3) : const Color(0xFFBBF7D0)),
        boxShadow: [
          BoxShadow(
            color: isDark ? Colors.black.withValues(alpha: 0.4) : const Color(0xFF22C55E).withValues(alpha: 0.1),
            blurRadius: 15,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFF22C55E).withValues(alpha: 0.2),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.local_shipping_rounded, color: Color(0xFF22C55E), size: 28),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Colis en transit',
                  style: TextStyle(
                    color: Theme.of(context).colorScheme.onSurface,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Dakar → Touba • Arrivée estimée : 14h30',
                  style: TextStyle(
                    color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.6),
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 12),
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF0F172A) : Colors.white,
              shape: BoxShape.circle,
              border: Border.all(color: const Color(0xFF22C55E).withValues(alpha: 0.5)),
            ),
            child: const Icon(Icons.arrow_forward_ios_rounded, color: Color(0xFF22C55E), size: 14),
          ),
        ],
      ),
    );
  }

  Widget _buildPromoCarousel(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return SizedBox(
      height: 160,
      child: PageView(
        controller: PageController(viewportFraction: 0.9),
        children: [
          _buildPromoCard(
            context,
            'Parrainez un proche !',
            'Gagnez 2000 FCFA sur votre prochain trajet pour chaque parrainage.',
            const Color(0xFFF97316),
            Icons.card_giftcard_rounded,
            isDark,
          ),
          _buildPromoCard(
            context,
            'Nouveau Service',
            'Suivez désormais vos colis en temps réel sur la carte.',
            const Color(0xFF3B82F6),
            Icons.map_rounded,
            isDark,
          ),
        ],
      ),
    );
  }

  Widget _buildPromoCard(BuildContext context, String title, String desc, Color color, IconData icon, bool isDark) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 8),
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [color, color.withValues(alpha: 0.8)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: color.withValues(alpha: 0.4),
            blurRadius: 15,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Stack(
        children: [
          Positioned(
            right: -20,
            bottom: -20,
            child: Icon(icon, size: 100, color: Colors.white.withValues(alpha: 0.2)),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.3),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Text('NOUVEAU', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
              ),
              const SizedBox(height: 12),
              Text(title, style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
              const SizedBox(height: 4),
              Text(desc, style: TextStyle(color: Colors.white.withValues(alpha: 0.9), fontSize: 13), maxLines: 2, overflow: TextOverflow.ellipsis),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildRecentHistory(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text('Activité Récente', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 20, fontWeight: FontWeight.bold)),
            Text('Voir tout', style: TextStyle(color: const Color(0xFFF97316), fontSize: 14, fontWeight: FontWeight.bold)),
          ],
        ),
        const SizedBox(height: 24),
        _buildTimelineItem(context, 'Colis livré', 'Dakar → Thiès', 'Hier, 14:30', Icons.check_circle_rounded, const Color(0xFF22C55E), true),
        _buildTimelineItem(context, 'Trajet terminé', 'Aller-Retour : Dakar → Touba', '10 Juin, 08:00', Icons.directions_car_rounded, const Color(0xFF3B82F6), false),
      ],
    );
  }

  Widget _buildTimelineItem(BuildContext context, String title, String subtitle, String time, IconData icon, Color color, bool isLast) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Column(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(color: color.withValues(alpha: 0.15), shape: BoxShape.circle),
              child: Icon(icon, color: color, size: 16),
            ),
            if (isLast)
              Container(
                width: 2,
                height: 40,
                color: Theme.of(context).dividerColor,
                margin: const EdgeInsets.symmetric(vertical: 4),
              ),
          ],
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 16, fontWeight: FontWeight.bold)),
              const SizedBox(height: 2),
              Text(subtitle, style: TextStyle(color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.6), fontSize: 13)),
              if (isLast) const SizedBox(height: 20),
            ],
          ),
        ),
        Text(time, style: TextStyle(color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.5), fontSize: 12, fontWeight: FontWeight.bold)),
      ],
    );
  }

  Widget _buildPopularDestinations(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final destinations = [
      {'city': 'Touba', 'price': 'À partir de 4000 FCFA', 'color': const Color(0xFFF59E0B)},
      {'city': 'Thiès', 'price': 'À partir de 2000 FCFA', 'color': const Color(0xFF10B981)},
      {'city': 'Mbour', 'price': 'À partir de 2500 FCFA', 'color': const Color(0xFF06B6D4)},
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0),
          child: Text('Destinations Populaires', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 20, fontWeight: FontWeight.bold)),
        ),
        const SizedBox(height: 16),
        SizedBox(
          height: 140,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 12),
            itemCount: destinations.length,
            itemBuilder: (context, index) {
              final dest = destinations[index];
              final color = dest['color'] as Color;
              return Container(
                width: 140,
                margin: const EdgeInsets.symmetric(horizontal: 4),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [color.withValues(alpha: 0.8), color],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: [
                    BoxShadow(color: color.withValues(alpha: 0.3), blurRadius: 10, offset: const Offset(0, 4)),
                  ],
                ),
                child: Stack(
                  children: [
                    Positioned(
                      right: -10,
                      bottom: -10,
                      child: Icon(Icons.location_city_rounded, size: 80, color: Colors.white.withValues(alpha: 0.2)),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          Text(dest['city'] as String, style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                          const SizedBox(height: 4),
                          Text(dest['price'] as String, style: TextStyle(color: Colors.white.withValues(alpha: 0.9), fontSize: 10)),
                        ],
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  void _showReservationBottomSheet(BuildContext context) {"""

if old_services_end in content:
    content = content.replace(old_services_end, new_methods)
else:
    print("Could not find the end of _buildServicesSection!")

with open(file_path, 'w') as f:
    f.write(content)
