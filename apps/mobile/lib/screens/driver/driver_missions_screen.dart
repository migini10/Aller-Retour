import 'package:flutter/material.dart';

class DriverMissionsScreen extends StatefulWidget {
  const DriverMissionsScreen({super.key});

  @override
  State<DriverMissionsScreen> createState() => _DriverMissionsScreenState();
}

class _DriverMissionsScreenState extends State<DriverMissionsScreen> {
  String selectedTab = 'Toutes';
  final List<String> tabs = ['Toutes', 'Aujourd\'hui', 'Programmées', 'Historique'];

  final List<Map<String, dynamic>> missions = [
    { 'id': 'TRIP-402', 'trajet': 'Dakar → Touba', 'date': 'Aujourd\'hui', 'heure': '14:30', 'vehicule': 'Bus 50 Places', 'statut': 'à venir', 'passagers': 45, 'placesLibres': 5, 'isAirConditioned': true, 'takesTollRoad': true },
    { 'id': 'TRIP-398', 'trajet': 'Thiès → Dakar', 'date': 'Aujourd\'hui', 'heure': '08:00', 'vehicule': 'Bus 50 Places', 'statut': 'terminé', 'passagers': 48, 'placesLibres': 2, 'isAirConditioned': true, 'takesTollRoad': true },
    { 'id': 'TRIP-405', 'trajet': 'Dakar → Saint-Louis', 'date': 'Demain', 'heure': '07:00', 'vehicule': 'Bus 50 Places', 'statut': 'programmé', 'passagers': 0, 'placesLibres': 50, 'isAirConditioned': true, 'takesTollRoad': false },
  ];

  Color _getStatutColor(String statut) {
    switch (statut) {
      case 'à venir': return Colors.orangeAccent;
      case 'terminé': return Colors.greenAccent;
      case 'programmé': return Colors.blueAccent;
      case 'en cours': return Colors.purpleAccent;
      default: return Colors.white54;
    }
  }

  @override
  Widget build(BuildContext context) {
    List<Map<String, dynamic>> filteredMissions = missions.where((m) {
      if (selectedTab == 'Toutes') return m['statut'] != 'terminé';
      if (selectedTab == 'Aujourd\'hui') return m['date'] == 'Aujourd\'hui' && m['statut'] != 'terminé';
      if (selectedTab == 'Programmées') return m['statut'] == 'programmé' || m['statut'] == 'à venir';
      if (selectedTab == 'Historique') return m['statut'] == 'terminé';
      return true;
    }).toList();

    return Scaffold(
      backgroundColor: const Color(0xFF020617),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text('Missions & Trajets', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
        centerTitle: true,
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header with Create button
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Row(
                  children: [
                    Icon(Icons.route, color: Colors.orangeAccent, size: 20),
                    SizedBox(width: 8),
                    Text('Mes Missions', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                  ],
                ),
                ElevatedButton.icon(
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Ouverture du formulaire de création Allo Dakar')));
                  },
                  icon: const Icon(Icons.directions_car, size: 16),
                  label: const Text('Proposer un Trajet', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.orangeAccent,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  ),
                ),
              ],
            ),
          ),
          
          // Urgent Alert
          if (filteredMissions.any((m) => m['statut'] == 'programmé' && m['date'] == 'Aujourd\'hui'))
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.redAccent.withOpacity(0.1),
                border: Border.all(color: Colors.redAccent.withOpacity(0.3)),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Row(
                children: [
                  Icon(Icons.warning_amber_rounded, color: Colors.redAccent, size: 24),
                  SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Attention, départ imminent !', style: TextStyle(color: Colors.redAccent, fontWeight: FontWeight.bold, fontSize: 13)),
                        Text('Préparez-vous à recevoir des appels.', style: TextStyle(color: Colors.redAccent, fontSize: 12)),
                      ],
                    ),
                  ),
                ],
              ),
            ),

          // Tabs
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Row(
              children: tabs.map((t) {
                final isSelected = selectedTab == t;
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: InkWell(
                    onTap: () => setState(() => selectedTab = t),
                    borderRadius: BorderRadius.circular(12),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      decoration: BoxDecoration(
                        color: isSelected ? Colors.orangeAccent : const Color(0xFF141414),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: isSelected ? Colors.orangeAccent : const Color(0xFF2A2A2A)),
                      ),
                      child: Text(t, style: TextStyle(
                        color: isSelected ? Colors.black : Colors.white54,
                        fontWeight: FontWeight.bold,
                        fontSize: 13,
                      )),
                    ),
                  ),
                );
              }).toList(),
            ),
          ),
          const SizedBox(height: 16),
          // List
          Expanded(
            child: filteredMissions.isEmpty
              ? const Center(child: Text('Aucune mission pour cette catégorie', style: TextStyle(color: Colors.white54)))
              : ListView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: filteredMissions.length,
                  itemBuilder: (context, index) {
                    final mission = filteredMissions[index];
                    final statutColor = _getStatutColor(mission['statut']);

                    return Container(
                      margin: const EdgeInsets.only(bottom: 16),
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: const Color(0xFF141414),
                        borderRadius: BorderRadius.circular(24),
                        border: Border.all(color: const Color(0xFF2A2A2A)),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(mission['id'], style: const TextStyle(color: Colors.white54, fontSize: 12, fontFamily: 'monospace')),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                decoration: BoxDecoration(
                                  color: statutColor.withOpacity(0.1),
                                  border: Border.all(color: statutColor.withOpacity(0.3)),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Text(mission['statut'], style: TextStyle(color: statutColor, fontSize: 10, fontWeight: FontWeight.bold)),
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),
                          Text(mission['trajet'], style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                          const SizedBox(height: 8),
                          Row(
                            children: [
                              const Icon(Icons.calendar_today, size: 14, color: Colors.white54),
                              const SizedBox(width: 6),
                              Text('${mission['date']} à ${mission['heure']}', style: const TextStyle(color: Colors.white54, fontSize: 13)),
                            ],
                          ),
                          const SizedBox(height: 4),
                          Row(
                            children: [
                              const Icon(Icons.directions_bus, size: 14, color: Colors.white54),
                              const SizedBox(width: 6),
                              Expanded(
                                child: Text('${mission['vehicule']} • ${mission['passagers']} passagers prévus ${mission['placesLibres'] != null ? '• ${mission['placesLibres']} places offertes' : ''}', style: const TextStyle(color: Colors.white54, fontSize: 13)),
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),
                          // Tags
                          Row(
                            children: [
                              if (mission['isAirConditioned'] == true)
                                Container(
                                  margin: const EdgeInsets.only(right: 8),
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: Colors.lightBlueAccent.withOpacity(0.1),
                                    border: Border.all(color: Colors.lightBlueAccent.withOpacity(0.2)),
                                    borderRadius: BorderRadius.circular(6),
                                  ),
                                  child: const Text('❄️ Climatisé', style: TextStyle(color: Colors.lightBlueAccent, fontSize: 10, fontWeight: FontWeight.bold)),
                                ),
                              if (mission['takesTollRoad'] == true)
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: Colors.indigoAccent.withOpacity(0.1),
                                    border: Border.all(color: Colors.indigoAccent.withOpacity(0.2)),
                                    borderRadius: BorderRadius.circular(6),
                                  ),
                                  child: const Text('🛣️ Autoroute', style: TextStyle(color: Colors.indigoAccent, fontSize: 10, fontWeight: FontWeight.bold)),
                                ),
                            ],
                          ),
                          const SizedBox(height: 20),
                          Wrap(
                            spacing: 8,
                            runSpacing: 8,
                            children: [
                              if (mission['statut'] == 'à venir')
                                _buildActionButton(Icons.play_arrow, 'Démarrer', Colors.orangeAccent, Colors.black, () {}),
                              if (mission['statut'] == 'en cours')
                                _buildActionButton(Icons.check_circle, 'Terminer', Colors.greenAccent, Colors.black, () {}),
                              _buildActionButton(Icons.visibility, 'Détails', const Color(0xFF1A1A1A), Colors.white, () {}, borderColor: const Color(0xFF333333)),
                              if (mission['statut'] == 'programmé')
                                _buildActionButton(Icons.access_time, 'Repousser +1h', Colors.indigoAccent, Colors.white, () {}),
                              if (mission['statut'] == 'à venir' || mission['statut'] == 'en cours')
                                _buildActionButton(Icons.warning, 'Signaler', Colors.amberAccent.withOpacity(0.1), Colors.amberAccent, () {}, borderColor: Colors.amberAccent.withOpacity(0.3)),
                              if (mission['statut'] == 'programmé' && mission['passagers'] == 0)
                                _buildActionButton(Icons.close, 'Supprimer', Colors.redAccent.withOpacity(0.1), Colors.redAccent, () {}, borderColor: Colors.redAccent.withOpacity(0.3)),
                            ],
                          ),
                        ],
                      ),
                    );
                  },
                ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionButton(IconData icon, String label, Color bgColor, Color textColor, VoidCallback onPressed, {Color? borderColor}) {
    return ElevatedButton.icon(
      onPressed: onPressed,
      icon: Icon(icon, size: 14),
      label: Text(label, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11)),
      style: ElevatedButton.styleFrom(
        backgroundColor: bgColor,
        foregroundColor: textColor,
        side: borderColor != null ? BorderSide(color: borderColor) : BorderSide.none,
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        elevation: 0,
      ),
    );
  }
}
