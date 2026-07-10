import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import '../../../services/api_client.dart';
import 'dart:convert';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class ColisActifsScreen extends StatefulWidget {
  const ColisActifsScreen({super.key});

  @override
  State<ColisActifsScreen> createState() => _ColisActifsScreenState();
}

class _ColisActifsScreenState extends State<ColisActifsScreen> {
  List<dynamic> colis = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchColis();
  }

  Future<void> _fetchColis() async {
    try {
      final response = await ApiClient().get('/v1/parcels/my-parcels');
      if (response.statusCode == 200) {
        if (mounted) {
          setState(() {
            final data = jsonDecode(response.body) as List;
            colis = data.where((c) => c['status'] != 'DELIVERED').toList();
            isLoading = false;
          });
        }
      }
    } catch (e) {
      debugPrint('Erreur: $e');
      if (mounted) {
        setState(() => isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).cardColor,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        iconTheme: IconThemeData(color: Theme.of(context).colorScheme.onSurface),
        title: Text('Colis Actifs', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.bold)),
      ),
      body: isLoading 
        ? const Center(child: CircularProgressIndicator(color: Colors.amberAccent))
        : colis.isEmpty 
          ? Center(child: Text("Aucun colis actif", style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant)))
          : ListView.builder(
              padding: EdgeInsets.only(
                left: 16,
                right: 16,
                top: 16,
                bottom: MediaQuery.of(context).padding.bottom + 80,
              ),
              itemCount: colis.length,
              itemBuilder: (context, index) {
                final c = colis[index];
                final statut = c['status'] ?? 'Inconnu';
                return Container(
                  margin: const EdgeInsets.only(bottom: 16),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Theme.of(context).dividerColor,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: Colors.amberAccent.withValues(alpha: 0.3)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('Réf: ${c['id']}', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 12, fontWeight: FontWeight.bold)),
                          Text(statut, style: const TextStyle(color: Colors.amberAccent, fontSize: 12, fontWeight: FontWeight.bold)),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(c['deliveryCity'] ?? 'Destination', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 18, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 8),
                      Text('À ${c['recipientName']}', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 14)),
                      const SizedBox(height: 4),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('${c['weightKg']} Kg', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.bold)),
                          Text(c['createdAt'] != null ? DateTime.parse(c['createdAt']).toLocal().toString().substring(0, 10) : '', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 12)),
                        ],
                      )
                    ],
                  ),
                );
              },
            ),
    );
  }
}
