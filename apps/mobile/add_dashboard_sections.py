import os

file_path = '/Users/macbookair/Aller-Retour/apps/mobile/lib/screens/client/client_dashboard_screen.dart'

with open(file_path, 'r') as f:
    content = f.read()

# 1. Update Layout
old_layout = """                    _buildHeroWithWalletAndButtons(context),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 32.0),
                      child: _buildServicesSection(context),
                    ),
                    SizedBox(height: MediaQuery.of(context).padding.bottom + 40),"""

new_layout = """                    _buildHeroWithWalletAndButtons(context),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 24.0),
                      child: _buildLiveStatusSection(context),
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16.0),
                      child: _buildServicesSection(context),
                    ),
                    const SizedBox(height: 32.0),
                    _buildPromoCarousel(context),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 32.0),
                      child: _buildRecentHistory(context),
                    ),
                    _buildPopularDestinations(context),
                    SizedBox(height: MediaQuery.of(context).padding.bottom + 40),"""

content = content.replace(old_layout, new_layout)

# 2. Add the widget methods before `_showReservationBottomSheet`
old_methods_end = """    );
  }

  void _showReservationBottomSheet(BuildContext context) {"""

new_widgets = """    );
  }

  Widget _buildLiveStatusSection(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E293B) : const Color(0xFFEFF6FF),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFF3B82F6).withValues(alpha: 0.3)),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF3B82F6).withValues(alpha: 0.1),
            blurRadius: 15,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: const BoxDecoration(
              color: Color(0xFF3B82F6),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.directions_car, color: Colors.white, size: 24),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'En route vers Dakar',
                  style: TextStyle(
                    color: Theme.of(context).colorScheme.onSurface,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Arrivée estimée dans 45 min',
                  style: TextStyle(
                    color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.6),
                    fontSize: 13,
                  ),
                ),
              ],
            ),
          ),
          const Icon(Icons.arrow_forward_ios, size: 16, color: Color(0xFF3B82F6)),
        ],
      ),
    );
  }

  Widget _buildPromoCarousel(BuildContext context) {
    return SizedBox(
      height: 140,
      child: PageView(
        controller: PageController(viewportFraction: 0.85),
        children: [
          _buildPromoCard(
            context,
            'Parrainez un proche',
            'Gagnez 2000 FCFA sur votre prochain trajet',
            const Color(0xFFF97316),
            Icons.card_giftcard,
          ),
          _buildPromoCard(
            context,
            'Voyagez Léger',
            '-10% sur les envois de colis cette semaine',
            const Color(0xFF10B981),
            Icons.local_offer,
          ),
        ],
      ),
    );
  }

  Widget _buildPromoCard(BuildContext context, String title, String subtitle, Color color, IconData icon) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 8),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [color.withValues(alpha: 0.8), color],
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
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  title,
                  style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 8),
                Text(
                  subtitle,
                  style: const TextStyle(color: Colors.white70, fontSize: 13),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
          Icon(icon, color: Colors.white.withValues(alpha: 0.5), size: 60),
        ],
      ),
    );
  }

  Widget _buildRecentHistory(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Historique Récent',
          style: TextStyle(
            color: Theme.of(context).colorScheme.onSurface,
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 20),
        _buildTimelineItem(context, 'Réservation confirmée', 'Dakar - Touba', 'Il y a 2h', Icons.check_circle, const Color(0xFF10B981), isLast: false),
        _buildTimelineItem(context, 'Colis livré', 'Touba - Dakar', 'Hier', Icons.local_shipping, const Color(0xFF3B82F6), isLast: true),
      ],
    );
  }

  Widget _buildTimelineItem(BuildContext context, String title, String subtitle, String time, IconData icon, Color color, {required bool isLast}) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Column(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: color, size: 16),
            ),
            if (!isLast)
              Container(
                width: 2,
                height: 30,
                color: Theme.of(context).dividerColor,
              ),
          ],
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: TextStyle(
                  color: Theme.of(context).colorScheme.onSurface,
                  fontSize: 15,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                subtitle,
                style: TextStyle(
                  color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.6),
                  fontSize: 13,
                ),
              ),
              if (!isLast) const SizedBox(height: 20),
            ],
          ),
        ),
        Text(
          time,
          style: TextStyle(
            color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.5),
            fontSize: 12,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }

  Widget _buildPopularDestinations(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0),
          child: Text(
            'Destinations Populaires',
            style: TextStyle(
              color: Theme.of(context).colorScheme.onSurface,
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        const SizedBox(height: 16),
        SizedBox(
          height: 180,
          child: ListView(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            scrollDirection: Axis.horizontal,
            children: [
              _buildDestinationCard(context, 'Touba', '5000 FCFA', 'https://images.unsplash.com/photo-1616422340325-1e35d1f88771?q=80&w=300&auto=format&fit=crop'),
              const SizedBox(width: 16),
              _buildDestinationCard(context, 'Thiès', '2500 FCFA', 'https://images.unsplash.com/photo-1542104595-6535552db9a3?q=80&w=300&auto=format&fit=crop'),
              const SizedBox(width: 16),
              _buildDestinationCard(context, 'Mbour', '3000 FCFA', 'https://images.unsplash.com/photo-1580977276076-ae4b8c219b8e?q=80&w=300&auto=format&fit=crop'),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildDestinationCard(BuildContext context, String city, String price, String imageUrl) {
    return Container(
      width: 140,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        color: Theme.of(context).cardColor,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.1),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20),
        child: Stack(
          fit: StackFit.expand,
          children: [
            Image.network(
              imageUrl,
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) => Container(color: Colors.grey[300]),
            ),
            Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [Colors.transparent, Colors.black.withValues(alpha: 0.8)],
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.end,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    city,
                    style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 4),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF97316),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      price,
                      style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showReservationBottomSheet(BuildContext context) {"""

content = content.replace(old_methods_end, new_widgets)

with open(file_path, 'w') as f:
    f.write(content)

