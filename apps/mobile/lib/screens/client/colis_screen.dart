import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'widgets/colis_modal.dart';

class ColisScreen extends StatefulWidget {
  const ColisScreen({super.key});

  @override
  State<ColisScreen> createState() => _ColisScreenState();
}

class _ColisScreenState extends State<ColisScreen> {
  List<dynamic> localColis = [];
  bool _isLoading = true;
  final TextEditingController searchController = TextEditingController();

  void _showTrackingModal(Map<String, dynamic> colis) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return Container(
          decoration: const BoxDecoration(
            color: Color(0xFF111111),
            borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
          ),
          padding: const EdgeInsets.all(24),
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
                      const Text('Suivi de Colis', style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.w900)),
                      Text(colis['id'] ?? '', style: const TextStyle(color: Colors.white54, fontSize: 14, fontFamily: 'monospace')),
                    ],
                  ),
                  IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: const Icon(Icons.close, color: Colors.white54),
                  )
                ],
              ),
              const SizedBox(height: 24),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.purpleAccent.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.purpleAccent.withOpacity(0.2)),
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(color: Colors.purpleAccent, borderRadius: BorderRadius.circular(12)),
                      child: const Icon(Icons.inventory_2, color: Colors.white),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('DESTINATAIRE', style: TextStyle(color: Colors.purpleAccent, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1)),
                          const SizedBox(height: 2),
                          Text(colis['destinataire'] ?? '', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                          Text(colis['tel'] ?? '', style: const TextStyle(color: Colors.white54, fontSize: 13)),
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
                    color: Colors.orangeAccent.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: Colors.orangeAccent.withOpacity(0.2)),
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(color: Colors.orangeAccent, borderRadius: BorderRadius.circular(12)),
                        child: const Icon(Icons.local_shipping, color: Colors.white),
                      ),
                      const SizedBox(width: 16),
                      const Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('CHAUFFEUR EN CHARGE', style: TextStyle(color: Colors.orangeAccent, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1)),
                            SizedBox(height: 2),
                            Text('Ousmane Diop', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                            Text('+221 77 987 65 43', style: TextStyle(color: Colors.white54, fontSize: 13)),
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
              
              // Timeline
              _buildTimelineStep(
                title: 'En attente de prise en charge',
                subtitle: colis['date'] ?? '',
                isActive: colis['statut'] == 'En attente de prise en charge',
                isDone: true,
                color: Colors.orangeAccent,
                isLast: false,
              ),
              _buildTimelineStep(
                title: 'Course acceptée par un chauffeur',
                subtitle: 'À l\'agence de départ',
                isActive: colis['statut'] == 'Accepté',
                isDone: colis['statut'] != 'En attente de prise en charge',
                color: Colors.blueAccent,
                isLast: false,
              ),
              _buildTimelineStep(
                title: 'En transit vers la destination',
                subtitle: (colis['trajet'] ?? '').split('→').last.trim(),
                isActive: colis['statut'] == 'En transit',
                isDone: colis['statut'] == 'Livré' || colis['statut'] == 'En transit',
                color: Colors.indigoAccent,
                isLast: false,
              ),
              _buildTimelineStep(
                title: 'Livré au destinataire',
                subtitle: '',
                isActive: colis['statut'] == 'Livré',
                isDone: colis['statut'] == 'Livré',
                color: Colors.greenAccent,
                isLast: true,
              ),
              
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () => Navigator.pop(context),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.white.withOpacity(0.1),
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                  child: const Text('Fermer', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                ),
              )
            ],
          ),
        );
      },
    );
  }

  Widget _buildTimelineStep({required String title, required String subtitle, required bool isActive, required bool isDone, required Color color, required bool isLast}) {
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
                    color: isActive ? color : (isDone ? color.withOpacity(0.5) : Colors.white10),
                    shape: BoxShape.circle,
                    border: Border.all(color: isActive ? Colors.white : Colors.transparent, width: 3),
                    boxShadow: isActive ? [BoxShadow(color: color.withOpacity(0.4), blurRadius: 8, spreadRadius: 4)] : [],
                  ),
                ),
                if (!isLast)
                  Expanded(
                    child: Container(
                      width: 2,
                      color: Colors.white10,
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
                  Text(title, style: TextStyle(color: isActive ? Colors.white : (isDone ? Colors.white70 : Colors.white30), fontWeight: FontWeight.bold, fontSize: 15)),
                  if (subtitle.isNotEmpty)
                    Padding(
                      padding: const EdgeInsets.only(top: 4),
                      child: Text(subtitle, style: TextStyle(color: isActive ? Colors.white70 : Colors.white30, fontSize: 12)),
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
    _loadColis();
  }

  Future<void> _loadColis() async {
    try {
      final response = await http.get(Uri.parse('http://localhost:3000/api/colis'));
      if (response.statusCode == 200) {
        setState(() {
          localColis = jsonDecode(response.body);
          _isLoading = false;
        });
      }
    } catch (e) {
      debugPrint('Error loading colis: $e');
      setState(() { _isLoading = false; });
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
        title: const Row(
          children: [
            Icon(Icons.inventory_2, color: Colors.purpleAccent),
            SizedBox(width: 12),
            Text('Mes Colis', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          ],
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Stats Row
            Row(
              children: [
                Expanded(child: _buildStatCard(Icons.inventory_2, Colors.purpleAccent, 'TOTAL', '12', 'Colis envoyés (Année)')),
                const SizedBox(width: 12),
                Expanded(child: _buildStatCard(Icons.access_time, Colors.amber, 'ACTIF', '1', 'En cours d\'expédition')),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(child: _buildStatCard(Icons.check_circle, Colors.greenAccent, '', '11', 'Colis livrés')),
                const SizedBox(width: 12),
                Expanded(child: _buildStatCard(Icons.local_shipping, Colors.blueAccent, '', '15kg', 'Franchise restante')),
              ],
            ),
            const SizedBox(height: 32),

            // Action Card: Send via Allo Dakar
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Colors.orangeAccent, Colors.pinkAccent],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(color: Colors.orangeAccent.withOpacity(0.3), blurRadius: 15, offset: const Offset(0, 5)),
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
                  const Text('Gérez et suivez l\'expédition de vos colis à travers le pays.', style: TextStyle(color: Colors.white54, fontSize: 13)),
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
                        foregroundColor: Colors.orangeAccent,
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
                  colors: [Colors.deepPurpleAccent, Colors.indigo],
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
                  const Text('Entrez le numéro de suivi pour connaître son statut en temps réel.', style: TextStyle(color: Colors.white70, fontSize: 14)),
                  const SizedBox(height: 16),
                  Container(
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.white30),
                    ),
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                    child: TextField(
                      controller: searchController,
                      style: const TextStyle(color: Colors.white),
                      decoration: const InputDecoration(
                        icon: Icon(Icons.search, color: Colors.white70),
                        border: InputBorder.none,
                        hintText: 'Ex: COL-894-D15',
                        hintStyle: TextStyle(color: Colors.white54),
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
                      child: const Text('Rechercher', style: TextStyle(color: Colors.deepPurple, fontWeight: FontWeight.bold)),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 40),

            // Active Parcels List
            const Text('Colis Récents', style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            
            ...localColis.map((c) => Column(
              children: [
                _buildParcelItem(
                  icon: Icons.local_shipping,
                  iconColor: Colors.amber,
                  title: c['trajet'] ?? 'Trajet Inconnu',
                  status: (c['statut'] ?? 'En attente').toString().toUpperCase(),
                  statusColor: Colors.amber,
                  ref: 'Réf: ${c['id']} • ${c['taille']} • ${c['date']}',
                  dest: c['destinataire'] ?? 'Inconnu',
                  phone: c['tel'] ?? '',
                  showProgress: true,
                  actionLabel: 'Détails / Suivre',
                  onTapAction: () => _showTrackingModal(c),
                ),
                const SizedBox(height: 16),
              ],
            )).toList(),
            
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
            const SizedBox(height: 16),
            
            // Delivered Parcel
            Opacity(
              opacity: 0.6,
              child: _buildParcelItem(
                icon: Icons.check_circle,
                iconColor: Colors.greenAccent,
                title: 'Dakar ➔ Thiès',
                status: 'LIVRÉ',
                statusColor: Colors.greenAccent,
                ref: 'Réf: COL-112-A89 • 5 kg • Il y a 3 jours',
                dest: 'Aminata Fall',
                phone: null,
                showProgress: false,
                actionLabel: 'Reçu',
                onTapAction: () => _showTrackingModal({'id': 'COL-112-A89', 'statut': 'Livré', 'destinataire': 'Aminata Fall', 'tel': '+221 77 000 00 00', 'date': 'Il y a 3 jours', 'trajet': 'Dakar → Thiès'}),
              ),
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }


  Widget _buildStatCard(IconData icon, Color color, String badge, String value, String label) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF0F172A),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white10),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(icon, color: color, size: 20),
              ),
              if (badge.isNotEmpty)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: color.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(badge, style: TextStyle(color: color, fontSize: 9, fontWeight: FontWeight.bold)),
                ),
            ],
          ),
          const SizedBox(height: 16),
          Text(value, style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.w900)),
          const SizedBox(height: 4),
          Text(label, style: const TextStyle(color: Colors.white54, fontSize: 11, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  Widget _buildParcelItem({
    required IconData icon,
    required Color iconColor,
    required String title,
    required String status,
    required Color statusColor,
    required String ref,
    required String dest,
    String? phone,
    required bool showProgress,
    required String actionLabel,
    required VoidCallback onTapAction,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF0F172A),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: statusColor.withOpacity(0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: iconColor.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Icon(icon, color: iconColor, size: 24),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                    const SizedBox(height: 4),
                    Text(ref, style: const TextStyle(color: Colors.white54, fontSize: 12)),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: statusColor.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(6),
                  border: Border.all(color: statusColor.withOpacity(0.3)),
                ),
                child: Text(status, style: TextStyle(color: statusColor, fontSize: 10, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
          if (showProgress) ...[
            const SizedBox(height: 20),
            Stack(
              children: [
                Container(
                  margin: const EdgeInsets.only(top: 4),
                  height: 4,
                  width: double.infinity,
                  decoration: BoxDecoration(color: Colors.white10, borderRadius: BorderRadius.circular(2)),
                ),
                Container(
                  margin: const EdgeInsets.only(top: 4),
                  height: 4,
                  width: 150,
                  decoration: BoxDecoration(color: iconColor, borderRadius: BorderRadius.circular(2)),
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('DÉPÔT', style: TextStyle(color: Colors.white54, fontSize: 9, fontWeight: FontWeight.bold)),
                    Text('EN ROUTE', style: TextStyle(color: iconColor, fontSize: 9, fontWeight: FontWeight.bold)),
                    const Text('LIVRÉ', style: TextStyle(color: Colors.white54, fontSize: 9, fontWeight: FontWeight.bold)),
                  ],
                ),
              ],
            ),
          ],
          const SizedBox(height: 16),
          const Divider(color: Colors.white10),
          const SizedBox(height: 12),
          Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Destinataire', style: TextStyle(color: Colors.white54, fontSize: 12)),
                    const SizedBox(height: 2),
                    Text(dest, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                    if (phone != null) ...[
                      const SizedBox(height: 2),
                      Text(phone, style: const TextStyle(color: Colors.white70, fontSize: 12)),
                    ],
                  ],
                ),
              ),
              ElevatedButton(
                onPressed: onTapAction,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF1E293B),
                  foregroundColor: Colors.white,
                  elevation: 0,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
                child: Text(actionLabel, style: const TextStyle(fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
