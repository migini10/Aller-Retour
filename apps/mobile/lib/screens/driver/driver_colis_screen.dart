import 'dart:convert';
import 'dart:async';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:aller_retour_mobile/screens/driver/driver_live_tracking_screen.dart' as driver_live_tracking_screen;

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

  Future<void> _showTransferColisDialog(Map<String, dynamic> c) async {
    final String colisId = c['id'];
    List<dynamic> targets = [];
    bool loadingTargets = true;
    String? selectedTargetId;
    final TextEditingController pinController = TextEditingController();
    String transferError = '';

    final nextApiUrl = dotenv.env['NEXT_API_URL'] ?? 'http://localhost:3000';

    // Fetch target trips
    try {
      final res = await http.get(Uri.parse('$nextApiUrl/api/colis/$colisId/transfer-targets'));
      if (res.statusCode == 200) {
        targets = jsonDecode(res.body);
      }
    } catch (e) {
      debugPrint('Error fetching target trips: $e');
    } finally {
      loadingTargets = false;
    }

    if (!mounted) return;

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
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Center(
                          child: Text(
                            'Transférer le Colis $colisId',
                            style: TextStyle(
                              color: Theme.of(context).colorScheme.onSurface,
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                        const SizedBox(height: 16),
                        const Text(
                          '1. Choisir le chauffeur et trajet cible :',
                          style: TextStyle(color: Colors.white54, fontSize: 12, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 8),
                        if (loadingTargets)
                          const Center(child: CircularProgressIndicator(color: Colors.orangeAccent))
                        else if (targets.isEmpty)
                          const Center(
                            child: Padding(
                              padding: EdgeInsets.symmetric(vertical: 16),
                              child: Text('Aucun trajet alternatif trouvé pour aujourd\'hui.', style: TextStyle(color: Colors.white38, fontSize: 13)),
                            ),
                          )
                        else
                          SizedBox(
                            maxHeight: 180,
                            child: ListView.builder(
                              shrinkWrap: true,
                              itemCount: targets.length,
                              itemBuilder: (context, i) {
                                final trip = targets[i];
                                final isSelected = selectedTargetId == trip['id'];
                                return InkWell(
                                  onTap: () {
                                    setStateModal(() {
                                      selectedTargetId = trip['id'];
                                      transferError = '';
                                    });
                                  },
                                  child: Container(
                                    margin: const EdgeInsets.only(bottom: 8),
                                    padding: const EdgeInsets.all(12),
                                    decoration: BoxDecoration(
                                      color: isSelected ? Colors.orangeAccent.withValues(alpha: 0.1) : Colors.transparent,
                                      border: Border.all(color: isSelected ? Colors.orangeAccent : Colors.white10),
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text('Chauffeur: ${trip['chauffeur']}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.white)),
                                        const SizedBox(height: 4),
                                        Text('${trip['vehicule']} • Départ : ${trip['heure']}', style: const TextStyle(color: Colors.white54, fontSize: 11)),
                                      ],
                                    ),
                                  ),
                                );
                              },
                            ),
                          ),
                        if (selectedTargetId != null) ...[
                          const SizedBox(height: 16),
                          const Center(
                            child: Text(
                              'Saisir votre Code d\'accès Chauffeur',
                              style: TextStyle(color: Colors.white38, fontSize: 11, fontWeight: FontWeight.bold),
                            ),
                          ),
                          const SizedBox(height: 8),
                          TextField(
                            controller: pinController,
                            obscureText: true,
                            keyboardType: TextInputType.number,
                            maxLength: 4,
                            textAlign: TextAlign.center,
                            style: const TextStyle(fontSize: 24, letterSpacing: 8, fontFamily: 'monospace', color: Colors.white),
                            decoration: InputDecoration(
                              counterText: '',
                              hintText: '••••',
                              hintStyle: const TextStyle(color: Colors.white24),
                              filled: true,
                              fillColor: Colors.black12,
                              border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                              focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Colors.orangeAccent)),
                            ),
                            onChanged: (_) {
                              setStateModal(() {
                                transferError = '';
                              });
                            },
                          ),
                        ],
                        if (transferError.isNotEmpty) ...[
                          const SizedBox(height: 8),
                          Center(child: Text(transferError, style: const TextStyle(color: Colors.redAccent, fontSize: 12, fontWeight: FontWeight.bold))),
                        ],
                        const SizedBox(height: 24),
                        Row(
                          children: [
                            Expanded(
                              child: TextButton(
                                onPressed: () => Navigator.pop(context),
                                child: const Text('Annuler', style: TextStyle(color: Colors.white54)),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: ElevatedButton(
                                onPressed: selectedTargetId == null || pinController.text.length < 4
                                    ? null
                                    : () async {
                                        if (pinController.text != '1234') {
                                          setStateModal(() {
                                            transferError = 'Code PIN incorrect (Démo : 1234).';
                                          });
                                          return;
                                        }
                                        setStateModal(() {
                                          loadingTargets = true;
                                        });
                                        try {
                                          final response = await http.post(
                                            Uri.parse('$nextApiUrl/api/colis/$colisId/transfer'),
                                            headers: {'Content-Type': 'application/json'},
                                            body: jsonEncode({'targetTripId': selectedTargetId}),
                                          );
                                          if (response.statusCode == 200) {
                                            Navigator.pop(context);
                                            await _loadColis();
                                            if (mounted) {
                                              ScaffoldMessenger.of(context).showSnackBar(
                                                const SnackBar(content: Text('Colis transféré avec succès !'), backgroundColor: Colors.green),
                                              );
                                            }
                                          } else {
                                            final err = jsonDecode(response.body);
                                            setStateModal(() {
                                              transferError = err['error'] ?? 'Erreur lors du transfert.';
                                              loadingTargets = false;
                                            });
                                          }
                                        } catch (e) {
                                          setStateModal(() {
                                            transferError = 'Erreur réseau.';
                                            loadingTargets = false;
                                          });
                                        }
                                      },
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.orangeAccent,
                                  foregroundColor: Colors.black,
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                  padding: const EdgeInsets.symmetric(vertical: 14),
                                ),
                                child: const Text('Confirmer', style: TextStyle(fontWeight: FontWeight.bold)),
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
      String trajet = colis['trajet'] ?? '';
      String separator = trajet.contains('→') ? '→' : trajet.contains('->') ? '->' : trajet.contains(' - ') ? ' - ' : '-';
      List<String> parts = trajet.split(separator);
      String destinationCity = parts.length > 1 ? parts[1].trim() : 'Destination';

      return Column(
        children: [
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: () {
                Navigator.push(context, MaterialPageRoute(
                  builder: (context) => driver_live_tracking_screen.DriverLiveTrackingScreen(mission: colis),
                ));
              },
              icon: const Icon(Icons.map, size: 18),
              label: Text('En route vers $destinationCity'),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFEA580C),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ),
          const SizedBox(height: 8),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: () => _showPinModal(id, 'Livré'),
              icon: const Icon(Icons.check_circle, size: 18),
              label: const Text('Livrer au destinataire'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.greenAccent.shade700,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ),
        ],
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
      case 'Expiré':
        return Colors.roseAccent;
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
          : colis.where((c) => c['statut'] != 'Livré').isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.inventory_2, size: 80, color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.1)),
                      const SizedBox(height: 16),
                      Text(
                        'Aucun colis actif en cours', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 16),
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
                  itemCount: colis.where((c) => c['statut'] != 'Livré').length,
                  itemBuilder: (context, index) {
                    final displayColis = colis.where((c) => c['statut'] != 'Livré').toList();
                    final c = displayColis[index];
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
                                    '${c['id'] ?? 'INCONNU'} • ${c['taille'] ?? ''}\n${c['date'] ?? ''}${c['time'] != null ? ' à ${c['time']}' : ''}',
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
                                  if (c['statut'] != 'Livré') ...[
                                    const SizedBox(height: 8),
                                    SizedBox(
                                      width: double.infinity,
                                      child: OutlinedButton.icon(
                                        onPressed: () => _showTransferColisDialog(c),
                                        icon: const Icon(Icons.swap_horiz, size: 18),
                                        label: const Text('Transférer Colis'),
                                        style: OutlinedButton.styleFrom(
                                          foregroundColor: Colors.white,
                                          side: BorderSide(color: Colors.white.withValues(alpha: 0.2)),
                                          padding: const EdgeInsets.symmetric(vertical: 14),
                                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                        ),
                                      ),
                                    ),
                                  ],
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
