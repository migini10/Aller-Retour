import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
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
      final nextApiUrl = dotenv.env['NEXT_API_URL'] ?? 'http://localhost:3000';
      final response = await http.get(Uri.parse('$nextApiUrl/api/colis'));
      if (response.statusCode == 200) {
        if (mounted) {
          setState(() {
            final data = jsonDecode(response.body) as List;
            colis = data.where((c) => c['statut'] != 'Livré').toList();
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
                final statut = c['statut'] ?? 'Inconnu';
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
                      Text(c['trajet'] ?? '', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 18, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 8),
                      Text('À ${c['destinataire']}', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 14)),
                      const SizedBox(height: 4),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(c['taille'] ?? '', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.bold)),
                          Text(c['date'] ?? '', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 12)),
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
