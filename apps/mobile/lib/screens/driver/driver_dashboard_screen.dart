import 'dart:ui';
import 'package:flutter/material.dart';

class DriverDashboardScreen extends StatefulWidget {
  const DriverDashboardScreen({super.key});

  @override
  State<DriverDashboardScreen> createState() => _DriverDashboardScreenState();
}

class _DriverDashboardScreenState extends State<DriverDashboardScreen> with SingleTickerProviderStateMixin {
  final ScrollController _scrollController = ScrollController();

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF020617), // slate-950
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 550),
          child: SingleChildScrollView(
            controller: _scrollController,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Custom App Bar Area
                Container(
                  margin: const EdgeInsets.only(top: 60, left: 24, right: 24),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Espace Chauffeur',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 28,
                              fontWeight: FontWeight.w900,
                              letterSpacing: -0.5,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: Colors.orangeAccent.withOpacity(0.2),
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: Colors.orangeAccent.withOpacity(0.5)),
                            ),
                            child: const Text(
                              'Statut : EN LIGNE',
                              style: TextStyle(color: Colors.orangeAccent, fontSize: 12, fontWeight: FontWeight.bold),
                            ),
                          ),
                        ],
                      ),
                      InkWell(
                        onTap: () {
                          Scaffold.of(context).openEndDrawer();
                        },
                        borderRadius: BorderRadius.circular(16),
                        child: Container(
                          width: 48,
                          height: 48,
                          decoration: BoxDecoration(
                            color: const Color(0xFF0F172A),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: Colors.white.withOpacity(0.1)),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.2),
                                blurRadius: 10,
                                offset: const Offset(0, 4),
                              ),
                            ],
                          ),
                          child: const Icon(Icons.menu_rounded, color: Colors.white, size: 24),
                        ),
                      ),
                    ],
                  ),
                ),
                
                const SizedBox(height: 32),

                // Welcome Hero Banner
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: Container(
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF0F172A), Colors.black],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(24),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.4),
                          blurRadius: 20,
                          offset: const Offset(0, 8),
                        ),
                      ],
                    ),
                    child: Stack(
                      children: [
                        Positioned(
                          top: -50,
                          right: -50,
                          child: Container(
                            width: 150,
                            height: 150,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: Colors.orangeAccent.withOpacity(0.1),
                              boxShadow: [BoxShadow(color: Colors.orangeAccent.withOpacity(0.2), blurRadius: 50)],
                            ),
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.all(24),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                    decoration: BoxDecoration(
                                      color: Colors.greenAccent.withOpacity(0.2),
                                      borderRadius: BorderRadius.circular(16),
                                      border: Border.all(color: Colors.greenAccent.withOpacity(0.3)),
                                    ),
                                    child: const Row(
                                      children: [
                                        Icon(Icons.check_circle, color: Colors.greenAccent, size: 14),
                                        SizedBox(width: 4),
                                        Text('Véhicule Inspecté', style: TextStyle(color: Colors.greenAccent, fontSize: 10, fontWeight: FontWeight.bold)),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 16),
                              const Text('Bonjour Moussa 👋', style: TextStyle(color: Colors.white, fontSize: 28, fontWeight: FontWeight.w900, letterSpacing: -0.5)),
                              const SizedBox(height: 8),
                              const Text(
                                'Vous avez 1 trajet programmé aujourd\'hui. Assurez-vous d\'avoir validé tous vos documents avant de démarrer.',
                                style: TextStyle(color: Colors.white70, fontSize: 14, height: 1.4),
                              ),
                              const SizedBox(height: 24),
                              Row(
                                children: [
                                  Expanded(
                                    child: ElevatedButton.icon(
                                      onPressed: () {
                                        Navigator.pushNamed(context, '/driver/missions');
                                      },
                                      icon: const Icon(Icons.route, size: 18),
                                      label: const Text('Créer un voyage', style: TextStyle(fontWeight: FontWeight.bold)),
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor: Colors.orangeAccent,
                                        foregroundColor: Colors.black,
                                        padding: const EdgeInsets.symmetric(vertical: 14),
                                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                        elevation: 8,
                                        shadowColor: Colors.orangeAccent.withOpacity(0.4),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 24),

                // Prochain Trajet Widget
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: Container(
                    decoration: BoxDecoration(
                      color: const Color(0xFF141414),
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(color: const Color(0xFF2A2A2A)),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(24),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              const Icon(Icons.location_on, color: Colors.orangeAccent, size: 16),
                              const SizedBox(width: 8),
                              const Text('PROCHAIN DÉPART', style: TextStyle(color: Colors.white54, fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.2)),
                              const Spacer(),
                              Icon(Icons.directions_bus, color: Colors.white.withOpacity(0.05), size: 40),
                            ],
                          ),
                          const SizedBox(height: 16),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      const Text('Dakar', style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.w900)),
                                      const SizedBox(width: 8),
                                      const Icon(Icons.arrow_outward, color: Colors.orangeAccent, size: 20),
                                      const SizedBox(width: 8),
                                      const Text('Touba', style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.w900)),
                                    ],
                                  ),
                                  const SizedBox(height: 4),
                                  const Text('Départ prévu à 14:30 • Arrivée estimée à 17:45', style: TextStyle(color: Colors.white54, fontSize: 13)),
                                ],
                              ),
                            ],
                          ),
                          const SizedBox(height: 24),
                          Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                                decoration: BoxDecoration(
                                  color: Colors.orangeAccent.withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(color: Colors.orangeAccent.withOpacity(0.2)),
                                ),
                                child: Column(
                                  children: [
                                    const Text('PASSAGERS', style: TextStyle(color: Colors.orangeAccent, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1)),
                                    RichText(
                                      text: const TextSpan(
                                        children: [
                                          TextSpan(text: '45', style: TextStyle(color: Colors.orangeAccent, fontSize: 24, fontWeight: FontWeight.w900)),
                                          TextSpan(text: '/50', style: TextStyle(color: Colors.orangeAccent, fontSize: 14, fontWeight: FontWeight.bold)),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    ClipRRect(
                                      borderRadius: BorderRadius.circular(8),
                                      child: LinearProgressIndicator(
                                        value: 0.9,
                                        minHeight: 10,
                                        backgroundColor: Colors.white10,
                                        valueColor: const AlwaysStoppedAnimation<Color>(Colors.orangeAccent),
                                      ),
                                    ),
                                    const SizedBox(height: 8),
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        const Text('Remplissage: 90%', style: TextStyle(color: Colors.white54, fontSize: 12)),
                                        Row(
                                          children: [
                                            const Icon(Icons.check_circle, color: Colors.greenAccent, size: 12),
                                            const SizedBox(width: 4),
                                            const Text('Prêt au départ', style: TextStyle(color: Colors.greenAccent, fontSize: 12, fontWeight: FontWeight.bold)),
                                          ],
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 24),
                          const Divider(color: Colors.white10, height: 1),
                          const SizedBox(height: 16),
                          Row(
                            children: [
                              Expanded(
                                child: ElevatedButton(
                                  onPressed: () {
                                    Navigator.pushNamed(context, '/driver/missions');
                                  },
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.white,
                                    foregroundColor: Colors.black,
                                    padding: const EdgeInsets.symmetric(vertical: 14),
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                  ),
                                  child: const Text('Gérer le manifeste', style: TextStyle(fontWeight: FontWeight.bold)),
                                ),
                              ),
                              const SizedBox(width: 12),
                              ElevatedButton(
                                onPressed: () {
                                  Navigator.pushNamed(context, '/driver/missions');
                                },
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: const Color(0xFF1A1A1A),
                                  foregroundColor: Colors.white,
                                  padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 16),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                ),
                                child: const Icon(Icons.navigation, size: 20),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                ),

                const SizedBox(height: 24),

                // Mon Activité
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: Container(
                    decoration: BoxDecoration(
                      color: const Color(0xFF141414),
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(color: const Color(0xFF2A2A2A)),
                    ),
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            const Icon(Icons.trending_up, color: Colors.greenAccent, size: 16),
                            const SizedBox(width: 8),
                            const Text('MON ACTIVITÉ', style: TextStyle(color: Colors.white54, fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.2)),
                          ],
                        ),
                        const SizedBox(height: 20),
                        Container(
                          padding: const EdgeInsets.all(20),
                          decoration: BoxDecoration(
                            color: Colors.greenAccent.withOpacity(0.05),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: Colors.greenAccent.withOpacity(0.1)),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text('Revenus du jour', style: TextStyle(color: Colors.greenAccent, fontSize: 14, fontWeight: FontWeight.bold)),
                                  const SizedBox(height: 4),
                                  RichText(
                                    text: const TextSpan(
                                      children: [
                                        TextSpan(text: '45 000 ', style: TextStyle(color: Colors.white, fontSize: 28, fontWeight: FontWeight.w900)),
                                        TextSpan(text: 'CFA', style: TextStyle(color: Colors.white54, fontSize: 16, fontWeight: FontWeight.bold)),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                              const Icon(Icons.account_balance_wallet, color: Colors.greenAccent, size: 32),
                            ],
                          ),
                        ),
                        const SizedBox(height: 16),
                        Row(
                          children: [
                            Expanded(
                              child: Container(
                                padding: const EdgeInsets.all(16),
                                decoration: BoxDecoration(
                                  color: const Color(0xFF1A1A1A),
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(color: const Color(0xFF2A2A2A)),
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    const Text('TRAJETS', style: TextStyle(color: Colors.white54, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1)),
                                    const SizedBox(height: 4),
                                    RichText(
                                      text: const TextSpan(
                                        children: [
                                          TextSpan(text: '1', style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.w900)),
                                          TextSpan(text: '/2', style: TextStyle(color: Colors.white54, fontSize: 14, fontWeight: FontWeight.bold)),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Container(
                                padding: const EdgeInsets.all(16),
                                decoration: BoxDecoration(
                                  color: const Color(0xFF1A1A1A),
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(color: const Color(0xFF2A2A2A)),
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    const Text('DISTANCE', style: TextStyle(color: Colors.white54, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1)),
                                    const SizedBox(height: 4),
                                    RichText(
                                      text: const TextSpan(
                                        children: [
                                          TextSpan(text: '120', style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.w900)),
                                          TextSpan(text: 'km', style: TextStyle(color: Colors.white54, fontSize: 14, fontWeight: FontWeight.bold)),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 40),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
