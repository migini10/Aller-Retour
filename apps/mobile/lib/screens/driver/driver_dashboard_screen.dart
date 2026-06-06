import 'dart:ui';
import 'package:flutter/material.dart';
import 'driver_colis_screen.dart';

class DriverDashboardScreen extends StatefulWidget {
  const DriverDashboardScreen({super.key});

  @override
  State<DriverDashboardScreen> createState() => _DriverDashboardScreenState();
}

class _DriverDashboardScreenState extends State<DriverDashboardScreen> with SingleTickerProviderStateMixin {
  AnimationController? _pulseController;
  Animation<double>? _pulseAnimation;
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    )..repeat(reverse: true);
    _pulseAnimation = Tween<double>(begin: 0.2, end: 0.6).animate(_pulseController!);
  }

  @override
  void dispose() {
    _scrollController.dispose();
    _pulseController?.dispose();
    super.dispose();
  }

  final List<Map<String, dynamic>> services = [
    {
      'title': 'Missions',
      'description': 'Trajets et affectations',
      'icon': Icons.route,
      'color': Colors.blueAccent,
      'route': '/driver/missions',
    },
    {
      'title': 'Gestion des Colis',
      'description': 'Accepter et livrer des colis',
      'icon': Icons.inventory_2,
      'color': Colors.orangeAccent,
      'route': '/driver/colis',
    },
    {
      'title': 'Scanner',
      'description': 'Vérifier les billets',
      'icon': Icons.qr_code_scanner,
      'color': Colors.cyanAccent,
      'route': '/driver/scanner',
    },
    {
      'title': 'Véhicule',
      'description': 'État et contrôles',
      'icon': Icons.directions_bus,
      'color': Colors.purpleAccent,
      'route': '/driver/vehicule',
    },
  ];

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
                AnimatedBuilder(
                  animation: _scrollController,
                  builder: (context, child) {
                    double offset = _scrollController.hasClients ? _scrollController.offset : 0;
                    double opacity = (1 - (offset / 35)).clamp(0.0, 1.0);
                    double translateX = -(offset * 3).clamp(0.0, 200.0);
                    
                    if (opacity == 0.0) return const SizedBox.shrink();
                    
                    return Transform.translate(
                      offset: Offset(translateX, 0),
                      child: Opacity(
                        opacity: opacity,
                        child: child,
                      ),
                    );
                  },
                  child: Container(
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
                                'Statut : DISPONIBLE',
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
                ),
                
                const SizedBox(height: 32),

                // Prochain Trajet Widget
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [Colors.orange.shade800, Colors.orange.shade600],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(24),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.orange.withOpacity(0.3),
                          blurRadius: 20,
                          offset: const Offset(0, 8),
                        ),
                      ],
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(24),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                decoration: BoxDecoration(
                                  color: Colors.white.withOpacity(0.2),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: const Row(
                                  children: [
                                    Icon(Icons.directions_bus, color: Colors.white, size: 14),
                                    SizedBox(width: 4),
                                    Text('Prochain Trajet', style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold)),
                                  ],
                                ),
                              ),
                              const Text('14:30', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w900)),
                            ],
                          ),
                          const SizedBox(height: 20),
                          const Text('Dakar → Touba', style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.w900, letterSpacing: -0.5)),
                          const SizedBox(height: 8),
                          Row(
                            children: [
                              const Icon(Icons.group, color: Colors.white70, size: 16),
                              const SizedBox(width: 6),
                              const Text('45 Passagers inscrits', style: TextStyle(color: Colors.white70, fontSize: 14, fontWeight: FontWeight.w500)),
                            ],
                          ),
                          const SizedBox(height: 24),
                          SizedBox(
                            width: double.infinity,
                            child: ElevatedButton(
                              onPressed: () {},
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.white,
                                foregroundColor: Colors.orange.shade800,
                                padding: const EdgeInsets.symmetric(vertical: 16),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                                elevation: 0,
                              ),
                              child: const Text('Démarrer la course', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),

                const SizedBox(height: 40),
                
                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 24),
                  child: Text(
                    'Outils & Services',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                
                const SizedBox(height: 16),
                
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: GridView.builder(
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
                      return GestureDetector(
                        onTap: () {
                          if (service['route'] == '/driver/colis') {
                            Navigator.push(
                              context,
                              MaterialPageRoute(builder: (context) => const DriverColisScreen()),
                            );
                          }
                        },
                        child: Container(
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(
                              colors: [Color(0xFF1E293B), Color(0xFF0F172A)],
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                            ),
                            borderRadius: BorderRadius.circular(24),
                            border: Border.all(color: service['color'].withOpacity(0.3), width: 1.5),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.4),
                                blurRadius: 15,
                                offset: const Offset(0, 8),
                              ),
                            ],
                          ),
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(24),
                            child: Stack(
                              children: [
                                // Faint background icon
                                Positioned(
                                  bottom: -15,
                                  right: -15,
                                  child: Transform.rotate(
                                    angle: -0.2,
                                    child: Icon(
                                      service['icon'],
                                      size: 100,
                                      color: Colors.white.withOpacity(0.04),
                                    ),
                                  ),
                                ),
                                // Foreground Content
                                Padding(
                                  padding: const EdgeInsets.all(20),
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
                                          fontWeight: FontWeight.w900,
                                          letterSpacing: -0.5,
                                        ),
                                      ),
                                      const SizedBox(height: 6),
                                      Text(
                                        service['description'],
                                        style: TextStyle(
                                          color: Colors.white.withOpacity(0.6),
                                          fontSize: 12,
                                          height: 1.3,
                                        ),
                                        maxLines: 2,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                      const SizedBox(height: 16),
                                      Row(
                                        children: [
                                          Text(
                                            'Ouvrir',
                                            style: TextStyle(
                                              color: service['color'],
                                              fontSize: 13,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                          const SizedBox(width: 6),
                                          Icon(Icons.arrow_forward_rounded, size: 16, color: service['color']),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      );
                    },
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
