import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:geolocator/geolocator.dart';

class DriverLocalisationScreen extends StatefulWidget {
  const DriverLocalisationScreen({super.key});

  @override
  State<DriverLocalisationScreen> createState() => _DriverLocalisationScreenState();
}

class _DriverLocalisationScreenState extends State<DriverLocalisationScreen> {
  final List<Map<String, dynamic>> passagers = [
    {'id': 'AR-7489', 'nom': 'Fatou Diop', 'quartier': 'Mermoz', 'distance': 0.5, 'eta': '2 min', 'tel': '+221 77 123 45 67'},
    {'id': 'AR-8451', 'nom': 'Mamadou Ndiaye', 'quartier': 'Plateau', 'distance': 1.2, 'eta': '5 min', 'tel': '+221 78 987 65 43'},
    {'id': 'AR-6201', 'nom': 'Awa Fall', 'quartier': 'Almadies', 'distance': 2.8, 'eta': '10 min', 'tel': '+221 70 456 78 90'},
    {'id': 'AR-1102', 'nom': 'Ousmane Sow', 'quartier': 'Ouakam', 'distance': 4.5, 'eta': '15 min', 'tel': '+221 76 543 21 09'},
  ];

  Map<String, dynamic>? activePassenger;
  bool isNavigating = false;

  @override
  void initState() {
    super.initState();
    // Sort passengers by distance
    passagers.sort((a, b) => a['distance'].compareTo(b['distance']));
  }

  Future<void> _launchExternalNavigation() async {
    if (activePassenger == null) return;
    
    String originParam = '';
    try {
      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
      }
      if (permission == LocationPermission.whileInUse || permission == LocationPermission.always) {
        Position position = await Geolocator.getCurrentPosition(desiredAccuracy: LocationAccuracy.high);
        originParam = '&origin=${position.latitude},${position.longitude}';
      }
    } catch (e) {
      debugPrint("Erreur GPS Flutter: $e");
    }

    final query = Uri.encodeComponent('${activePassenger!['quartier']}, Dakar, Senegal');
    final url = Uri.parse('https://www.google.com/maps/dir/?api=1$originParam&destination=$query&travelmode=driving&dir_action=navigate');
    if (await canLaunchUrl(url)) {
      await launchUrl(url, mode: LaunchMode.externalApplication);
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Impossible d\\'ouvrir Google Maps.')),
        );
      }
    }
  }

  void _startInternalNavigation(Map<String, dynamic> passenger) {
    setState(() {
      activePassenger = passenger;
      isNavigating = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF020617),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text('Récupération Client', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white, fontSize: 18)),
            if (isNavigating && activePassenger != null) ...[
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.orangeAccent.withOpacity(0.1),
                  border: Border.all(color: Colors.orangeAccent.withOpacity(0.3)),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text('EN ROUTE', style: TextStyle(color: Colors.orangeAccent, fontSize: 10, fontWeight: FontWeight.bold)),
              ),
            ]
          ],
        ),
        centerTitle: true,
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Status and ETA
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: const Color(0xFF141414),
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: const Color(0xFF2A2A2A)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('DESTINATION', style: TextStyle(color: Colors.white54, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1)),
                      const SizedBox(height: 4),
                      Text(activePassenger != null ? 'Rejoindre ${activePassenger!['nom']}' : 'Point de rendez-vous', style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          const Icon(Icons.location_on, color: Colors.orangeAccent, size: 14),
                          const SizedBox(width: 4),
                          Text(activePassenger != null ? '${activePassenger!['quartier']}, Dakar' : 'En attente de sélection...', style: TextStyle(color: Colors.white.withOpacity(0.8), fontSize: 13)),
                        ],
                      ),
                    ],
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text(activePassenger != null ? activePassenger!['eta'] : '--', style: const TextStyle(color: Colors.orangeAccent, fontSize: 24, fontWeight: FontWeight.bold)),
                      Text(activePassenger != null ? '${activePassenger!['distance']} km' : '--', style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 13)),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Map Placeholder (Simulating Internal Map)
            Container(
              height: 250,
              decoration: BoxDecoration(
                color: const Color(0xFF0F172A),
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: const Color(0xFF2A2A2A)),
                image: const DecorationImage(
                  image: AssetImage('assets/images/dakar_map_bg.png'), // Placeholder image if exists, or transparent
                  fit: BoxFit.cover,
                  opacity: 0.3,
                ),
              ),
              child: Stack(
                children: [
                  Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(isNavigating ? Icons.navigation : Icons.map_outlined, color: isNavigating ? Colors.orangeAccent : Colors.white24, size: 64),
                        const SizedBox(height: 8),
                        Text(isNavigating ? 'Itinéraire interne actif vers ${activePassenger!['quartier']}' : 'Carte Interactive (Google Maps Embed)', style: TextStyle(color: isNavigating ? Colors.white : Colors.white54, fontWeight: FontWeight.bold)),
                      ],
                    ),
                  ),
                  Positioned(
                    bottom: 16,
                    left: 16,
                    right: 16,
                    child: ElevatedButton.icon(
                      onPressed: isNavigating ? _launchExternalNavigation : null,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: isNavigating ? Colors.orangeAccent : Colors.white.withOpacity(0.1),
                        foregroundColor: isNavigating ? Colors.black : Colors.white54,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        elevation: isNavigating ? 8 : 0,
                      ),
                      icon: const Icon(Icons.navigation),
                      label: Text(isNavigating ? 'Démarrer le trajet (GPS Audio)' : 'Sélectionnez un passager', style: const TextStyle(fontWeight: FontWeight.bold)),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Passengers List
            const Text('VOYAGEURS À RÉCUPÉRER', style: TextStyle(color: Colors.white54, fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.2)),
            const SizedBox(height: 12),
            ...passagers.map((p) {
              final isActive = activePassenger?.cast<String, dynamic>()['id'] == p['id'];
              return InkWell(
                onTap: () => _startInternalNavigation(p),
                borderRadius: BorderRadius.circular(20),
                child: Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: const Color(0xFF141414),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: isActive ? Colors.orangeAccent : const Color(0xFF2A2A2A)),
                    boxShadow: isActive ? [BoxShadow(color: Colors.orangeAccent.withOpacity(0.1), blurRadius: 10)] : null,
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 48,
                        height: 48,
                        decoration: BoxDecoration(
                          color: isActive ? Colors.orangeAccent : Colors.greenAccent.withOpacity(0.2),
                          shape: BoxShape.circle,
                        ),
                        child: Center(
                          child: Text(
                            p['nom'].toString().substring(0, 1),
                            style: TextStyle(color: isActive ? Colors.white : Colors.greenAccent, fontSize: 20, fontWeight: FontWeight.bold),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(p['nom'], style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
                            const SizedBox(height: 4),
                            Row(
                              children: [
                                const Icon(Icons.location_on, color: Colors.orangeAccent, size: 12),
                                const SizedBox(width: 4),
                                Expanded(child: Text('${p['quartier']} • À ${p['distance']} km (${p['eta']})', style: const TextStyle(color: Colors.white54, fontSize: 12), overflow: TextOverflow.ellipsis)),
                              ],
                            ),
                            const SizedBox(height: 2),
                            Row(
                              children: [
                                const Icon(Icons.phone, color: Colors.white38, size: 12),
                                const SizedBox(width: 4),
                                Text(p['tel'], style: const TextStyle(color: Colors.white38, fontSize: 11, fontFamily: 'monospace')),
                              ],
                            ),
                          ],
                        ),
                      ),
                      Row(
                        children: [
                          Container(
                            width: 40,
                            height: 40,
                            decoration: BoxDecoration(
                              color: const Color(0xFF1A1A1A),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: const Color(0xFF2A2A2A)),
                            ),
                            child: IconButton(
                              padding: EdgeInsets.zero,
                              icon: const Icon(Icons.message, color: Colors.white, size: 18),
                              onPressed: () {},
                            ),
                          ),
                          const SizedBox(width: 8),
                          Container(
                            width: 40,
                            height: 40,
                            decoration: BoxDecoration(
                              color: Colors.greenAccent,
                              borderRadius: BorderRadius.circular(12),
                              boxShadow: [
                                BoxShadow(color: Colors.greenAccent.withOpacity(0.3), blurRadius: 8, offset: const Offset(0, 4)),
                              ],
                            ),
                            child: IconButton(
                              padding: EdgeInsets.zero,
                              icon: const Icon(Icons.phone, color: Colors.black, size: 18),
                              onPressed: () {},
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              );
            }).toList(),
          ],
        ),
      ),
    );
  }
}
