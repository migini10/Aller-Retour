import 'package:flutter/material.dart';
import 'dart:async';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import '../../widgets/shared_scaffold.dart';

class AlloPriveScreen extends StatefulWidget {
  const AlloPriveScreen({super.key});

  @override
  State<AlloPriveScreen> createState() => _AlloPriveScreenState();
}

class _AlloPriveScreenState extends State<AlloPriveScreen> {
  String _userName = '';
  String _userPhone = '';
  List<dynamic> priveRequests = [];
  Timer? _refreshTimer;
  bool _isLoading = true;

  // Form controllers
  String origin = 'Dakar';
  String destination = 'Touba';
  final pickupController = TextEditingController();
  final neighborhoodController = TextEditingController();
  final dateController = TextEditingController();
  final priceController = TextEditingController(text: '20000');

  @override
  void initState() {
    super.initState();
    _loadUserData().then((_) {
      _fetchPriveRequests();
    });
    _refreshTimer = Timer.periodic(const Duration(seconds: 5), (_) => _fetchPriveRequests());
  }

  @override
  void dispose() {
    _refreshTimer?.cancel();
    pickupController.dispose();
    neighborhoodController.dispose();
    dateController.dispose();
    priceController.dispose();
    super.dispose();
  }

  Future<void> _loadUserData() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _userName = prefs.getString('userName') ?? 'Utilisateur';
      _userPhone = prefs.getString('userPhone') ?? '';
    });
  }

  Future<void> _fetchPriveRequests() async {
    try {
      final nextApiUrl = dotenv.env['NEXT_API_URL'] ?? 'http://10.0.2.2:3000';
      final response = await http.get(Uri.parse('$nextApiUrl/api/allo-prive'));
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final list = data['requests'] as List<dynamic>? ?? [];
        if (mounted) {
          setState(() {
            priveRequests = list.where((r) => r['clientPhone'] == _userPhone || r['clientPhone'] == '+221776783412').toList();
            _isLoading = false;
          });
        }
      }
    } catch (e) {
      debugPrint('Error fetching private requests: $e');
    }
  }

  Future<void> _submitRequest() async {
    if (pickupController.text.isEmpty || neighborhoodController.text.isEmpty || dateController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Veuillez remplir tous les champs')),
      );
      return;
    }

    setState(() => _isLoading = true);
    try {
      final nextApiUrl = dotenv.env['NEXT_API_URL'] ?? 'http://10.0.2.2:3000';
      final response = await http.post(
        Uri.parse('$nextApiUrl/api/allo-prive'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'clientId': _userPhone,
          'clientName': _userName,
          'clientPhone': _userPhone,
          'origin': '$origin (${pickupController.text})',
          'destination': '$destination (${neighborhoodController.text})',
          'departureDate': dateController.text,
          'price': int.tryParse(priceController.text) ?? 20000,
          'type': 'allo-prive',
        }),
      );

      if (response.statusCode == 200) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Demande Allo Privé créée avec succès !')),
        );
        pickupController.clear();
        neighborhoodController.clear();
        dateController.clear();
        _fetchPriveRequests();
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Échec de la création de la demande.')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erreur: $e')),
      );
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _selectDriver(String requestId, String applicationId) async {
    try {
      final nextApiUrl = dotenv.env['NEXT_API_URL'] ?? 'http://10.0.2.2:3000';
      final response = await http.post(
        Uri.parse('$nextApiUrl/api/allo-prive/$requestId/select'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'applicationId': applicationId}),
      );
      if (response.statusCode == 200) {
        _fetchPriveRequests();
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Chauffeur sélectionné avec succès !')),
        );
      }
    } catch (e) {
      debugPrint('Error selecting driver: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final theme = Theme.of(context);

    return SharedScaffold(
      title: 'Espace Allo Privé',
      subtitle: 'Privatisez une voiture entière et choisissez votre chauffeur.',
      icon: Icons.directions_car,
      iconColor: Colors.amberAccent,
      onRefresh: _fetchPriveRequests,
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 1. Form block
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF1E293B) : Colors.white,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: theme.dividerColor),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Nouvelle Demande', style: TextStyle(color: theme.colorScheme.onSurface, fontWeight: FontWeight.bold, fontSize: 16)),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Expanded(
                          child: DropdownButtonFormField<String>(
                            value: origin,
                            decoration: const InputDecoration(labelText: 'Départ'),
                            items: ['Dakar', 'Touba', 'Thiès', 'Mbour', 'Kaolack', 'Saint-Louis'].map((v) => DropdownMenuItem(value: v, child: Text(v))).toList(),
                            onChanged: (val) => setState(() => origin = val!),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: TextFormField(
                            controller: pickupController,
                            decoration: const InputDecoration(labelText: 'Lieu de prise en charge'),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Expanded(
                          child: DropdownButtonFormField<String>(
                            value: destination,
                            decoration: const InputDecoration(labelText: 'Destination'),
                            items: ['Dakar', 'Touba', 'Thiès', 'Mbour', 'Kaolack', 'Saint-Louis'].map((v) => DropdownMenuItem(value: v, child: Text(v))).toList(),
                            onChanged: (val) => setState(() => destination = val!),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: TextFormField(
                            controller: neighborhoodController,
                            decoration: const InputDecoration(labelText: 'Quartier / Adresse'),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Expanded(
                          child: TextFormField(
                            controller: dateController,
                            decoration: const InputDecoration(labelText: 'Date (AAAA-MM-JJ)', hintText: '2026-06-30'),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: TextFormField(
                            controller: priceController,
                            keyboardType: TextInputType.number,
                            decoration: const InputDecoration(labelText: 'Tarif (FCFA)'),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton.icon(
                        onPressed: _submitRequest,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.amber[700],
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        icon: const Icon(Icons.send, color: Colors.white),
                        label: const Text('Publier l\'appel d\'offres', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),
              Text('Mes Demandes Actives (${priveRequests.length})', style: TextStyle(color: theme.colorScheme.onSurface, fontWeight: FontWeight.bold, fontSize: 18)),
              const SizedBox(height: 12),

              if (priveRequests.isEmpty)
                Center(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(vertical: 40.0),
                    child: Text('Aucune demande de privatisation active.', style: TextStyle(color: theme.colorScheme.onSurfaceVariant)),
                  ),
                )
              else
                ...priveRequests.map((req) {
                  final List<dynamic> apps = req['applications'] as List<dynamic>? ?? [];
                  return Container(
                    margin: const EdgeInsets.only(bottom: 16),
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: isDark ? const Color(0xFF1E293B) : Colors.white,
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(color: Colors.amberAccent.withValues(alpha: 0.2)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(color: Colors.amberAccent.withValues(alpha: 0.15), borderRadius: BorderRadius.circular(6)),
                              child: const Text('VOITURE ENTIÈRE', style: TextStyle(color: Colors.amber, fontSize: 9, fontWeight: FontWeight.bold)),
                            ),
                            Text(req['status'] == 'ACCEPTED' ? 'Chauffeur choisi' : 'Recherche...', style: TextStyle(color: req['status'] == 'ACCEPTED' ? Colors.green : Colors.amber, fontSize: 12, fontWeight: FontWeight.bold)),
                          ],
                        ),
                        const SizedBox(height: 12),
                        Text('${req['origin']} → ${req['destination']}', style: TextStyle(color: theme.colorScheme.onSurface, fontWeight: FontWeight.bold, fontSize: 16)),
                        const SizedBox(height: 6),
                        Text('Date : ${req['departureDate']} • Prix proposé : ${req['price']} FCFA', style: TextStyle(color: theme.colorScheme.onSurfaceVariant, fontSize: 12)),
                        
                        if (req['status'] == 'PENDING') ...[
                          const Divider(height: 24),
                          Text('Offres reçues (${apps.length})', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.amber)),
                          const SizedBox(height: 8),
                          if (apps.isEmpty)
                            const Text('En attente de chauffeurs...', style: TextStyle(fontStyle: FontStyle.italic, fontSize: 11))
                          else
                            ...apps.map((app) {
                              return Container(
                                margin: const EdgeInsets.only(bottom: 8),
                                padding: const EdgeInsets.all(12),
                                decoration: BoxDecoration(
                                  color: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC),
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(color: theme.dividerColor),
                                ),
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Row(
                                            children: [
                                              Text(app['driverName'] as String, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                                              const SizedBox(width: 4),
                                              if (app['driverVerified'] == true)
                                                Container(
                                                  padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 1),
                                                  decoration: BoxDecoration(color: Colors.green.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(4)),
                                                  child: const Text('Certifié', style: TextStyle(color: Colors.green, fontSize: 8, fontWeight: FontWeight.bold)),
                                                ),
                                            ],
                                          ),
                                          const SizedBox(height: 4),
                                          Text('Score: ${app['driverScore']}% • Fiabilité: ${app['driverRating']}★', style: TextStyle(color: theme.colorScheme.onSurfaceVariant, fontSize: 10)),
                                        ],
                                      ),
                                    ),
                                    ElevatedButton(
                                      onPressed: () => _selectDriver(req['id'], app['id']),
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor: Colors.amber,
                                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                                      ),
                                      child: const Text('Choisir', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
                                    ),
                                  ],
                                ),
                              );
                            }),
                        ],
                      ],
                    ),
                  );
                }),
            ],
          ),
        ),
      ),
    );
  }
}
