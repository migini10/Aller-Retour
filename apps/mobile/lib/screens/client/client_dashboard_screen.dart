import 'package:flutter/material.dart';
import 'package:cupertino_icons/cupertino_icons.dart';

class ClientDashboardScreen extends StatefulWidget {
  const ClientDashboardScreen({super.key});

  @override
  State<ClientDashboardScreen> createState() => _ClientDashboardScreenState();
}

class _ClientDashboardScreenState extends State<ClientDashboardScreen> {
  final List<Map<String, dynamic>> services = [
    {
      'title': 'Colis',
      'description': 'Gérez vos franchises et suivez l\'expédition.',
      'icon': Icons.inventory_2_outlined,
      'color': Colors.purple,
    },
    {
      'title': 'Wallet',
      'description': 'Rechargez via Wave, OM et gérez vos paiements.',
      'icon': Icons.account_balance_wallet_outlined,
      'color': Colors.cyan,
    },
    {
      'title': 'Fidélité',
      'description': 'Cumulez des kilomètres et gagnez des billets.',
      'icon': Icons.workspace_premium_outlined,
      'color': Colors.orange,
    },
    {
      'title': 'QR Code',
      'description': 'Montrez votre QR Code lors de l\'embarquement.',
      'icon': Icons.qr_code_scanner,
      'color': Colors.blue,
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF000000), // Dark mode background
      body: CustomScrollView(
        slivers: [
          _buildHeroSection(),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildWalletCard(),
                  const SizedBox(height: 20),
                  _buildActionButtons(),
                  const SizedBox(height: 30),
                  _buildServicesSection(),
                  const SizedBox(height: 40),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeroSection() {
    return SliverAppBar(
      expandedHeight: 250.0,
      floating: false,
      pinned: true,
      backgroundColor: Colors.black,
      flexibleSpace: FlexibleSpaceBar(
        titlePadding: const EdgeInsets.only(left: 20, bottom: 16),
        title: const Text(
          'Espace Voyageur',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.w900,
            fontSize: 22,
          ),
        ),
        background: Stack(
          fit: StackFit.expand,
          children: [
            // Hero Image
            Image.asset(
              'assets/images/peugeot_406_hero.png',
              fit: BoxFit.cover,
            ),
            // Gradient Overlay
            Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Colors.black54,
                    Colors.black87,
                    Colors.black,
                  ],
                ),
              ),
            ),
            // Subtitle text (optional on mobile hero)
            Positioned(
              left: 20,
              right: 20,
              bottom: 60,
              child: Text(
                'Bienvenue sur votre tableau de bord. Gérez vos réservations et votre solde.',
                style: TextStyle(
                  color: Colors.white.withOpacity(0.8),
                  fontSize: 14,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildWalletCard() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xFF141414),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.cyan.withOpacity(0.3), width: 1.5),
        boxShadow: [
          BoxShadow(
            color: Colors.cyan.withOpacity(0.15),
            blurRadius: 20,
            spreadRadius: 2,
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.cyan.withOpacity(0.1),
              borderRadius: BorderRadius.circular(15),
              border: Border.all(color: Colors.cyan.withOpacity(0.3)),
            ),
            child: const Icon(
              Icons.account_balance_wallet,
              color: Colors.cyanAccent,
              size: 28,
            ),
          ),
          const SizedBox(width: 20),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Solde Wallet (XOF)',
                  style: TextStyle(
                    color: Colors.grey[400],
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 4),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    const Text(
                      '45 000',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 28,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                    const SizedBox(width: 4),
                    Text(
                      'FCFA',
                      style: TextStyle(
                        color: Colors.cyanAccent,
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                GestureDetector(
                  onTap: () {
                    // Navigate to wallet
                  },
                  child: Row(
                    children: [
                      Text(
                        'Voir mon compte',
                        style: TextStyle(
                          color: Colors.cyanAccent,
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(width: 4),
                      const Icon(Icons.arrow_forward_ios, size: 10, color: Colors.cyanAccent),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionButtons() {
    return Column(
      children: [
        SizedBox(
          width: double.infinity,
          child: ElevatedButton.icon(
            onPressed: () {},
            icon: const Icon(Icons.flash_on, color: Colors.white),
            label: const Text('Recharger via Wave ou OM'),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.orange[800],
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 16),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
              textStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              elevation: 8,
              shadowColor: Colors.orange.withOpacity(0.5),
            ),
          ),
        ),
        const SizedBox(height: 12),
        SizedBox(
          width: double.infinity,
          child: ElevatedButton.icon(
            onPressed: () {},
            icon: const Icon(Icons.directions_car, color: Colors.black),
            label: const Text('Réserver une voiture'),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.white,
              foregroundColor: Colors.black,
              padding: const EdgeInsets.symmetric(vertical: 16),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
              textStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              elevation: 4,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildServicesSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Container(
              width: 4,
              height: 20,
              decoration: BoxDecoration(
                color: Colors.orange,
                borderRadius: BorderRadius.circular(4),
              ),
            ),
            const SizedBox(width: 8),
            const Text(
              'Vos Services',
              style: TextStyle(
                color: Colors.white,
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        GridView.builder(
          physics: const NeverScrollableScrollPhysics(),
          shrinkWrap: true,
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            crossAxisSpacing: 16,
            mainAxisSpacing: 16,
            childAspectRatio: 0.85,
          ),
          itemCount: services.length,
          itemBuilder: (context, index) {
            final service = services[index];
            return Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF141414),
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: const Color(0xFF2A2A2A)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: service['color'].withOpacity(0.1),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: service['color'].withOpacity(0.3)),
                    ),
                    child: Icon(
                      service['icon'],
                      color: service['color'],
                      size: 28,
                    ),
                  ),
                  const Spacer(),
                  Text(
                    service['title'],
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    service['description'],
                    style: TextStyle(
                      color: Colors.grey[500],
                      fontSize: 12,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Text(
                        'Ouvrir',
                        style: TextStyle(
                          color: Colors.grey[400],
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(width: 4),
                      Icon(Icons.arrow_forward, size: 14, color: Colors.grey[400]),
                    ],
                  ),
                ],
              ),
            );
          },
        ),
      ],
    );
  }
}
