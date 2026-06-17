import 'dart:convert';
import 'dart:async';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';

class DriverColisScreen extends StatefulWidget {
  const DriverColisScreen({super.key});

  @override
  State<DriverColisScreen> createState() => _DriverColisScreenState();
}

class _DriverColisScreenState extends State<DriverColisScreen> {
  List<dynamic> colis = [];
  bool isLoading = true;
  Timer? _pollingTimer;

  @override
  void initState() {
    super.initState();
    _loadColis();
    _pollingTimer = Timer.periodic(const Duration(seconds: 5), (_) {
      _loadColis(silent: true);
    });
  }

  @override
  void dispose() {
    _pollingTimer?.cancel();
    super.dispose();
  }

  Future<void> _loadColis({bool silent = false}) async {
    try {
      final nextApiUrl = dotenv.env['NEXT_API_URL'] ?? 'http://localhost:3000';
      final response = await http.get(Uri.parse('$nextApiUrl/api/colis'));
      if (response.statusCode == 200) {
        if (mounted) {
          setState(() {
            colis = jsonDecode(response.body);
          });
        }
      }
    } catch (e) {
      debugPrint('Error loading colis: $e');
    } finally {
      if (!silent && mounted) {
        setState(() {
          isLoading = false;
        });
      }
    }
  }

  Future<void> _updateStatut(String id, String nextStatut, {String? pin}) async {
    try {
      final body = {'statut': nextStatut};
      if (pin != null) body['pin'] = pin;

      final nextApiUrl = dotenv.env['NEXT_API_URL'] ?? 'http://localhost:3000';
      final response = await http.patch(
        Uri.parse('$nextApiUrl/api/colis/$id'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(body),
      );
      if (response.statusCode == 200) {
        await _loadColis();
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Statut mis à jour avec succès!'), backgroundColor: Colors.green));
        }
      } else {
        debugPrint('Error status code: ${response.statusCode} - ${response.body}');
        if (mounted) {
          String errMsg = 'Erreur serveur: ${response.statusCode}';
          try {
            final data = jsonDecode(response.body);
            if (data['error'] != null) errMsg = data['error'];
          } catch (_) {}
          ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(errMsg), backgroundColor: Colors.red));
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
                      color: Theme.of(context).cardColor,
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.1)),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.5),
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
                          style: TextStyle(color: Theme.of(context).colorScheme.onSurface,
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
                              color: Colors.redAccent.withValues(alpha: 0.1),
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(color: Colors.redAccent.withValues(alpha: 0.3)),
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
                          text: TextSpan(
                            style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 14),
                            children: nextStatut == 'Livré'
                                ? [
                                    const TextSpan(text: 'Demandez au destinataire de vous fournir son '),
                                    TextSpan(text: 'Code Secret de Livraison', style: TextStyle(fontWeight: FontWeight.bold, color: Theme.of(context).colorScheme.onSurface)),
                                    const TextSpan(text: ' pour confirmer la remise du colis.'),
                                  ]
                                : [
                                    const TextSpan(text: 'Veuillez entrer votre code d\'accès chauffeur (ex: '),
                                    TextSpan(text: '1234', style: TextStyle(fontWeight: FontWeight.bold, color: Theme.of(context).colorScheme.onSurface, fontFamily: 'monospace')),
                                    const TextSpan(text: ') pour valider cette action.'),
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
                          style: TextStyle(color: Theme.of(context).colorScheme.onSurface,
                            fontSize: 32,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 16,
                          ),
                          decoration: InputDecoration(
                            counterText: '',
                            hintText: '••••',
                            hintStyle: TextStyle(color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.2)),
                            filled: true,
                            fillColor: Theme.of(context).cardColor,
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(16),
                              borderSide: BorderSide(color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.1)),
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
                                  backgroundColor: Colors.white.withValues(alpha: 0.05),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                                ),
                                child: Text(
                                  nextStatut == 'Accepté' ? 'Refuser' : 'Annuler',
                                  style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontWeight: FontWeight.bold, fontSize: 16),
                                ),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: ElevatedButton(
                                onPressed: () {
                                  if (nextStatut == 'Livré') {
                                    if (pinController.text.trim().length == 4) {
                                      Navigator.pop(context);
                                      _updateStatut(colisId, nextStatut, pin: pinController.text.trim());
                                    } else {
                                      setStateModal(() {
                                        errorMsg = 'Le code doit contenir 4 chiffres.';
                                      });
                                    }
                                  } else {
                                    if (pinController.text.trim() == '1234') {
                                      Navigator.pop(context);
                                      _updateStatut(colisId, nextStatut);
                                    } else {
                                      setStateModal(() {
                                        errorMsg = 'Code de sécurité incorrect. (Saisi: "${pinController.text}")';
                                      });
                                    }
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
          color: Colors.greenAccent.withValues(alpha: 0.1),
          border: Border.all(color: Colors.greenAccent.withValues(alpha: 0.3)),
          borderRadius: BorderRadius.circular(12),
        ),
        child: const Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
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
      backgroundColor: Theme.of(context).scaffoldBackgroundColor, // slate-950
      appBar: AppBar(
        backgroundColor: Theme.of(context).cardColor,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: Theme.of(context).colorScheme.onSurface),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text('Gestion des Colis', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.bold)),
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator(color: Colors.orangeAccent))
          : colis.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.inventory_2, size: 80, color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.1)),
                      const SizedBox(height: 16),
                      Text(
                        'Aucun colis disponible', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 16),
                      ),
                    ],
                  ),
                )
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
                    final badgeColor = _getBadgeColor(c['statut'] ?? '');

                    return Container(
                      margin: const EdgeInsets.only(bottom: 16),
                      decoration: BoxDecoration(
                        color: const Color(0xFF1E293B), // slate-800
                        borderRadius: BorderRadius.circular(24),
                        border: Border.all(color: badgeColor.withValues(alpha: 0.3), width: 1.5),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.4),
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
                              bottom: -20,
                              right: -20,
                              child: Transform.rotate(
                                angle: -0.2,
                                child: Icon(
                                  Icons.inventory_2,
                                  size: 140,
                                  color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.03),
                                ),
                              ),
                            ),
                            Padding(
                              padding: const EdgeInsets.all(20),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Container(
                                        padding: const EdgeInsets.all(12),
                                        decoration: BoxDecoration(
                                          color: badgeColor.withValues(alpha: 0.1),
                                          borderRadius: BorderRadius.circular(16),
                                          border: Border.all(color: badgeColor.withValues(alpha: 0.3)),
                                        ),
                                        child: Icon(Icons.inventory_2, color: badgeColor, size: 28),
                                      ),
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                        decoration: BoxDecoration(
                                          color: badgeColor.withValues(alpha: 0.15),
                                          borderRadius: BorderRadius.circular(8),
                                          border: Border.all(color: badgeColor.withValues(alpha: 0.3)),
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
                                  const SizedBox(height: 20),
                                  Text(
                                    c['trajet'] ?? 'Trajet Inconnu',
                                    style: TextStyle(color: Theme.of(context).colorScheme.onSurface,
                                      fontSize: 20,
                                      fontWeight: FontWeight.w900,
                                      letterSpacing: -0.5,
                                    ),
                                  ),
                                  const SizedBox(height: 8),
                                  Text(
                                    '${c['id'] ?? 'INCONNU'} • ${c['taille'] ?? ''}\n${c['date'] ?? ''}',
                                    style: TextStyle(
                                      color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.6),
                                      fontSize: 13,
                                      height: 1.4,
                                    ),
                                    maxLines: 2,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                  
                                  const SizedBox(height: 20),
                                  
                                  // Destinataire + Action
                                  Container(
                                    padding: const EdgeInsets.all(12),
                                    decoration: BoxDecoration(
                                      color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.03),
                                      borderRadius: BorderRadius.circular(16),
                                    ),
                                    child: Row(
                                      children: [
                                        Expanded(
                                          child: Column(
                                            crossAxisAlignment: CrossAxisAlignment.start,
                                            children: [
                                              Text('DESTINATAIRE', style: TextStyle(color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.30), fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1)),
                                              const SizedBox(height: 4),
                                              Text(c['destinataire'] ?? '', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.bold, fontSize: 14), maxLines: 1, overflow: TextOverflow.ellipsis),
                                              Text(c['tel'] ?? '', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 12, fontFamily: 'monospace')),
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
                          ],
                        ),
                      ),
                    );
                  },
                ),
    );
  }
}
