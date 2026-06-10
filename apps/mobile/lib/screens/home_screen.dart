import 'dart:ui';
import 'package:flutter/material.dart';
import 'client/client_dashboard_screen.dart';
import 'client/profile_screen.dart';
import 'client/history_screen.dart';
import 'client/settings_screen.dart';
import 'client/fidelite_screen.dart';
import 'driver/driver_dashboard_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;
  bool isDriverMode = false;
  bool isDrawerOpen = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF020617), // Slate 950
      body: Stack(
        children: [
          isDriverMode ? const DriverDashboardScreen() : const ClientDashboardScreen(),
          if (isDrawerOpen)
            Positioned.fill(
              child: BackdropFilter(
                filter: ImageFilter.blur(sigmaX: 5.0, sigmaY: 5.0),
                child: Container(color: Colors.transparent),
              ),
            ),
        ],
      ),
      onEndDrawerChanged: (isOpen) {
        setState(() {
          isDrawerOpen = isOpen;
        });
      },
      drawerScrimColor: Colors.black.withOpacity(0.3), // Added darker scrim
      endDrawer: Drawer(
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
                    setState(() {
                      isDriverMode = !isDriverMode;
                    });
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
                        SizedBox(width: 16),
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
              Navigator.pushNamed(context, route);
            } else {if (isLogout) {
            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Déconnexion en cours...')));
          } else {
            ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('$title bientôt disponible !')));
          }
        }},
      ),
    );
  }
  Widget _buildBody() {
    if (_currentIndex == 0) {
      return const ClientDashboardScreen();
    } else if (_currentIndex == 1) {
      return _buildWalletScreen();
    } else if (_currentIndex == 2) {
      return const Center(child: Text('Historique des transactions', style: TextStyle(color: Colors.white)));
    }
    return const Center(child: Text('Profil', style: TextStyle(color: Colors.white)));
  }

  Widget _buildSearchScreen() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF1E293B),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFF334155)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Départ', style: TextStyle(color: Colors.grey, fontSize: 12)),
                const SizedBox(height: 4),
                Row(
                  children: [
                    const Icon(Icons.location_on, color: Color(0xFF10B981), size: 18),
                    const SizedBox(width: 8),
                    const Text('Dakar (Baux Maraîchers)', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
                  ],
                ),
                const Divider(color: Color(0xFF334155), height: 24),
                const Text('Arrivée', style: TextStyle(color: Colors.grey, fontSize: 12)),
                const SizedBox(height: 4),
                Row(
                  children: [
                    const Icon(Icons.location_on, color: Color(0xFF38BDF8), size: 18),
                    const SizedBox(width: 8),
                    const Text('Touba (Gare Centrale)', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
                  ],
                ),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF10B981),
                      foregroundColor: Colors.black,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    icon: const Icon(Icons.directions_bus),
                    label: const Text('Trouver un trajet', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                    onPressed: () {},
                  ),
                )
              ],
            ),
          ),
          const SizedBox(height: 24),
          const Text('Prochains Départs Réels', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
          const SizedBox(height: 12),
          _buildTripCard('Sénégal Express', '08:00', '11:30', '4 500 FCFA', 12),
          _buildTripCard('Salam Transport', '09:30', '13:00', '5 000 FCFA', 4),
        ],
      ),
    );
  }

  Widget _buildTripCard(String company, String dep, String arr, String price, int seats) {
    return Card(
      color: const Color(0xFF0F172A),
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16), side: const BorderSide(color: Color(0xFF1E293B))),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(company, style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
                Text(price, style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF10B981), fontSize: 16)),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Text(dep, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white)),
                const Expanded(child: Divider(color: Color(0xFF334155), indent: 12, endIndent: 12)),
                const Icon(Icons.directions_bus, color: Colors.grey, size: 16),
                const Expanded(child: Divider(color: Color(0xFF334155), indent: 12, endIndent: 12)),
                Text(arr, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white)),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(color: const Color(0xFF1E293B), borderRadius: BorderRadius.circular(6)),
                  child: Text('$seats places restantes', style: const TextStyle(color: Colors.amber, fontSize: 12, fontWeight: FontWeight.bold)),
                ),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF38BDF8), foregroundColor: Colors.black),
                  onPressed: () {},
                  child: const Text('Réserver par Wave', style: TextStyle(fontWeight: FontWeight.bold)),
                )
              ],
            )
          ],
        ),
      ),
    );
  }

  Widget _buildScanScreen() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.qr_code_scanner, size: 80, color: Color(0xFF10B981)),
          const SizedBox(height: 16),
          const Text('Scan Guichetier / Contrôleur', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white)),
          const SizedBox(height: 8),
          const Text('Vérification instantanée des billets QR', style: TextStyle(color: Colors.grey)),
          const SizedBox(height: 32),
          ElevatedButton.icon(
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF10B981), foregroundColor: Colors.black, padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14)),
            icon: const Icon(Icons.camera_alt),
            label: const Text('Activer la caméra de scan', style: TextStyle(fontWeight: FontWeight.bold)),
            onPressed: () {},
          )
        ],
      ),
    );
  }

  Widget _buildWalletScreen() {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              gradient: const LinearGradient(colors: [Color(0xFF10B981), Color(0xFF059669)]),
              borderRadius: BorderRadius.circular(24),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Solde Disponible', style: TextStyle(color: Colors.black54, fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                const Text('148 500 FCFA', style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold, color: Colors.black)),
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(backgroundColor: Colors.black, foregroundColor: Colors.white),
                      icon: const Icon(Icons.arrow_downward, size: 16),
                      label: const Text('Dépôt Wave/OM'),
                      onPressed: () {},
                    ),
                    ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(backgroundColor: Colors.white, foregroundColor: Colors.black),
                      icon: const Icon(Icons.arrow_upward, size: 16),
                      label: const Text('Retrait Instantané'),
                      onPressed: () {},
                    ),
                  ],
                )
              ],
            ),
          )
        ],
      ),
    );
  }
}
