import os

file_path = '/Users/macbookair/Aller-Retour/apps/mobile/lib/screens/client/client_dashboard_screen.dart'

with open(file_path, 'r') as f:
    content = f.read()

# 1. Add the call in the ListView
old_list_view = """                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 32.0),
                      child: _buildServicesSection(context),
                    ),
                    SizedBox(height: MediaQuery.of(context).padding.bottom + 40),"""

new_list_view = """                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 32.0),
                      child: _buildServicesSection(context),
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16.0),
                      child: _buildActivitySummarySection(context),
                    ),
                    SizedBox(height: MediaQuery.of(context).padding.bottom + 40),"""
content = content.replace(old_list_view, new_list_view)

# 2. Add the new methods after _buildServicesSection ends
old_services_end = """        ),
      ],
    );
  }

  void _showReservationBottomSheet(BuildContext context) {"""

new_methods = """        ),
      ],
    );
  }

  Widget _buildActivitySummarySection(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: const Color(0xFFF97316).withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Icon(Icons.analytics_rounded, color: Color(0xFFF97316), size: 20),
            ),
            const SizedBox(width: 12),
            Text(
              'Aperçu de l\\'activité', style: TextStyle(color: Theme.of(context).colorScheme.onSurface,
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
        const SizedBox(height: 20),
        _buildActivityCard(context, 'Points Cumulés', 'X', Icons.stars_rounded, const Color(0xFFEAB308)),
        const SizedBox(height: 12),
        _buildActivityCard(context, 'Dernier Billet', 'X', Icons.directions_car_rounded, const Color(0xFF3B82F6)),
        const SizedBox(height: 12),
        _buildActivityCard(context, 'Dernier Colis', 'X', Icons.local_shipping_rounded, const Color(0xFF10B981)),
      ],
    );
  }

  Widget _buildActivityCard(BuildContext context, String title, String value, IconData icon, Color color) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E293B) : Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color.withValues(alpha: 0.2)),
        boxShadow: [
          BoxShadow(
            color: isDark ? Colors.black.withValues(alpha: 0.2) : Colors.black.withValues(alpha: 0.03),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Icon(icon, color: color, size: 24),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Text(
              title,
              style: TextStyle(
                color: Theme.of(context).colorScheme.onSurface,
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF0F172A) : const Color(0xFFF1F5F9),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Text(
              value,
              style: TextStyle(
                color: Theme.of(context).colorScheme.onSurface,
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _showReservationBottomSheet(BuildContext context) {"""

content = content.replace(old_services_end, new_methods)

with open(file_path, 'w') as f:
    f.write(content)
