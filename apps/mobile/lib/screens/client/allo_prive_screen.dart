import 'package:flutter/material.dart';
import 'dart:async';
import '../../services/api_client.dart';
import '../../widgets/shared_scaffold.dart';

class AlloPriveScreen extends StatefulWidget {
  const AlloPriveScreen({super.key});

  @override
  State<AlloPriveScreen> createState() => _AlloPriveScreenState();
}

class _AlloPriveScreenState extends State<AlloPriveScreen> {
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
    _fetchPriveRequests();
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

  Future<void> _fetchPriveRequests() async {
    try {
      final response = await ApiClient.get('/v1/allo-prive/requests/my-requests');
      if (mounted) {
        setState(() {
          priveRequests = response as List<dynamic>? ?? [];
          _isLoading = false;
        });
      }
    } catch (e) {
      debugPrint('Error fetching private requests: $e');
      if (mounted) {
        setState(() => _isLoading = false);
      }
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
      await ApiClient.post('/v1/allo-prive/requests', body: {
        'origin': '$origin (${pickupController.text})',
        'destination': '$destination (${neighborhoodController.text})',
        'departureDate': dateController.text,
        'price': int.tryParse(priceController.text) ?? 20000,
        'type': 'allo-prive',
      });

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Demande Allo Privé créée avec succès !')),
        );
        pickupController.clear();
        neighborhoodController.clear();
        dateController.clear();
        _fetchPriveRequests();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Erreur: $e')),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  Future<void> _selectDriver(String applicationId) async {
    try {
      await ApiClient.patch('/v1/allo-prive/applications/$applicationId/accept', body: {});
      if (mounted) {
        _fetchPriveRequests();
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Chauffeur sélectionné avec succès !')),
        );
      }
    } catch (e) {
      debugPrint('Error selecting driver: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Erreur: $e')),
        );
      }
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
                        onPressed: _isLoading ? null : _submitRequest,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.amber[700],
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        icon: _isLoading 
                            ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                            : const Icon(Icons.send, color: Colors.white),
                        label: const Text('Publier l\'appel d\'offres', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),
              Text('Mes Demandes Actives (${priveRequests.length})', style: TextStyle(color: theme.colorScheme.onSurface, fontWeight: FontWeight.bold, fontSize: 18)),
              const SizedBox(height: 12),

              if (_isLoading && priveRequests.isEmpty)
                const Center(child: CircularProgressIndicator())
              else if (priveRequests.isEmpty)
                Center(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(vertical: 40.0),
                    child: Text('Aucune demande de privatisation active.', style: TextStyle(color: theme.colorScheme.onSurfaceVariant)),
                  ),
                )
              else
                ...priveRequests.map((req) {
                  final reqMap = req as Map<String, dynamic>;
                  final List<dynamic> apps = reqMap['applications'] as List<dynamic>? ?? [];
                  return Container(
                    margin: const EdgeInsets.only(bottom: 16),
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: isDark ? const Color(0xFF1E293B) : Colors.white,
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(color: Colors.amberAccent.withOpacity(0.2)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(color: Colors.amberAccent.withOpacity(0.15), borderRadius: BorderRadius.circular(6)),
                              child: const Text('VOITURE ENTIÈRE', style: TextStyle(color: Colors.amber, fontSize: 9, fontWeight: FontWeight.bold)),
                            ),
                            Text(reqMap['status'] == 'ACCEPTED' ? 'Chauffeur choisi' : 'Recherche...', style: TextStyle(color: reqMap['status'] == 'ACCEPTED' ? Colors.green : Colors.amber, fontSize: 12, fontWeight: FontWeight.bold)),
                          ],
                        ),
                        const SizedBox(height: 12),
                        Text('${reqMap['origin']} → ${reqMap['destination']}', style: TextStyle(color: theme.colorScheme.onSurface, fontWeight: FontWeight.bold, fontSize: 16)),
                        const SizedBox(height: 6),
                        Text('Date : ${reqMap['departureDate']} • Prix proposé : ${reqMap['price']} FCFA', style: TextStyle(color: theme.colorScheme.onSurfaceVariant, fontSize: 12)),
                        
                        if (reqMap['status'] == 'PENDING') ...[
                          const Divider(height: 24),
                          Text('Offres reçues (${apps.length})', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.amber)),
                          const SizedBox(height: 8),
                          if (apps.isEmpty)
                            const Text('En attente de chauffeurs...', style: TextStyle(fontStyle: FontStyle.italic, fontSize: 11))
                          else
                            ...apps.map((app) {
                              final appMap = app as Map<String, dynamic>;
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
                                              Text(appMap['driverName'] as String? ?? 'Chauffeur', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                                              const SizedBox(width: 4),
                                              if (appMap['driverVerified'] == true)
                                                Container(
                                                  padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 1),
                                                  decoration: BoxDecoration(color: Colors.green.withOpacity(0.1), borderRadius: BorderRadius.circular(4)),
                                                  child: const Text('Certifié', style: TextStyle(color: Colors.green, fontSize: 8, fontWeight: FontWeight.bold)),
                                                ),
                                            ],
                                          ),
                                          const SizedBox(height: 4),
                                          Text('Score: ${appMap['driverScore']}% • Fiabilité: ${appMap['driverRating']}★', style: TextStyle(color: theme.colorScheme.onSurfaceVariant, fontSize: 10)),
                                        ],
                                      ),
                                    ),
                                    ElevatedButton(
                                      onPressed: () => _selectDriver(appMap['id']),
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
                        if (reqMap['status'] == 'ACCEPTED') ...[
                          const Divider(height: 24),
                          const Text('Course validée, en attente de réalisation.', style: TextStyle(color: Colors.green, fontWeight: FontWeight.bold, fontSize: 12)),
                        ]
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
