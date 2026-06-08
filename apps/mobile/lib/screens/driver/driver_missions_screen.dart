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
      case 'à venir': return const Color(0xFFF97316);
      case 'terminé': return const Color(0xFF10B981);
      case 'programmé': return const Color(0xFF3B82F6);
      case 'en cours': return const Color(0xFFA855F7);
      default: return Colors.white54;
    }
  }

  void _showCreateMissionBottomSheet(BuildContext context) {
    String? originCity;
    String? destinationCity;
    String date = '';
    String time = '';
    String price = '';
    String capacity = '';
    bool isAirConditioned = true;
    bool takesTollRoad = true;

    final List<String> cities = ['Dakar', 'Touba', 'Thiès', 'Saint-Louis', 'Kaolack', 'Ziguinchor', 'Mbour', 'Diourbel', 'Tambacounda'];

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (BuildContext context, StateSetter setModalState) {
            return Container(
              height: MediaQuery.of(context).size.height * 0.85,
              decoration: const BoxDecoration(
                color: Color(0xFF141414),
                borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
              ),
              child: Column(
                children: [
                  Container(
                    margin: const EdgeInsets.only(top: 12, bottom: 24),
                    width: 40,
                    height: 5,
                    decoration: BoxDecoration(
                      color: Colors.white24,
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                  const Text('Proposer un trajet', style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 24),
                  Expanded(
                    child: SingleChildScrollView(
                      padding: const EdgeInsets.symmetric(horizontal: 24),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Expanded(
                                child: _buildDropdown('Départ', originCity, cities, (v) => setModalState(() => originCity = v!)),
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: _buildDropdown('Arrivée', destinationCity, cities, (v) => setModalState(() => destinationCity = v!)),
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
                          Row(
                            children: [
                              Expanded(
                                child: _buildTextField('Date', date, (v) => date = v, icon: Icons.calendar_today, hintText: 'ex: Demain'),
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: _buildTextField('Heure', time, (v) => time = v, icon: Icons.access_time, hintText: 'ex: 14:30'),
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
                          Row(
                            children: [
                              Expanded(
                                child: _buildTextField('Prix unitaire (FCFA)', price, (v) => price = v, icon: Icons.payments_outlined, keyboardType: TextInputType.number, hintText: 'ex: 5000'),
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: _buildTextField('Capacité (places)', capacity, (v) => capacity = v, icon: Icons.people_outline, keyboardType: TextInputType.number, hintText: 'ex: 50'),
                              ),
                            ],
                          ),
                          const SizedBox(height: 24),
                          Row(
                            children: [
                              Expanded(
                                child: InkWell(
                                  onTap: () => setModalState(() => isAirConditioned = !isAirConditioned),
                                  child: Row(
                                    children: [
                                      Checkbox(
                                        value: isAirConditioned,
                                        onChanged: (val) => setModalState(() => isAirConditioned = val ?? false),
                                        activeColor: const Color(0xFFF97316),
                                        side: const BorderSide(color: Color(0xFF333333)),
                                      ),
                                      const Text('❄️ Climatisé', style: TextStyle(color: Colors.white, fontSize: 14)),
                                    ],
                                  ),
                                ),
                              ),
                              Expanded(
                                child: InkWell(
                                  onTap: () => setModalState(() => takesTollRoad = !takesTollRoad),
                                  child: Row(
                                    children: [
                                      Checkbox(
                                        value: takesTollRoad,
                                        onChanged: (val) => setModalState(() => takesTollRoad = val ?? false),
                                        activeColor: const Color(0xFFF97316),
                                        side: const BorderSide(color: Color(0xFF333333)),
                                      ),
                                      const Text('🛣️ Autoroute', style: TextStyle(color: Colors.white, fontSize: 14)),
                                    ],
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 32),
                          SizedBox(
                            width: double.infinity,
                            child: ElevatedButton(
                              onPressed: () {
                                setState(() {
                                  missions.insert(0, {
                                    'id': 'TRIP-NEW',
                                    'trajet': '${originCity ?? ''} → ${destinationCity ?? ''}',
                                    'date': date.isEmpty ? 'Non définie' : date,
                                    'heure': time.isEmpty ? 'Non définie' : time,
                                    'vehicule': 'Bus ${capacity.isEmpty ? '?' : capacity} Places',
                                    'statut': 'programmé',
                                    'passagers': 0,
                                    'placesLibres': int.tryParse(capacity) ?? 0,
                                    'isAirConditioned': isAirConditioned,
                                    'takesTollRoad': takesTollRoad,
                                  });
                                });
                                Navigator.pop(context);
                                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Trajet programmé avec succès !', style: TextStyle(color: Colors.white)), backgroundColor: Colors.green));
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFFEA580C),
                                foregroundColor: Colors.white,
                                padding: const EdgeInsets.symmetric(vertical: 16),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                              ),
                              child: const Text('Publier le trajet', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                            ),
                          ),
                          const SizedBox(height: 32),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  Widget _buildDropdown(String label, String? value, List<String> items, Function(String?) onChanged) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(color: Colors.white54, fontSize: 12)),
        const SizedBox(height: 8),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          decoration: BoxDecoration(
            color: const Color(0xFF0A0A0A),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: const Color(0xFF2A2A2A)),
          ),
          child: DropdownButtonHideUnderline(
            child: DropdownButton<String>(
              value: value,
              hint: const Text('Choisir', style: TextStyle(color: Colors.white24, fontSize: 14)),
              isExpanded: true,
              dropdownColor: const Color(0xFF141414),
              icon: const Icon(Icons.arrow_drop_down, color: Colors.white54),
              style: const TextStyle(color: Colors.white, fontSize: 14),
              onChanged: onChanged,
              items: items.map<DropdownMenuItem<String>>((String val) {
                return DropdownMenuItem<String>(
                  value: val,
                  child: Text(val),
                );
              }).toList(),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildTextField(String label, String initialValue, Function(String) onChanged, {IconData? icon, TextInputType? keyboardType, String? hintText}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(color: Colors.white54, fontSize: 12)),
        const SizedBox(height: 8),
        TextFormField(
          initialValue: initialValue,
          onChanged: onChanged,
          keyboardType: keyboardType,
          style: const TextStyle(color: Colors.white, fontSize: 14),
          decoration: InputDecoration(
            hintText: hintText,
            hintStyle: const TextStyle(color: Colors.white24, fontSize: 14),
            prefixIcon: icon != null ? Icon(icon, color: Colors.white54, size: 20) : null,
            filled: true,
            fillColor: const Color(0xFF0A0A0A),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFF2A2A2A))),
            enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFF2A2A2A))),
            focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFF97316))),
            contentPadding: const EdgeInsets.symmetric(vertical: 16, horizontal: 16),
          ),
        ),
      ],
    );
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
                    Icon(Icons.route, color: Color(0xFFF97316), size: 20),
                    SizedBox(width: 8),
                    Text('Mes Missions', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                  ],
                ),
                ElevatedButton.icon(
                  onPressed: () {
                    _showCreateMissionBottomSheet(context);
                  },
                  icon: const Icon(Icons.directions_car, size: 16),
                  label: const Text('Proposer un Trajet', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFEA580C),
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
                color: const Color(0xFFF43F5E).withOpacity(0.1),
                border: Border.all(color: const Color(0xFFF43F5E).withOpacity(0.3)),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Icon(Icons.warning_amber_rounded, color: Color(0xFFF43F5E), size: 20),
                  SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Attention, votre départ est dans moins d\'une heure !', style: TextStyle(color: Color(0xFFF43F5E), fontWeight: FontWeight.bold, fontSize: 13)),
                        SizedBox(height: 4),
                        Text('Les réservations automatiques sont bloquées si vous ne changez pas votre heure de départ. Préparez-vous à recevoir des appels.', style: TextStyle(color: Color(0xFFF43F5E), fontSize: 12)),
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
                        color: isSelected ? const Color(0xFFF97316) : const Color(0xFF141414),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: isSelected ? const Color(0xFFF97316) : const Color(0xFF2A2A2A)),
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
                                _buildActionButton(Icons.play_arrow, 'Démarrer trajet', const Color(0xFFEA580C), Colors.white, () {}),
                              if (mission['statut'] == 'en cours')
                                _buildActionButton(Icons.check_circle, 'Terminer trajet', const Color(0xFF059669), Colors.white, () {}),
                              _buildActionButton(Icons.location_on, 'Voir détails', const Color(0xFF1A1A1A), Colors.white, () {}, borderColor: const Color(0xFF333333)),
                              if (mission['statut'] == 'programmé')
                                _buildActionButton(Icons.access_time, 'Repousser +1h', const Color(0xFF4F46E5), Colors.white, () {}),
                              if (mission['statut'] == 'à venir' || mission['statut'] == 'en cours')
                                _buildActionButton(Icons.warning_amber_rounded, 'Signaler incident', const Color(0xFF1A1A1A), const Color(0xFFFBBF24), () {}, borderColor: const Color(0xFF333333)),
                              if (mission['statut'] == 'programmé' && mission['passagers'] == 0)
                                _buildActionButton(Icons.close, 'Supprimer', const Color(0xFF1A1A1A), const Color(0xFFF43F5E), () {}, borderColor: const Color(0xFF333333)),
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
