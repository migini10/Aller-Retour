import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class DriverColisScreen extends StatefulWidget {
  const DriverColisScreen({super.key});

  @override
  State<DriverColisScreen> createState() => _DriverColisScreenState();
}

class _DriverColisScreenState extends State<DriverColisScreen> {
  List<dynamic> colis = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadColis();
  }

  Future<void> _loadColis() async {
    try {
      final response = await http.get(Uri.parse('http://localhost:3000/api/colis'));
      if (response.statusCode == 200) {
        setState(() {
          colis = jsonDecode(response.body);
        });
      }
    } catch (e) {
      debugPrint('Error loading colis: $e');
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  Future<void> _updateStatut(String id, String nextStatut) async {
    try {
      final response = await http.patch(
        Uri.parse('http://localhost:3000/api/colis/$id'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'statut': nextStatut}),
      );
      if (response.statusCode == 200) {
        await _loadColis();
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Statut mis à jour avec succès!'), backgroundColor: Colors.green));
        }
      } else {
        debugPrint('Error status code: ${response.statusCode} - ${response.body}');
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Erreur serveur: ${response.statusCode}'), backgroundColor: Colors.red));
        }
      }
    } catch (e) {
      debugPrint('Error updating status: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Erreur réseau: $e'), backgroundColor: Colors.red));
      }
    }
  }

  void _showPinModal(String colisId, String nextStatut) {
    final TextEditingController pinController = TextEditingController();
    String errorMsg = '';

    showGeneralDialog(
      context: context,
      barrierDismissible: true,
      barrierLabel: 'Dismiss',
      transitionDuration: const Duration(milliseconds: 300),
      pageBuilder: (context, animation, secondaryAnimation) {
        return StatefulBuilder(
          builder: (context, setStateModal) {
            return Scaffold(
              backgroundColor: Colors.transparent,
              body: Center(
                child: SingleChildScrollView(
                  child: Container(
                    margin: const EdgeInsets.symmetric(horizontal: 24),
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: const Color(0xFF141414),
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(color: Colors.white.withOpacity(0.1)),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.5),
                          blurRadius: 30,
                          offset: const Offset(0, 10),
                        ),
                      ],
                    ),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          nextStatut == 'Accepté' ? 'Contrat de Responsabilité' : 'Code de sécurité',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 16),
                        
                        if (nextStatut == 'Accepté')
                          Container(
                            padding: const EdgeInsets.all(16),
                            margin: const EdgeInsets.only(bottom: 24),
                            decoration: BoxDecoration(
                              color: Colors.redAccent.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(color: Colors.redAccent.withOpacity(0.3)),
                            ),
                            child: RichText(
                              textAlign: TextAlign.center,
                              text: const TextSpan(
                                style: TextStyle(color: Colors.redAccent, fontSize: 13, height: 1.5),
                                children: [
                                  TextSpan(text: 'En saisissant votre code PIN, vous signez électroniquement ce contrat. '),
                                  TextSpan(text: 'Vous devenez l\'unique responsable de ce colis du début à la fin de la course. ', style: TextStyle(fontWeight: FontWeight.bold)),
                                  TextSpan(text: 'En cas de perte, de vol ou de dommage entraînant une demande de remboursement, vous en assumerez intégralement les frais.'),
                                ],
                              ),
                            ),
                          ),

                        RichText(
                          textAlign: TextAlign.center,
                          text: const TextSpan(
                            style: TextStyle(color: Colors.white70, fontSize: 14),
                            children: [
                              TextSpan(text: 'Veuillez entrer votre code d\'accès chauffeur (ex: '),
                              TextSpan(text: '1234', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white, fontFamily: 'monospace')),
                              TextSpan(text: ') pour valider cette action.'),
                            ],
                          ),
                        ),
                        const SizedBox(height: 24),
                        TextField(
                          controller: pinController,
                          autofocus: true,
                          keyboardType: TextInputType.number,
                          maxLength: 4,
                          obscureText: true,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 32,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 16,
                          ),
                          decoration: InputDecoration(
                            counterText: '',
                            hintText: '••••',
                            hintStyle: TextStyle(color: Colors.white.withOpacity(0.2)),
                            filled: true,
                            fillColor: const Color(0xFF1A1A1A),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(16),
                              borderSide: BorderSide(color: Colors.white.withOpacity(0.1)),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(16),
                              borderSide: const BorderSide(color: Colors.orangeAccent),
                            ),
                          ),
                          onChanged: (val) {
                            if (errorMsg.isNotEmpty) {
                              setStateModal(() {
                                errorMsg = '';
                              });
                            }
                          },
                        ),

                        if (errorMsg.isNotEmpty)
                          Padding(
                            padding: const EdgeInsets.only(top: 16),
                            child: Text(
                              errorMsg,
                              style: const TextStyle(color: Colors.redAccent, fontWeight: FontWeight.bold, fontSize: 14),
                              textAlign: TextAlign.center,
                            ),
                          ),

                        const SizedBox(height: 32),

                        Row(
                          children: [
                            Expanded(
                              child: TextButton(
                                onPressed: () => Navigator.pop(context),
                                style: TextButton.styleFrom(
                                  padding: const EdgeInsets.symmetric(vertical: 16),
                                  backgroundColor: Colors.white.withOpacity(0.05),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                                ),
                                child: Text(
                                  nextStatut == 'Accepté' ? 'Refuser' : 'Annuler',
                                  style: const TextStyle(color: Colors.white70, fontWeight: FontWeight.bold, fontSize: 16),
                                ),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: ElevatedButton(
                                onPressed: () {
                                  if (pinController.text.trim() == '1234') {
                                    Navigator.pop(context);
                                    _updateStatut(colisId, nextStatut);
                                  } else {
                                    setStateModal(() {
                                      errorMsg = 'Code de sécurité incorrect. (Saisi: "${pinController.text}")';
                                    });
                                  }
                                },
                                style: ElevatedButton.styleFrom(
                                  padding: const EdgeInsets.symmetric(vertical: 16),
                                  backgroundColor: nextStatut == 'Accepté' ? Colors.redAccent : Colors.orange.shade700,
                                  foregroundColor: Colors.white,
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                                  elevation: 0,
                                ),
                                child: Text(
                                  nextStatut == 'Accepté' ? 'Signer et Valider' : 'Valider',
                                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                                  textAlign: TextAlign.center,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            );
          },
        );
      },
    );
  }

  Widget _buildActionButton(Map<String, dynamic> c) {
    final statut = c['statut'];
    final id = c['id'];

    if (statut == 'En attente de prise en charge') {
      return SizedBox(
        width: double.infinity,
        child: ElevatedButton.icon(
          onPressed: () => _showPinModal(id, 'Accepté'),
          icon: const Icon(Icons.check_circle_outline, size: 18),
          label: const Text('Accepter la course'),
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.orange.shade700,
            foregroundColor: Colors.white,
            padding: const EdgeInsets.symmetric(vertical: 14),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
        ),
      );
    } else if (statut == 'Accepté') {
      return SizedBox(
        width: double.infinity,
        child: ElevatedButton.icon(
          onPressed: () => _showPinModal(id, 'En transit'),
          icon: const Icon(Icons.inventory_2, size: 18),
          label: const Text('Colis récupéré'),
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.indigoAccent,
            foregroundColor: Colors.white,
            padding: const EdgeInsets.symmetric(vertical: 14),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
        ),
      );
    } else if (statut == 'En transit') {
      return SizedBox(
        width: double.infinity,
        child: ElevatedButton.icon(
          onPressed: () => _showPinModal(id, 'Livré'),
          icon: const Icon(Icons.location_on, size: 18),
          label: const Text('Livrer au destinataire'),
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.greenAccent.shade700,
            foregroundColor: Colors.white,
            padding: const EdgeInsets.symmetric(vertical: 14),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
        ),
      );
    } else if (statut == 'Livré') {
      return Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(vertical: 14),
        decoration: BoxDecoration(
          color: Colors.greenAccent.withOpacity(0.1),
          border: Border.all(color: Colors.greenAccent.withOpacity(0.3)),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: const [
            Icon(Icons.check_circle, color: Colors.greenAccent, size: 18),
            SizedBox(width: 8),
            Text('Terminé', style: TextStyle(color: Colors.greenAccent, fontWeight: FontWeight.bold)),
          ],
        ),
      );
    }
    return const SizedBox.shrink();
  }

  Color _getBadgeColor(String statut) {
    switch (statut) {
      case 'En attente de prise en charge':
        return Colors.orangeAccent;
      case 'Accepté':
        return Colors.blueAccent;
      case 'En transit':
        return Colors.indigoAccent;
      case 'Livré':
        return Colors.greenAccent;
      default:
        return Colors.white54;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF020617), // slate-950
      appBar: AppBar(
        backgroundColor: const Color(0xFF0F172A),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('Gestion des Colis', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator(color: Colors.orangeAccent))
          : colis.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.inventory_2, size: 80, color: Colors.white.withOpacity(0.1)),
                      const SizedBox(height: 16),
                      const Text(
                        'Aucun colis disponible',
                        style: TextStyle(color: Colors.white54, fontSize: 16),
                      ),
                    ],
                  ),
                )
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: colis.length,
                  itemBuilder: (context, index) {
                    final c = colis[index];
                    final badgeColor = _getBadgeColor(c['statut'] ?? '');

                    return Container(
                      margin: const EdgeInsets.only(bottom: 16),
                      decoration: BoxDecoration(
                        color: const Color(0xFF0F172A),
                        borderRadius: BorderRadius.circular(24),
                        border: Border.all(color: Colors.white.withOpacity(0.05)),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(20),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Header
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Row(
                                  children: [
                                    const Icon(Icons.inventory_2, color: Colors.white54, size: 16),
                                    const SizedBox(width: 6),
                                    Text(
                                      c['id'] ?? 'INCONNU',
                                      style: const TextStyle(
                                        color: Colors.white70,
                                        fontFamily: 'monospace',
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ],
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: badgeColor.withOpacity(0.1),
                                    border: Border.all(color: badgeColor.withOpacity(0.3)),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Text(
                                    (c['statut'] ?? '').toUpperCase(),
                                    style: TextStyle(
                                      color: badgeColor,
                                      fontSize: 10,
                                      fontWeight: FontWeight.bold,
                                      letterSpacing: 0.5,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 16),
                            
                            // Content
                            Text(
                              c['trajet'] ?? 'Trajet Inconnu',
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 18,
                                fontWeight: FontWeight.w900,
                              ),
                            ),
                            const SizedBox(height: 12),
                            Row(
                              children: [
                                const Icon(Icons.access_time, color: Colors.white30, size: 16),
                                const SizedBox(width: 6),
                                Text(c['date'] ?? '', style: const TextStyle(color: Colors.white54, fontSize: 13)),
                                const SizedBox(width: 16),
                                const Icon(Icons.aspect_ratio, color: Colors.white30, size: 16),
                                const SizedBox(width: 6),
                                Text(c['taille'] ?? '', style: const TextStyle(color: Colors.white54, fontSize: 13)),
                              ],
                            ),
                            
                            const Padding(
                              padding: EdgeInsets.symmetric(vertical: 16),
                              child: Divider(color: Colors.white10, height: 1),
                            ),
                            
                            // Destinataire + Action
                            Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.03),
                                borderRadius: BorderRadius.circular(16),
                              ),
                              child: Row(
                                children: [
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        const Text('DESTINATAIRE', style: TextStyle(color: Colors.white30, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1)),
                                        const SizedBox(height: 4),
                                        Text(c['destinataire'] ?? '', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14), maxLines: 1, overflow: TextOverflow.ellipsis),
                                        Text(c['tel'] ?? '', style: const TextStyle(color: Colors.white54, fontSize: 12, fontFamily: 'monospace')),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(height: 16),
                            _buildActionButton(c),
                          ],
                        ),
                      ),
                    );
                  },
                ),
    );
  }
}
