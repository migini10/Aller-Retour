import 'dart:io';
import 'dart:ui';
import 'package:flutter/material.dart';
import 'client/client_dashboard_screen.dart';
import 'driver/driver_dashboard_screen.dart';
import '../widgets/app_drawer.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final int _currentIndex = 0;
  bool isDriverMode = false;
  bool isDrawerOpen = false;

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) {
        if (didPop) return;
        
        // Show exit confirmation dialog
        showDialog(
          context: context,
          builder: (context) => AlertDialog(
            backgroundColor: Theme.of(context).cardColor,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
            title: const Text('Quitter', style: TextStyle(fontWeight: FontWeight.bold)),
            content: Text('Voulez-vous vraiment quitter l\'application ?', style: TextStyle(color: Theme.of(context).colorScheme.onSurface)),
            actions: [
              TextButton(
                onPressed: () => Navigator.of(context).pop(),
                child: Text('Annuler', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant)),
              ),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFF97316),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
                onPressed: () {
                  
                  exit(0);
                },
                child: const Text('Quitter', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        );
      },
      child: Scaffold(
        backgroundColor: Theme.of(context).scaffoldBackgroundColor, // Slate 950
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
      drawerScrimColor: Colors.black.withValues(alpha: 0.3), // Added darker scrim
      endDrawer: AppDrawer(
        isDriverMode: isDriverMode,
        onModeChanged: (newMode) {
          setState(() {
            isDriverMode = newMode;
          });
        },
      ),
    ),
    );
  }

  Widget _buildBody() {
    if (_currentIndex == 0) {
      return const ClientDashboardScreen();
    } else if (_currentIndex == 1) {
      return _buildWalletScreen();
    } else if (_currentIndex == 2) {
      return Center(child: Text('Historique des transactions', style: TextStyle(color: Theme.of(context).colorScheme.onSurface)));
    }
    return Center(child: Text('Profil', style: TextStyle(color: Theme.of(context).colorScheme.onSurface)));
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
                    Text('Dakar (Baux Maraîchers)', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Theme.of(context).colorScheme.onSurface)),
                  ],
                ),
                const Divider(color: Color(0xFF334155), height: 24),
                const Text('Arrivée', style: TextStyle(color: Colors.grey, fontSize: 12)),
                const SizedBox(height: 4),
                Row(
                  children: [
                    const Icon(Icons.location_on, color: Color(0xFF38BDF8), size: 18),
                    const SizedBox(width: 8),
                    Text('Touba (Gare Centrale)', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Theme.of(context).colorScheme.onSurface)),
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
          Text('Prochains Départs Réels', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Theme.of(context).colorScheme.onSurface)),
          const SizedBox(height: 12),
          _buildTripCard('Sénégal Express', '08:00', '11:30', '4 500 FCFA', 12),
          _buildTripCard('Salam Transport', '09:30', '13:00', '5 000 FCFA', 4),
        ],
      ),
    );
  }

  Widget _buildTripCard(String company, String dep, String arr, String price, int seats) {
    return Card(
      color: Theme.of(context).cardColor,
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16), side: const BorderSide(color: Color(0xFF1E293B))),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(company, style: TextStyle(fontWeight: FontWeight.bold, color: Theme.of(context).colorScheme.onSurface)),
                Text(price, style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF10B981), fontSize: 16)),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Text(dep, style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Theme.of(context).colorScheme.onSurface)),
                const Expanded(child: Divider(color: Color(0xFF334155), indent: 12, endIndent: 12)),
                const Icon(Icons.directions_bus, color: Colors.grey, size: 16),
                const Expanded(child: Divider(color: Color(0xFF334155), indent: 12, endIndent: 12)),
                Text(arr, style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Theme.of(context).colorScheme.onSurface)),
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
          Text('Scan Guichetier / Contrôleur', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Theme.of(context).colorScheme.onSurface)),
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
