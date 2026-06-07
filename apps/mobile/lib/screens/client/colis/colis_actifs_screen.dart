import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

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
      final response = await http.get(Uri.parse('http://localhost:3000/api/colis'));
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
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.white),
        title: const Text('Colis Actifs', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
      body: isLoading 
        ? const Center(child: CircularProgressIndicator(color: Colors.amberAccent))
        : colis.isEmpty 
          ? const Center(child: Text("Aucun colis actif", style: TextStyle(color: Colors.white54)))
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: colis.length,
              itemBuilder: (context, index) {
                final c = colis[index];
                final statut = c['statut'] ?? 'Inconnu';
                return Container(
                  margin: const EdgeInsets.only(bottom: 16),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1E293B),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: Colors.amberAccent.withOpacity(0.3)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('Réf: ${c['id']}', style: const TextStyle(color: Colors.white54, fontSize: 12, fontWeight: FontWeight.bold)),
                          Text(statut, style: const TextStyle(color: Colors.amberAccent, fontSize: 12, fontWeight: FontWeight.bold)),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(c['trajet'] ?? '', style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 8),
                      Text('À ${c['destinataire']}', style: const TextStyle(color: Colors.white70, fontSize: 14)),
                      const SizedBox(height: 4),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(c['taille'] ?? '', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                          Text(c['date'] ?? '', style: const TextStyle(color: Colors.white54, fontSize: 12)),
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
