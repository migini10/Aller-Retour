import 'dart:convert';
import 'dart:async';
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:geolocator/geolocator.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';

class DriverLocalisationScreen extends StatefulWidget {
  const DriverLocalisationScreen({super.key});

  @override
  State<DriverLocalisationScreen> createState() => _DriverLocalisationScreenState();
}

class _DriverLocalisationScreenState extends State<DriverLocalisationScreen> {
  List<dynamic> passagers = [];
  bool isLoading = true;
  Timer? _pollingTimer;

  Map<String, dynamic>? activePassenger;
  bool isNavigating = false;

  @override
  void initState() {
    super.initState();
    _loadPassengers();
    _pollingTimer = Timer.periodic(const Duration(seconds: 5), (_) {
      _loadPassengers();
    });
  }

  @override
  void dispose() {
    _pollingTimer?.cancel();
    super.dispose();
  }

  Future<void> _loadPassengers() async {
    try {
      // 1. Fetch missions
      final missionsResponse = await ApiClient.get('/v1/trips/search') as List<dynamic>?;
      if (missionsResponse != null) {
        final missions = missionsResponse;
        final todayStr = DateTime.now().toIso8601String().split('T')[0];
        final activeMission = missions.firstWhere(
          (m) {
            final String? depTime = m['departureTime'];
            final isToday = depTime != null && depTime.split('T')[0] == todayStr;
            return m['status'] != 'terminé' && isToday;
          },
          orElse: () => null,
        );
        if (activeMission != null) {
          final tripId = activeMission['id'];
          final manifestResponse = await ApiClient.get('/v1/trips/$tripId/manifest');
          if (manifestResponse != null) {
            final manifest = manifestResponse;
            final List<dynamic> tickets = manifest['tickets'] ?? [];
            final neighborhoods = ['Mermoz', 'Plateau', 'Almadies', 'Ouakam', 'Yoff', 'Pikine', 'Fann', 'Hann'];
            final List<Map<String, dynamic>> mapped = [];
            for (int i = 0; i < tickets.length; i++) {
              final t = tickets[i];
              final distance = double.parse((0.5 + i * 0.7).toStringAsFixed(1));
              final etaVal = (distance * 3).ceil();
              mapped.add({
                'id': t['id'],
                'nom': t['nom'],
                'quartier': neighborhoods[i % neighborhoods.length],
                'distance': distance,
                'eta': '$etaVal min',
                'tel': t['tel'] ?? '+221 77 123 45 67',
              });
            }
            mapped.sort((a, b) => a['distance'].compareTo(b['distance']));
            if (mounted) {
              setState(() {
                passagers = mapped;
                isLoading = false;
              });
            }
            return;
          }
        }
      }
      if (mounted) {
        setState(() {
          passagers = [];
          isLoading = false;
        });
      }
    } catch (e) {
      debugPrint('Error loading passengers: $e');
      if (mounted) {
        setState(() {
          passagers = [];
          isLoading = false;
        });
      }
    }
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
          const SnackBar(content: Text("Impossible d'ouvrir Google Maps.")),
        );
      }
    }
  }

  Future<void> _makePhoneCall(String phoneNumber) async {
    final cleanPhone = phoneNumber.replaceAll(RegExp(r'\s+'), '');
    final Uri launchUri = Uri(scheme: 'tel', path: cleanPhone);
    if (await canLaunchUrl(launchUri)) {
      await launchUrl(launchUri);
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Impossible d'appeler ce numéro.")));
      }
    }
  }

  Future<void> _sendSms(String phoneNumber) async {
    final cleanPhone = phoneNumber.replaceAll(RegExp(r'\s+'), '');
    final Uri launchUri = Uri(scheme: 'sms', path: cleanPhone);
    if (await canLaunchUrl(launchUri)) {
      await launchUrl(launchUri);
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Impossible d'envoyer un SMS.")));
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
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Flexible(
              child: Text(
                'Récupération Client', 
                style: TextStyle(fontWeight: FontWeight.bold, color: Theme.of(context).colorScheme.onSurface, fontSize: 18),
                overflow: TextOverflow.ellipsis,
              ),
            ),
            if (isNavigating && activePassenger != null) ...[
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.orangeAccent.withValues(alpha: 0.1),
                  border: Border.all(color: Colors.orangeAccent.withValues(alpha: 0.3)),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Text('EN ROUTE', style: TextStyle(color: Colors.orangeAccent, fontSize: 10, fontWeight: FontWeight.bold)),
              ),
            ]
          ],
        ),
        centerTitle: true,
        iconTheme: IconThemeData(color: Theme.of(context).colorScheme.onSurface),
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.only(
          left: 16,
          right: 16,
          top: 8,
          bottom: MediaQuery.of(context).padding.bottom + 80,
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Status and ETA
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Theme.of(context).cardColor,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: Theme.of(context).dividerColor),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('DESTINATION', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1)),
                        const SizedBox(height: 4),
                        Text(
                          activePassenger != null ? 'Rejoindre ${activePassenger!['nom']}' : 'Point de rendez-vous', 
                          style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 18, fontWeight: FontWeight.bold),
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            const Icon(Icons.location_on, color: Colors.orangeAccent, size: 14),
                            const SizedBox(width: 4),
                            Expanded(
                              child: Text(
                                activePassenger != null ? '${activePassenger!['quartier']}, Dakar' : 'En attente de sélection...', 
                                style: TextStyle(color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.8), fontSize: 13),
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text(activePassenger != null ? activePassenger!['eta'] : '--', style: const TextStyle(color: Colors.orangeAccent, fontSize: 24, fontWeight: FontWeight.bold)),
                      Text(activePassenger != null ? '${activePassenger!['distance']} km' : '--', style: TextStyle(color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.6), fontSize: 13)),
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
                color: Theme.of(context).cardColor,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: Theme.of(context).dividerColor),
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
                        backgroundColor: isNavigating ? Colors.orangeAccent : Colors.white.withValues(alpha: 0.1),
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
            Text('VOYAGEURS À RÉCUPÉRER', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.2)),
            const SizedBox(height: 12),
            if (passagers.isEmpty)
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: Theme.of(context).cardColor,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: Theme.of(context).dividerColor),
                ),
                child: Text(
                  'Ici vont apparaître vos passagers réservés',
                  style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontWeight: FontWeight.bold),
                  textAlign: TextAlign.center,
                ),
              )
            else
              ...passagers.map((p) {
                final isActive = activePassenger != null && activePassenger!['id'] == p['id'];
                return InkWell(
                  onTap: () => _startInternalNavigation(p),
                  borderRadius: BorderRadius.circular(20),
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 16),
                    decoration: BoxDecoration(
                      color: Theme.of(context).cardColor,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: isActive ? Colors.orangeAccent : Theme.of(context).dividerColor),
                      boxShadow: isActive ? [BoxShadow(color: Colors.orangeAccent.withValues(alpha: 0.1), blurRadius: 10)] : null,
                    ),
                  child: Row(
                    children: [
                      Container(
                        width: 48,
                        height: 48,
                        decoration: BoxDecoration(
                          color: isActive ? Colors.orangeAccent : Colors.greenAccent.withValues(alpha: 0.2),
                          shape: BoxShape.circle,
                        ),
                        child: Center(
                          child: Text(
                            p['nom'].toString().substring(0, 1),
                            style: TextStyle(color: isActive ? Colors.white : Colors.greenAccent, fontSize: 20, fontWeight: FontWeight.bold),
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(p['nom'], style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 16, fontWeight: FontWeight.bold)),
                            const SizedBox(height: 4),
                            Row(
                              children: [
                                const Icon(Icons.location_on, color: Colors.orangeAccent, size: 12),
                                const SizedBox(width: 4),
                                Expanded(child: Text('${p['quartier']} • À ${p['distance']} km (${p['eta']})', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 12), overflow: TextOverflow.ellipsis)),
                              ],
                            ),
                            const SizedBox(height: 2),
                            Row(
                              children: [
                                Icon(Icons.phone, color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.38), size: 12),
                                const SizedBox(width: 4),
                                Expanded(
                                  child: Text(
                                    p['tel'], 
                                    style: TextStyle(color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.38), fontSize: 11, fontFamily: 'monospace'),
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 4),
                      Row(
                        children: [
                          Container(
                            width: 40,
                            height: 40,
                            decoration: BoxDecoration(
                              color: Theme.of(context).cardColor,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: Theme.of(context).dividerColor),
                            ),
                            child: IconButton(
                              padding: EdgeInsets.zero,
                              icon: Icon(Icons.message, color: Theme.of(context).colorScheme.onSurface, size: 18),
                              onPressed: () => _sendSms(p['tel']),
                            ),
                          ),
                          const SizedBox(width: 6),
                          Container(
                            width: 40,
                            height: 40,
                            decoration: BoxDecoration(
                              color: Colors.greenAccent,
                              borderRadius: BorderRadius.circular(12),
                              boxShadow: [
                                BoxShadow(color: Colors.greenAccent.withValues(alpha: 0.3), blurRadius: 8, offset: const Offset(0, 4)),
                              ],
                            ),
                            child: IconButton(
                              padding: EdgeInsets.zero,
                              icon: const Icon(Icons.phone, color: Colors.black, size: 18),
                              onPressed: () => _makePhoneCall(p['tel']),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              );
            }),
          ],
        ),
      ),
    );
  }
}
