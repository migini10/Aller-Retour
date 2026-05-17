import 'package:flutter/material.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF020617), // Slate 950
      appBar: AppBar(
        backgroundColor: const Color(0xFF0F172A), // Slate 900
        title: Row(
          children: [
            const Icon(Icons.directions_bus, color: Color(0xFF10B981)),
            const SizedBox(width: 8),
            const Text('Aller-Retour', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.wifi_off, color: Colors.amber),
            tooltip: 'Mode Offline Actif',
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Mode Offline: 50 passagers en cache local')),
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.account_balance_wallet, color: Color(0xFF38BDF8)),
            onPressed: () {},
          )
        ],
      ),
      body: _buildBody(),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (idx) => setState(() => _currentIndex = idx),
        backgroundColor: const Color(0xFF0F172A),
        indicatorColor: const Color(0xFF10B981).withOpacity(0.2),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.search), label: 'Rechercher'),
          NavigationDestination(icon: Icon(Icons.qr_code_scanner), label: 'Scan Gare'),
          NavigationDestination(icon: Icon(Icons.wallet), label: 'Wallet'),
          NavigationDestination(icon: Icon(Icons.person), label: 'Compte'),
        ],
      ),
    );
  }

  Widget _buildBody() {
    if (_currentIndex == 1) {
      return _buildScanScreen();
    } else if (_currentIndex == 2) {
      return _buildWalletScreen();
    }
    return _buildSearchScreen();
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
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16), side: Border.all(color: const Color(0xFF1E293B))),
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
