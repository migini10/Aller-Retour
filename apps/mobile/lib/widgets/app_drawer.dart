import 'dart:ui';
import 'package:flutter/material.dart';

class AppDrawer extends StatelessWidget {
  final bool isDriverMode;
  final ValueChanged<bool>? onModeChanged;

  const AppDrawer({
    super.key,
    required this.isDriverMode,
    this.onModeChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Drawer(
      backgroundColor: Colors.transparent,
      elevation: 0,
      child: ClipRRect(
        borderRadius: const BorderRadius.horizontal(left: Radius.circular(32)),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 15.0, sigmaY: 15.0),
          child: Container(
            color: const Color(0xFF0F172A).withOpacity(0.65), // translucent slate
            child: SafeArea(
              child: Column(
                children: [
                  // Stylish Header
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(3),
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            border: Border.all(color: Colors.cyanAccent, width: 2),
                          ),
                          child: CircleAvatar(
                            radius: 28,
                            backgroundColor: Colors.cyanAccent.withOpacity(0.2),
                            child: const Text('AB', style: TextStyle(color: Colors.cyanAccent, fontSize: 20, fontWeight: FontWeight.bold)),
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('Abdou Bakhe', style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
                              const SizedBox(height: 6),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                decoration: BoxDecoration(
                                  color: Colors.orangeAccent.withOpacity(0.2),
                                  borderRadius: BorderRadius.circular(8),
                                  border: Border.all(color: Colors.orangeAccent.withOpacity(0.5)),
                                ),
                                child: Text(isDriverMode ? 'Chauffeur Pro' : 'Voyageur Gold', style: const TextStyle(color: Colors.orangeAccent, fontSize: 11, fontWeight: FontWeight.bold)),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  const Padding(
                    padding: EdgeInsets.symmetric(horizontal: 24),
                    child: Divider(color: Colors.white10),
                  ),
                  const SizedBox(height: 16),
                  // Menu Items
                  Expanded(
                    child: SingleChildScrollView(
                      child: Column(
                        children: [
                          if (isDriverMode) ...[
                            _buildMenuItem(context, Icons.dashboard_outlined, 'Accueil', Colors.orangeAccent, route: '/'),
                            _buildMenuItem(context, Icons.route_outlined, 'Missions & Trajets', Colors.greenAccent, route: '/driver/missions'),
                            _buildMenuItem(context, Icons.location_on_outlined, 'Localisation Client', Colors.cyanAccent, route: '/driver/localisation'),
                            _buildMenuItem(context, Icons.qr_code_scanner, 'Scanner Billet', Colors.purpleAccent, route: '/driver/scanner'),
                            _buildMenuItem(context, Icons.people_outline, 'Passagers', Colors.blueAccent, route: '/driver/passagers'),
                            _buildMenuItem(context, Icons.account_balance_wallet_outlined, 'Revenus', Colors.tealAccent, route: '/driver/revenus'),
                            _buildMenuItem(context, Icons.storefront_outlined, 'Marketplace', Colors.indigoAccent, route: '/driver/marketplace'),
                            _buildMenuItem(context, Icons.inventory_2_outlined, 'Gestion des Colis', Colors.amberAccent, route: '/driver/colis'),
                            _buildMenuItem(context, Icons.directions_bus_outlined, 'Véhicule', Colors.blueGrey, route: '/driver/vehicule'),
                            _buildMenuItem(context, Icons.notifications_none_outlined, 'Notifications', Colors.redAccent, route: '/driver/notifications'),
                            _buildMenuItem(context, Icons.help_outline, 'Support', Colors.lightBlueAccent, route: '/driver/support'),
                            _buildMenuItem(context, Icons.settings_outlined, 'Paramètres', Colors.grey, route: '/driver/settings'),
                          ] else ...[
                            _buildMenuItem(context, Icons.dashboard_outlined, 'Tableau de bord', Colors.cyanAccent, route: '/'),
                            _buildMenuItem(context, Icons.person_outline, 'Mon Profil', Colors.blueAccent, route: '/profile'),
                            _buildMenuItem(context, Icons.account_balance_wallet_outlined, 'Mon Wallet', Colors.greenAccent, route: '/wallet'),
                            _buildMenuItem(context, Icons.inventory_2_outlined, 'Mes Colis', Colors.purpleAccent, route: '/colis'),
                            _buildMenuItem(context, Icons.qr_code_scanner_outlined, 'QR Code & Billets', Colors.orangeAccent, route: '/qrcode'),
                            _buildMenuItem(context, Icons.workspace_premium_outlined, 'Fidélité', Colors.greenAccent, route: '/fidelite'),
                            _buildMenuItem(context, Icons.history, 'Historique des trajets', Colors.indigoAccent, route: '/history'),
                            _buildMenuItem(context, Icons.settings_outlined, 'Paramètres', Colors.grey, route: '/settings'),
                          ],
                        ],
                      ),
                    ),
                  ),
                  // Space Switcher button and Logout button
                  const Padding(
                    padding: EdgeInsets.symmetric(horizontal: 24),
                    child: Divider(color: Colors.white10),
                  ),
                  const SizedBox(height: 16),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                    child: InkWell(
                      onTap: () {
                        if (onModeChanged != null) {
                          onModeChanged!(!isDriverMode);
                        } else {
                          // Si on est sur une autre page, on retourne à l'accueil pour switcher
                          Navigator.pushNamedAndRemoveUntil(context, '/', (route) => false);
                        }
                        Navigator.pop(context);
                        ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                          content: Text(isDriverMode 
                            ? 'Basculement vers l\'Espace Chauffeur...' 
                            : 'Basculement vers l\'Espace Voyageur...'
                          ),
                          backgroundColor: isDriverMode ? Colors.green : Colors.cyan,
                        ));
                      },
                      borderRadius: BorderRadius.circular(16),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                        decoration: BoxDecoration(
                          color: isDriverMode 
                            ? Colors.cyanAccent.withOpacity(0.1)
                            : Colors.greenAccent.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: isDriverMode 
                              ? Colors.cyanAccent.withOpacity(0.3)
                              : Colors.greenAccent.withOpacity(0.3)
                          ),
                        ),
                        child: Row(
                          children: [
                            Icon(
                              isDriverMode ? Icons.person : Icons.directions_car, 
                              color: isDriverMode ? Colors.cyanAccent : Colors.greenAccent
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Text(
                                isDriverMode ? 'Basculer vers l\'Espace Voyageur' : 'Basculer vers l\'Espace Chauffeur',
                                style: TextStyle(
                                  color: isDriverMode ? Colors.cyanAccent : Colors.greenAccent,
                                  fontSize: 15,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                    child: InkWell(
                      onTap: () {
                        Navigator.pop(context);
                        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Déconnexion en cours...')));
                      },
                      borderRadius: BorderRadius.circular(16),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                        decoration: BoxDecoration(
                          color: Colors.redAccent.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: Colors.redAccent.withOpacity(0.3)),
                        ),
                        child: const Row(
                          children: [
                            Icon(Icons.logout, color: Colors.redAccent),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Text(
                                'Se déconnecter',
                                style: TextStyle(
                                  color: Colors.redAccent,
                                  fontSize: 15,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildMenuItem(BuildContext context, IconData icon, String title, Color color, {bool isLogout = false, String? route}) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      child: ListTile(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        hoverColor: color.withOpacity(0.1),
        leading: Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: color.withOpacity(0.15),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: color.withOpacity(0.3)),
          ),
          child: Icon(icon, color: color, size: 22),
        ),
        title: Text(
          title,
          style: TextStyle(
            color: isLogout ? Colors.redAccent : Colors.white,
            fontWeight: isLogout ? FontWeight.bold : FontWeight.w600,
            fontSize: 15,
          ),
        ),
        trailing: isLogout ? null : const Icon(Icons.chevron_right, color: Colors.white38, size: 20),
        onTap: () {
          if (route != null) {
            Navigator.pop(context); // Close drawer
            
            // Check if we are already on this route to avoid pushing duplicates
            bool isAlreadyOnRoute = false;
            Navigator.popUntil(context, (r) {
              if (r.settings.name == route) {
                isAlreadyOnRoute = true;
              }
              return true;
            });
            
            if (!isAlreadyOnRoute) {
              if (route == '/') {
                Navigator.pushNamedAndRemoveUntil(context, route, (r) => false);
              } else {
                Navigator.pushReplacementNamed(context, route);
              }
            }
          } else {
            if (isLogout) {
              ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Déconnexion en cours...')));
            } else {
              ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('$title bientôt disponible !')));
            }
          }
        },
      ),
    );
  }
}
