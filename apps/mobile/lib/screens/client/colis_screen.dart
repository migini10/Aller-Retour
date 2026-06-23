import 'dart:convert';
import 'dart:async';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'colis/colis_total_screen.dart';
import '../../widgets/shared_scaffold.dart';
import 'widgets/colis_modal.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ColisScreen extends StatefulWidget {
  const ColisScreen({super.key});

  @override
  State<ColisScreen> createState() => _ColisScreenState();
}

class _ColisScreenState extends State<ColisScreen> {
  List<dynamic> localColis = [];
  bool _isLoading = true;
  Timer? _pollingTimer;
  final TextEditingController searchController = TextEditingController();
  String _userPhone = '';

  void _showTrackingModal(Map<String, dynamic> colis) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      useSafeArea: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return Container(
          decoration: BoxDecoration(
            color: Theme.of(context).cardColor,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(32)),
          ),
          child: SingleChildScrollView(
            padding: EdgeInsets.fromLTRB(24, 24, 24, 24 + MediaQuery.of(context).padding.bottom),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Suivi de Colis', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 24, fontWeight: FontWeight.w900)),
                      Text(colis['id'] ?? '', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 14, fontFamily: 'monospace')),
                    ],
                  ),
                  IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: Icon(Icons.close, color: Theme.of(context).colorScheme.onSurfaceVariant),
                  )
                ],
              ),
              const SizedBox(height: 24),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.purpleAccent.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.purpleAccent.withValues(alpha: 0.2)),
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(color: Colors.purpleAccent, borderRadius: BorderRadius.circular(12)),
                      child: Icon(Icons.inventory_2, color: Theme.of(context).colorScheme.onSurface),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('DESTINATAIRE', style: TextStyle(color: Colors.purpleAccent, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1)),
                          const SizedBox(height: 2),
                          Text(colis['destinataire'] ?? '', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.bold, fontSize: 16)),
                          Text(colis['tel'] ?? '', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 13)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              
              // Informations du Chauffeur (Visible uniquement pour le client)
              if (colis['statut'] == 'Accepté' || colis['statut'] == 'En transit' || colis['statut'] == 'Livré')
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.orangeAccent.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: Colors.orangeAccent.withValues(alpha: 0.2)),
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(color: Colors.orangeAccent, borderRadius: BorderRadius.circular(12)),
                        child: Icon(Icons.local_shipping, color: Colors.white),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('CHAUFFEUR EN CHARGE', style: TextStyle(color: Colors.orangeAccent, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1)),
                            const SizedBox(height: 2),
                            Text('Ousmane Diop', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.bold, fontSize: 16)),
                            Text('+221 77 987 65 43', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 13)),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              if (colis['statut'] == 'Accepté' || colis['statut'] == 'En transit' || colis['statut'] == 'Livré')
                const SizedBox(height: 32)
              else 
                const SizedBox(height: 16),
              
              if (colis['statut'] != 'Livré' && colis['deliveryCode'] != null)
                Container(
                  margin: const EdgeInsets.only(bottom: 24),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.blueAccent.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: Colors.blueAccent.withValues(alpha: 0.3)),
                  ),
                  child: Column(
                    children: [
                      const Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.lock_outline, color: Colors.blueAccent, size: 20),
                          SizedBox(width: 8),
                          Text('Code Secret de Livraison', style: TextStyle(color: Colors.blueAccent, fontWeight: FontWeight.bold)),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(colis['deliveryCode'] ?? '', style: const TextStyle(color: Colors.blueAccent, fontSize: 32, fontWeight: FontWeight.w900, letterSpacing: 8)),
                      const SizedBox(height: 8),
                      Text('Communiquez ce code au chauffeur uniquement lors de la réception de votre colis.', textAlign: TextAlign.center, style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 12)),
                    ],
                  ),
                ),
              // Timeline
              Builder(builder: (context) {
                String formatDate(String? isoString) {
                  if (isoString == null || isoString.isEmpty) return '';
                  try {
                    final dt = DateTime.parse(isoString).toLocal();
                    return '${dt.day.toString().padLeft(2, '0')}/${dt.month.toString().padLeft(2, '0')}/${dt.year} ${dt.hour.toString().padLeft(2, '0')}:${dt.minute.toString().padLeft(2, '0')}';
                  } catch (e) {
                    return '';
                  }
                }
                
                String formatDateOnly(String? date, String? time) {
                  if (date == null || date.isEmpty) return '';
                  final parts = date.split('-');
                  if (parts.length == 3) {
                    return '${parts[2]}/${parts[1]}/${parts[0]} ${time ?? ''}';
                  }
                  return '$date ${time ?? ''}';
                }

                return Column(
                  children: [
                    _buildTimelineStep(
                      title: 'En attente de prise en charge',
                      subtitle: formatDateOnly(colis['date'], colis['time']),
                      isActive: colis['statut'] == 'En attente de prise en charge',
                      isDone: true,
                      color: Colors.orangeAccent,
                      isLast: false,
                    ),
                    _buildTimelineStep(
                      title: 'Course acceptée par un chauffeur',
                      subtitle: 'À l\'agence de départ${colis['acceptedAt'] != null ? '\\n' + formatDate(colis['acceptedAt']) : ''}',
                      isActive: colis['statut'] == 'Accepté',
                      isDone: colis['statut'] != 'En attente de prise en charge',
                      color: Colors.blueAccent,
                      isLast: false,
                    ),
                    _buildTimelineStep(
                      title: 'En transit vers la destination',
                      subtitle: '${(colis['trajet'] ?? '').split('→').last.trim()}${colis['inTransitAt'] != null ? '\\n' + formatDate(colis['inTransitAt']) : ''}',
                      isActive: colis['statut'] == 'En transit',
                      isDone: colis['statut'] == 'Livré' || colis['statut'] == 'En transit',
                      color: Colors.indigoAccent,
                      isLast: false,
                    ),
                    _buildTimelineStep(
                      title: 'Livré au destinataire',
                      subtitle: colis['deliveredAt'] != null ? formatDate(colis['deliveredAt']) : '',
                      isActive: colis['statut'] == 'Livré',
                      isDone: colis['statut'] == 'Livré',
                      color: Colors.greenAccent,
                      isLast: true,
                    ),
                  ],
                );
              }),
              
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () => Navigator.pop(context),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Theme.of(context).dividerColor,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    elevation: 0,
                  ),
                  child: Text('Fermer', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.bold)),
                ),
              )
            ],
          ),
        ));
      },
    );
  }

  Widget _buildTimelineStep({required String title, required String subtitle, required bool isActive, required bool isDone, required Color color, required bool isLast}) {
    final textColor = isActive 
        ? Theme.of(context).colorScheme.onSurface 
        : (isDone ? Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.6) : Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.3));
    final subtitleColor = isActive 
        ? Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.5) 
        : Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.3);

    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 30,
            child: Column(
              children: [
                Container(
                  width: 16,
                  height: 16,
                  decoration: BoxDecoration(
                    color: isActive ? color : (isDone ? color.withValues(alpha: 0.5) : Theme.of(context).dividerColor),
                    shape: BoxShape.circle,
                    border: Border.all(color: isActive ? Theme.of(context).cardColor : Colors.transparent, width: 3),
                    boxShadow: isActive ? [BoxShadow(color: color.withValues(alpha: 0.4), blurRadius: 8, spreadRadius: 4)] : [],
                  ),
                ),
                if (!isLast)
                  Expanded(
                    child: Container(
                      width: 2,
                      color: Theme.of(context).dividerColor,
                      margin: const EdgeInsets.symmetric(vertical: 4),
                    ),
                  ),
              ],
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.only(bottom: 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: TextStyle(color: textColor, fontWeight: FontWeight.bold, fontSize: 15)),
                  if (subtitle.isNotEmpty)
                    Padding(
                      padding: const EdgeInsets.only(top: 4),
                      child: Text(subtitle, style: TextStyle(color: subtitleColor, fontSize: 12)),
                    ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  @override
  void initState() {
    super.initState();
    _initData();
  }

  Future<void> _initData() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _userPhone = prefs.getString('userPhone') ?? '';
    });
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
            final List<dynamic> data = jsonDecode(response.body);
            localColis = data.where((p) => p['senderPhone'] == _userPhone || p['tel'] == _userPhone).toList();
            if (!silent) _isLoading = false;
          });
        }
      }
    } catch (e) {
      debugPrint('Error loading colis: $e');
      if (!silent && mounted) {
        setState(() { _isLoading = false; });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return SharedScaffold(
      title: 'Mes Colis',
      subtitle: 'Suivez et expédiez vos colis en toute simplicité.',
      icon: Icons.local_shipping,
      iconColor: Colors.orangeAccent,
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Stats Row
            Row(
              children: [
                Expanded(child: _buildStatCard(Icons.inventory_2, Colors.purpleAccent, 'TOTAL', '12', 'Colis envoyés (Année)', onTap: () {
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Bientôt disponible')));
                })),
                const SizedBox(width: 12),
                Expanded(child: _buildStatCard(Icons.access_time, Colors.amber, 'ACTIF', '1', 'En cours d\'expédition', onTap: () {
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Bientôt disponible')));
                })),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(child: _buildStatCard(Icons.check_circle, Colors.greenAccent, '', '11', 'Colis livrés', onTap: () {
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Bientôt disponible')));
                })),
                const SizedBox(width: 12),
                Expanded(child: _buildStatCard(Icons.star, Colors.blueAccent, '150', 'pts', 'Points de fidélité', onTap: () {
                  Navigator.push(context, MaterialPageRoute(builder: (context) => const ColisFranchiseScreen()));
                })),
              ],
            ),
            const SizedBox(height: 32),

            // Action Card: Send via Allo Dakar
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFFF97316), Color(0xFFF43F5E)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(color: const Color(0xFFEA580C).withValues(alpha: 0.3), blurRadius: 15, offset: const Offset(0, 5)),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Row(
                    children: [
                      Icon(Icons.local_shipping, color: Colors.white, size: 28),
                      SizedBox(width: 12),
                      Text('Allo Dakar Express', style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.w900)),
                    ],
                  ),
                  const SizedBox(height: 4),
                  const Text('Gérez et suivez l\'expédition de vos colis à travers le pays.', style: TextStyle(color: Color(0xFFFFF7ED), fontSize: 13)),
                  const SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      onPressed: () async {
                        showColisModal(context);
                        // Reload when returning
                        await Future.delayed(const Duration(seconds: 3));
                        _loadColis();
                      },
                      icon: const Icon(Icons.add),
                      label: const Text('Envoyer un colis', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white,
                        foregroundColor: const Color(0xFFEA580C),
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        textStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),
            
            // Tracking Section
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF9333EA), Color(0xFF312E81)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(24),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Suivre un colis', style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  const Text('Entrez le numéro de suivi pour connaître son statut en temps réel.', style: TextStyle(color: Color(0xFFE9D5FF), fontSize: 14)),
                  const SizedBox(height: 16),
                  Container(
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.white.withValues(alpha: 0.2)),
                    ),
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                    child: TextField(
                          controller: searchController,
                          style: const TextStyle(color: Colors.white),
                      decoration: const InputDecoration(
                        icon: Icon(Icons.search, color: Color(0xFFD8B4FE)),
                        border: InputBorder.none,
                        hintText: 'Ex: COL-894-D15',
                        hintStyle: TextStyle(color: Color(0xFFD8B4FE)),
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () {
                        final found = localColis.firstWhere((c) => (c['id'] ?? '').toString().contains(searchController.text), orElse: () => null);
                        if (found != null) {
                          _showTrackingModal(found);
                        } else {
                          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Colis non trouvé')));
                        }
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: const Text('Rechercher', style: TextStyle(color: Color(0xFF9333EA), fontWeight: FontWeight.bold)),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 40),

            // Active Parcels List
            Text('Colis Récents', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            
            ...() {
              List<dynamic> displayColis = localColis.where((c) => c['statut'] != 'Livré').toList();
              if (displayColis.isEmpty && localColis.isNotEmpty) {
                displayColis = [localColis.first];
              }
              return displayColis.map((c) {
                final statut = c['statut'] ?? 'En attente de prise en charge';
                Color statusColor = Colors.orangeAccent;
                double progress = 0.1;

                if (statut == 'Accepté') {
                  statusColor = Colors.blueAccent;
                  progress = 0.3;
                }
                if (statut == 'En transit') {
                  statusColor = Colors.indigoAccent;
                  progress = 0.6;
                }
                if (statut == 'Livré') {
                  statusColor = Colors.tealAccent;
                  progress = 1.0;
                }

                return Column(
                  children: [
                    _buildParcelItem(
                      icon: statut == 'Livré' ? Icons.check_circle : Icons.inventory_2,
                      iconColor: statusColor,
                      title: c['trajet'] ?? 'Trajet Inconnu',
                      status: statut.toString().toUpperCase(),
                      statusColor: statusColor,
                      ref: 'Réf: ${c['id']} • ${c['taille']} • ${c['date']}${c['time'] != null ? ' à ${c['time']}' : ''}',
                      dest: c['destinataire'] ?? '',
                      phone: c['tel'],
                      showProgress: statut != 'Livré',
                      progressValue: progress,
                      actionLabel: 'Détails',
                      onTapAction: () => _showTrackingModal(c),
                      deliveryCode: (_userPhone.isNotEmpty && _userPhone == c['senderPhone'] && statut != 'Livré') ? c['deliveryCode']?.toString() : null,
                    ),
                    const SizedBox(height: 16),
                  ],
                );
              });
            }(),
            
            // Active Parcel 1 (Mock)
            if (localColis.isEmpty)
              _buildParcelItem(
                icon: Icons.local_shipping,
                iconColor: Colors.amber,
                title: 'Dakar ➔ Saint-Louis',
                status: 'EN TRANSIT',
                statusColor: Colors.amber,
                ref: 'Réf: COL-894-D15 • 12 kg',
                dest: 'Moussa Diop',
                phone: '+221 77 123 45 67',
                showProgress: true,
                actionLabel: 'Détails',
                onTapAction: () => _showTrackingModal({'id': 'COL-894-D15', 'statut': 'En transit', 'destinataire': 'Moussa Diop', 'tel': '+221 77 123 45 67', 'date': 'Aujourd\'hui', 'trajet': 'Dakar → Saint-Louis'}),
              ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }


  Widget _buildStatCard(IconData icon, Color color, String badge, String value, String label, {VoidCallback? onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
        color: Theme.of(context).dividerColor, // slate-800
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.withValues(alpha: 0.3), width: 1.5),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.3),
            blurRadius: 10,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(16),
        child: Stack(
          children: [
            // Faint background icon
            Positioned(
              bottom: -15,
              right: -15,
              child: Transform.rotate(
                angle: -0.2,
                child: Icon(
                  icon,
                  size: 80,
                  color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.04),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: color.withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: color.withValues(alpha: 0.3)),
                        ),
                        child: Icon(icon, color: color, size: 20),
                      ),
                      if (badge.isNotEmpty)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 4),
                          decoration: BoxDecoration(
                            color: color.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(6),
                            border: Border.all(color: color.withValues(alpha: 0.3)),
                          ),
                          child: Text(badge, style: TextStyle(color: color, fontSize: 9, fontWeight: FontWeight.bold, letterSpacing: 0.5)),
                        ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Text(value, style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 24, fontWeight: FontWeight.w900)),
                  const SizedBox(height: 4),
                  Text(label, style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 11, fontWeight: FontWeight.bold)),
                ],
              ),
            ),
          ],
        ),
      ),
    ));
  }

  Widget _buildParcelItem({
    required IconData icon,
    required Color iconColor,
    required String title,
    required String status,
    required Color statusColor,
    required String ref,
    required String dest,
    required bool showProgress,
    required String actionLabel,
    required VoidCallback onTapAction,
    double progressValue = 0.0,
    String? phone,
    String? deliveryCode,
  }) {
    return GestureDetector(
      onTap: onTapAction,
      child: Container(
        width: double.infinity,
        margin: const EdgeInsets.only(bottom: 16),
        decoration: BoxDecoration(
          color: Theme.of(context).dividerColor, // slate-800
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: statusColor.withValues(alpha: 0.3), width: 1.5),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.4),
              blurRadius: 15,
              offset: Offset(0, 8),
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
                    icon,
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
                            color: iconColor.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: iconColor.withValues(alpha: 0.3)),
                          ),
                          child: Icon(icon, color: iconColor, size: 28),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                          decoration: BoxDecoration(
                            color: statusColor.withValues(alpha: 0.15),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: statusColor.withValues(alpha: 0.3)),
                          ),
                          child: Text(
                            status,
                            style: TextStyle(
                              color: statusColor,
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
                      title,
                      style: TextStyle(color: Theme.of(context).colorScheme.onSurface,
                        fontSize: 20,
                        fontWeight: FontWeight.w900,
                        letterSpacing: -0.5,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      '$ref\nDestinataire: $dest${phone != null ? ' ($phone)' : ''}',
                      style: TextStyle(
                        color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.6),
                        fontSize: 13,
                        height: 1.4,
                      ),
                      maxLines: 3,
                      overflow: TextOverflow.ellipsis,
                    ),
                    if (deliveryCode != null && deliveryCode.isNotEmpty)
                      Container(
                        margin: const EdgeInsets.only(top: 8),
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        decoration: BoxDecoration(
                          color: Colors.amber.withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: Colors.amber.withValues(alpha: 0.3)),
                        ),
                        child: Text(
                          'Code de livraison: $deliveryCode',
                          style: TextStyle(
                            color: Colors.amber,
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    if (showProgress) ...[
                      const SizedBox(height: 24),
                      LayoutBuilder(
                        builder: (context, constraints) {
                          return Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Stack(
                                children: [
                                  Container(
                                    height: 6,
                                    width: double.infinity,
                                    decoration: BoxDecoration(color: Theme.of(context).dividerColor.withValues(alpha: 0.5), borderRadius: BorderRadius.circular(3)),
                                  ),
                                  Container(
                                    height: 6,
                                    width: constraints.maxWidth * progressValue,
                                    decoration: BoxDecoration(
                                      color: statusColor,
                                      borderRadius: BorderRadius.circular(3),
                                      boxShadow: [
                                        BoxShadow(
                                          color: statusColor.withValues(alpha: 0.5),
                                          blurRadius: 6,
                                          offset: const Offset(0, 2),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 8),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Text('DÉPÔT', style: TextStyle(color: progressValue >= 0.1 ? statusColor : Colors.white54, fontSize: 9, fontWeight: FontWeight.bold, letterSpacing: 0.5)),
                                  Text('EN ROUTE', style: TextStyle(color: progressValue >= 0.5 ? statusColor : Colors.white54, fontSize: 9, fontWeight: FontWeight.bold, letterSpacing: 0.5)),
                                  Text('LIVRÉ', style: TextStyle(color: progressValue >= 1.0 ? statusColor : Colors.white54, fontSize: 9, fontWeight: FontWeight.bold, letterSpacing: 0.5)),
                                ],
                              ),
                            ],
                          );
                        }
                      ),
                    ],
                    const SizedBox(height: 24),
                    Row(
                      children: [
                        Text(
                          actionLabel,
                          style: TextStyle(
                            color: statusColor,
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(width: 6),
                        Icon(Icons.arrow_forward_rounded, size: 18, color: statusColor),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
