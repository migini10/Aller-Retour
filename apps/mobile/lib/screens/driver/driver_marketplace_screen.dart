import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:async';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class DriverMarketplaceScreen extends StatefulWidget {
  const DriverMarketplaceScreen({super.key});

  @override
  State<DriverMarketplaceScreen> createState() => _DriverMarketplaceScreenState();
}

class _DriverMarketplaceScreenState extends State<DriverMarketplaceScreen> {
  List<Map<String, dynamic>> missions = [];
  List<dynamic> colis = [];
  Timer? _pollingTimer;

  @override
  void initState() {
    super.initState();
    _loadData();
    _pollingTimer = Timer.periodic(const Duration(seconds: 5), (_) => _loadData());
  }

  @override
  void dispose() {
    _pollingTimer?.cancel();
    super.dispose();
  }

  Future<void> _loadData() async {
    try {
      final nextApiUrl = dotenv.env['NEXT_API_URL'] ?? 'http://localhost:3000';
      final colisRes = await http.get(Uri.parse('$nextApiUrl/api/colis'));
      final missionsRes = await http.get(Uri.parse('$nextApiUrl/api/missions'));
      
      if (mounted) {
        setState(() {
          if (colisRes.statusCode == 200) colis = jsonDecode(colisRes.body);
          if (missionsRes.statusCode == 200) missions = List<Map<String, dynamic>>.from(jsonDecode(missionsRes.body));
        });
      }
    } catch (e) {
      debugPrint('Error loading marketplace data: $e');
    }
  }

  Future<void> _updateColisStatus(String id, String status) async {
    try {
      final nextApiUrl = dotenv.env['NEXT_API_URL'] ?? 'http://localhost:3000';
      await http.patch(
        Uri.parse('$nextApiUrl/api/colis/$id'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'statut': status}),
      );
      _loadData();
    } catch (e) {
      debugPrint('Error updating colis: $e');
    }
  }

  // Simulating a degraded driver score
  final double driverReliabilityScore = 65.0;

  void _showReleaseModal(dynamic item, bool isColis) {
    String selectedReason = 'Panne de véhicule';
    TextEditingController customReasonController = TextEditingController();

    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Container(
              decoration: BoxDecoration(color: Theme.of(context).cardColor,
                borderRadius: const BorderRadius.vertical(top: Radius.circular(32)),
              ),
              padding: EdgeInsets.only(
                top: 24, left: 24, right: 24, 
                bottom: MediaQuery.of(context).viewInsets.bottom + 24
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Libérer la mission ?', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 20, fontWeight: FontWeight.bold)),
                      IconButton(
                        onPressed: () => Navigator.pop(context),
                        icon: Icon(Icons.close, color: Theme.of(context).colorScheme.onSurfaceVariant),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text('Veuillez préciser la raison de votre annulation.', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 14)),
                  const SizedBox(height: 24),
                  ...['Panne de véhicule', 'Client injoignable', 'Retard imprévu', 'Autre'].map((reason) {
                    return RadioListTile<String>(
                      title: Text(reason, style: TextStyle(color: Theme.of(context).colorScheme.onSurface)),
                      value: reason,
                      groupValue: selectedReason,
                      activeColor: Colors.orangeAccent,
                      onChanged: (val) {
                        setModalState(() {
                          selectedReason = val!;
                        });
                      },
                    );
                  }),
                  if (selectedReason == 'Autre')
                    Padding(
                      padding: const EdgeInsets.only(top: 8.0, bottom: 16),
                      child: TextField(
                        controller: customReasonController,
                        style: TextStyle(color: Theme.of(context).colorScheme.onSurface),
                        decoration: InputDecoration(
                          hintText: 'Précisez la raison...',
                          hintStyle: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant),
                          filled: true,
                          fillColor: Theme.of(context).cardColor,
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                        ),
                        maxLines: 3,
                      ),
                    ),
                  const SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () {
                        if (selectedReason == 'Autre' && customReasonController.text.trim().isEmpty) {
                          return;
                        }
                        if (isColis) {
                          _updateColisStatus(item['id'], 'En attente de prise en charge');
                        } else {
                          setState(() {
                            item['status'] = 'disponible'; // Placeholder for mission
                          });
                        }
                        Navigator.pop(context);
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.redAccent,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                      child: Text('Confirmer la libération', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Theme.of(context).colorScheme.onSurface)),
                    ),
                  ),
                ],
              ),
            );
          }
        );
      }
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text('Marketplace', style: TextStyle(fontWeight: FontWeight.bold)),
        centerTitle: true,
      ),
      body: Column(
        children: [
          // Encart Score de Fiabilité
          Container(
            margin: const EdgeInsets.fromLTRB(16, 0, 16, 16),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: driverReliabilityScore < 70 ? Colors.redAccent.withValues(alpha: 0.1) : Colors.greenAccent.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: driverReliabilityScore < 70 ? Colors.redAccent.withValues(alpha: 0.3) : Colors.greenAccent.withValues(alpha: 0.3)),
            ),
            child: Row(
              children: [
                Icon(
                  driverReliabilityScore < 70 ? Icons.warning_amber_rounded : Icons.verified_user, 
                  color: driverReliabilityScore < 70 ? Colors.redAccent : Colors.greenAccent,
                  size: 32,
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Score de Fiabilité : ${driverReliabilityScore.toInt()}%', 
                        style: TextStyle(
                          color: driverReliabilityScore < 70 ? Colors.redAccent : Colors.greenAccent, 
                          fontWeight: FontWeight.bold, 
                          fontSize: 16
                        )
                      ),
                      const SizedBox(height: 4),
                      Text(
                        driverReliabilityScore < 70 
                          ? 'Votre score est faible (annulations ou refus). L\'accès à certaines missions est restreint.' 
                          : 'Bon travail ! Vous avez accès à toutes les missions.',
                        style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 12),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          
          Expanded(
            child: ListView(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              children: [
                if (missions.isEmpty && colis.isEmpty)
                  const Padding(
                    padding: EdgeInsets.all(32.0),
                    child: Center(child: CircularProgressIndicator(color: Colors.orangeAccent)),
                  ),
                
                if (missions.isNotEmpty)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 16),
                    child: Text('Missions & Trajets', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 18, fontWeight: FontWeight.bold)),
                  ),
                ...missions.map((mission) {
                  final isAccepted = mission['status'] == 'accepte';
                  final isLocked = (mission['minScore'] ?? 0) > driverReliabilityScore;
                  return _buildItemCard(mission, false, isAccepted, isLocked);
                }),

                if (colis.isNotEmpty)
                  Padding(
                    padding: const EdgeInsets.only(top: 16, bottom: 16),
                    child: Text('Colis Disponibles', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 18, fontWeight: FontWeight.bold)),
                  ),
                ...colis.map((c) {
                  final isAccepted = c['statut'] == 'Accepté' || c['statut'] == 'En transit';
                  return _buildItemCard(c, true, isAccepted, false);
                }),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildItemCard(dynamic item, bool isColis, bool isAccepted, bool isLocked) {
    return Container(
                  margin: const EdgeInsets.only(bottom: 16),
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Theme.of(context).cardColor,
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(
                      color: isAccepted 
                        ? Colors.greenAccent.withValues(alpha: 0.3) 
                        : isLocked 
                          ? Colors.redAccent.withValues(alpha: 0.2) 
                          : Theme.of(context).dividerColor
                    ),
                    boxShadow: isAccepted ? [
                      BoxShadow(color: Colors.greenAccent.withValues(alpha: 0.1), blurRadius: 15)
                    ] : [],
                  ),
                  child: Stack(
                    children: [
                      Opacity(
                        opacity: isLocked ? 0.4 : 1.0,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                 Text(
                                   isColis 
                                     ? 'Colis ${item['id'].toString().startsWith('COLIS-') || item['id'].toString().startsWith('COL-') ? item['id'] : (item['id'].toString().contains('-') ? 'COL-${item['id'].toString().split('-')[0].toUpperCase()}' : item['id'])}' 
                                     : 'Mission ${item['id'].toString().startsWith('TRIP-') || item['id'].toString().startsWith('M-') ? item['id'] : (item['id'].toString().contains('-') ? 'TRIP-${item['id'].toString().split('-')[0].toUpperCase()}' : item['id'])}', 
                                   style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 12, fontFamily: 'monospace')
                                 ),
                                if (isAccepted)
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                    decoration: BoxDecoration(
                                      color: Colors.greenAccent.withValues(alpha: 0.2),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: const Text('ACCEPTÉ', style: TextStyle(color: Colors.greenAccent, fontSize: 10, fontWeight: FontWeight.bold)),
                                  ),
                              ],
                            ),
                            const SizedBox(height: 12),
                            Text(isColis ? '${item['destinataire']} - ${item['tel']}' : item['trajet'], style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 18, fontWeight: FontWeight.bold)),
                            const SizedBox(height: 8),
                            Row(
                              children: [
                                Icon(isColis ? Icons.scale : Icons.calendar_today, size: 14, color: Theme.of(context).colorScheme.onSurfaceVariant),
                                const SizedBox(width: 6),
                                Text(isColis ? item['taille'] : item['depart'], style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 13)),
                              ],
                            ),
                            const SizedBox(height: 20),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text('Rémunération', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 12)),
                                    Text(isColis ? item['prix'] : item['remuneration'], style: const TextStyle(color: Colors.orangeAccent, fontSize: 18, fontWeight: FontWeight.bold)),
                                  ],
                                ),
                                if (isAccepted)
                                  ElevatedButton(
                                    onPressed: () => _showReleaseModal(item, isColis),
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: Colors.transparent,
                                      side: const BorderSide(color: Colors.redAccent),
                                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                    ),
                                    child: const Text('Libérer', style: TextStyle(color: Colors.redAccent)),
                                  )
                                else if (!isLocked)
                                  ElevatedButton(
                                    onPressed: () {
                                      if (isColis) {
                                        _updateColisStatus(item['id'], 'Accepté');
                                      } else {
                                        setState(() {
                                          item['status'] = 'accepte';
                                        });
                                      }
                                    },
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: Colors.orangeAccent,
                                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                    ),
                                    child: const Text('Accepter', style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
                                  ),
                              ],
                            ),
                          ],
                        ),
                      ),
                      
                      if (isLocked)
                        Positioned.fill(
                          child: Center(
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                              decoration: BoxDecoration(
                                color: Colors.redAccent.withValues(alpha: 0.9),
                                borderRadius: BorderRadius.circular(12),
                                boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.5), blurRadius: 10)],
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Icon(Icons.lock, color: Theme.of(context).colorScheme.onSurface, size: 18),
                                  const SizedBox(width: 8),
                                  Text(
                                    'Score de ${item['minScore']}% requis', 
                                    style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.bold)
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                    ],
                  ),
                );
  }
}
