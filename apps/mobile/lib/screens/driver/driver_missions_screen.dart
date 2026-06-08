import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class DriverMissionsScreen extends StatefulWidget {
  const DriverMissionsScreen({super.key});

  @override
  State<DriverMissionsScreen> createState() => _DriverMissionsScreenState();
}

class _DriverMissionsScreenState extends State<DriverMissionsScreen> {
  String selectedTab = 'Toutes';
  final List<String> tabs = ['Toutes', 'Aujourd\'hui', 'Programmées', 'Historique'];

  List<Map<String, dynamic>> missions = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchMissions();
  }

  Future<void> _fetchMissions() async {
    try {
      final res = await http.get(Uri.parse('http://localhost:3000/api/missions'));
      if (res.statusCode == 200) {
        final List<dynamic> data = json.decode(res.body);
        List<Map<String, dynamic>> fetchedMissions = data.map((m) {
          String dateStr = "Aujourd'hui";
          String heureStr = "12:00";
          
          if (m['departureTime'] != null) {
            try {
              DateTime d = DateTime.parse(m['departureTime']).toLocal();
              DateTime now = DateTime.now();
              DateTime today = DateTime(now.year, now.month, now.day);
              DateTime tomorrow = today.add(const Duration(days: 1));
              DateTime tripDay = DateTime(d.year, d.month, d.day);
              
              if (tripDay == today) {
                dateStr = "Aujourd'hui";
              } else if (tripDay == tomorrow) {
                dateStr = "Demain";
              } else {
                List<String> jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
                List<String> mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
                String dayName = jours[d.weekday - 1];
                String dayStr = d.day == 1 ? '1er' : d.day.toString();
                String monthName = mois[d.month - 1];
                dateStr = '$dayName $dayStr $monthName';
              }
              heureStr = '${d.hour.toString().padLeft(2, '0')}:${d.minute.toString().padLeft(2, '0')}';
            } catch (e) {
              String depart = m['depart'] ?? '';
              if (depart.contains(', ')) {
                List<String> parts = depart.split(', ');
                dateStr = parts[0];
                heureStr = parts[1];
              } else {
                heureStr = depart;
              }
            }
          } else {
            String depart = m['depart'] ?? '';
            if (depart.contains(', ')) {
              List<String> parts = depart.split(', ');
              dateStr = parts[0];
              heureStr = parts[1];
            } else if (depart.contains(' à ')) {
              List<String> parts = depart.split(' à ');
              dateStr = parts[0];
              heureStr = parts[1];
            } else {
              RegExp timeRegex = RegExp(r'\d{2}:\d{2}');
              var match = timeRegex.firstMatch(depart);
              if (match != null) {
                 heureStr = match.group(0)!;
                 dateStr = depart.replaceAll(heureStr, '').trim();
                 if (dateStr.isEmpty) dateStr = "Aujourd'hui";
              } else {
                 dateStr = depart;
              }
            }
          }
          return {
            'id': m['tripId'] ?? m['id'] ?? 'TRIP-XXX',
            'displayId': m['id'] ?? 'TRIP-XXX',
            'trajet': m['trajet'] ?? 'Inconnu',
            'date': dateStr,
            'rawDate': m['departureTime'] != null ? m['departureTime'].toString().split('T')[0] : null,
            'heure': heureStr,
            'vehicule': m['transporteur'] ?? 'Véhicule',
            'statut': m['status'] ?? 'programmé',
            'passagers': m['passagers'] ?? 0,
            'placesLibres': m['placesLibres'] ?? 4,
            'placesPrises': m['placesPrises'] ?? 0,
            'isAirConditioned': m['isAirConditioned'] ?? true,
            'takesTollRoad': m['takesTollRoad'] ?? true,
            'pricePerSeat': m['pricePerSeat'] ?? 5000,
          };
        }).toList();

        if (mounted) {
          setState(() {
            missions = fetchedMissions;
            isLoading = false;
          });
        }
      } else {
        _loadFallbackData();
      }
    } catch (e) {
      _loadFallbackData();
    }
  }

  void _loadFallbackData() {
    if (mounted) {
      setState(() {
        missions = [
          { 'id': 'TRIP-402', 'displayId': 'TRIP-402', 'trajet': 'Dakar → Touba', 'date': 'Aujourd\'hui', 'heure': '14:30', 'vehicule': 'Bus 50 Places', 'statut': 'à venir', 'passagers': 45, 'placesLibres': 5, 'placesPrises': 45, 'isAirConditioned': true, 'takesTollRoad': true, 'pricePerSeat': 5000 },
          { 'id': 'TRIP-398', 'displayId': 'TRIP-398', 'trajet': 'Thiès → Dakar', 'date': 'Aujourd\'hui', 'heure': '08:00', 'vehicule': 'Bus 50 Places', 'statut': 'terminé', 'passagers': 48, 'placesLibres': 2, 'placesPrises': 48, 'isAirConditioned': true, 'takesTollRoad': true, 'pricePerSeat': 5000 },
          { 'id': 'TRIP-405', 'displayId': 'TRIP-405', 'trajet': 'Dakar → Saint-Louis', 'date': 'Demain', 'heure': '07:00', 'vehicule': 'Bus 50 Places', 'statut': 'programmé', 'passagers': 0, 'placesLibres': 50, 'placesPrises': 0, 'isAirConditioned': true, 'takesTollRoad': false, 'pricePerSeat': 5000 },
        ];
        isLoading = false;
      });
    }
  }

  Color _getStatutColor(String statut) {
    switch (statut) {
      case 'à venir': return const Color(0xFFF97316);
      case 'terminé': return const Color(0xFF10B981);
      case 'programmé': return const Color(0xFF3B82F6);
      case 'en cours': return const Color(0xFFA855F7);
      default: return Colors.white54;
    }
  }

  bool _isTripInPast(Map<String, dynamic> m) {
    if (m['departureTime'] != null) {
      try {
        DateTime d = DateTime.parse(m['departureTime']).toLocal();
        return d.isBefore(DateTime.now());
      } catch (e) {}
    }
    try {
      final now = DateTime.now();
      final today = DateTime(now.year, now.month, now.day);
      if (m['date'] == "Aujourd'hui") {
        if (m['heure'] != null) {
          final parts = m['heure'].split(':');
          final h = int.parse(parts[0]);
          final min = int.parse(parts[1]);
          final tripTime = DateTime(now.year, now.month, now.day, h, min);
          return tripTime.isBefore(now);
        }
        return false;
      }
      if (m['date'] == "Demain") {
        return false;
      }
      final dateVal = m['rawDate'] ?? m['date'];
      if (dateVal != null) {
        final parsedDate = DateTime.parse(dateVal);
        final tripDay = DateTime(parsedDate.year, parsedDate.month, parsedDate.day);
        if (tripDay.isBefore(today)) return true;
        if (tripDay == today && m['heure'] != null) {
          final parts = m['heure'].split(':');
          final h = int.parse(parts[0]);
          final min = int.parse(parts[1]);
          final tripTime = DateTime(now.year, now.month, now.day, h, min);
          return tripTime.isBefore(now);
        }
      }
    } catch (e) {}
    return false;
  }

  List<Map<String, String>> _getAvailableDates() {
    List<Map<String, String>> dates = [];
    DateTime base = DateTime.now();
    List<String> jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    List<String> mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    
    for (int i = 0; i < 7; i++) {
      DateTime d = base.add(Duration(days: i));
      String val = d.toIso8601String().split('T')[0];
      String dayName = jours[d.weekday - 1];
      String dayStr = d.day == 1 ? '1er' : d.day.toString();
      String monthName = mois[d.month - 1];
      dates.add({'value': val, 'label': '$dayName $dayStr $monthName'});
    }
    return dates;
  }

  List<String> _getAvailableHours(String? selectedDate) {
    List<String> hours = [];
    DateTime now = DateTime.now();
    String todayStr = now.toIso8601String().split('T')[0];
    bool isToday = selectedDate == todayStr || selectedDate == "Aujourd'hui";

    int currentTotalMinutes = now.hour * 60 + now.minute;
    const int MARGIN_MINUTES = 60;

    for (int i = 0; i < 24; i++) {
      String hourStr = i.toString().padLeft(2, '0');
      
      int slot00TotalMinutes = i * 60;
      if (!isToday || slot00TotalMinutes >= currentTotalMinutes + MARGIN_MINUTES) {
        hours.add('$hourStr:00');
      }
      
      int slot30TotalMinutes = i * 60 + 30;
      if (!isToday || slot30TotalMinutes >= currentTotalMinutes + MARGIN_MINUTES) {
        hours.add('$hourStr:30');
      }
    }
    return hours;
  }

  void _showCreateMissionBottomSheet(BuildContext context, {Map<String, dynamic>? missionToEdit}) {
    String? originCity;
    String? destinationCity;
    if (missionToEdit != null && missionToEdit['trajet'] != null) {
      String trajet = missionToEdit['trajet'];
      String separator = trajet.contains('→') ? '→' : trajet.contains('->') ? '->' : trajet.contains(' - ') ? ' - ' : '-';
      List<String> parts = trajet.split(separator);
      if (parts.isNotEmpty) originCity = parts[0].trim();
      if (parts.length > 1) destinationCity = parts[1].trim();
    }
    
    String? date = missionToEdit != null ? (missionToEdit['rawDate'] ?? missionToEdit['date']) : null;
    if (date == "Aujourd'hui") {
      final now = DateTime.now();
      date = "${now.year}-${now.month.toString().padLeft(2, '0')}-${now.day.toString().padLeft(2, '0')}";
    } else if (date == "Demain") {
      final tomorrow = DateTime.now().add(const Duration(days: 1));
      date = "${tomorrow.year}-${tomorrow.month.toString().padLeft(2, '0')}-${tomorrow.day.toString().padLeft(2, '0')}";
    }

    String? time = missionToEdit != null ? missionToEdit['heure'] : null;
    bool isAirConditioned = missionToEdit != null ? (missionToEdit['isAirConditioned'] ?? true) : true;
    bool takesTollRoad = missionToEdit != null ? (missionToEdit['takesTollRoad'] ?? true) : true;
    
    String? vehicleCapacity;
    if (missionToEdit != null && missionToEdit['vehicule'] != null) {
      final match = RegExp(r'\d+').firstMatch(missionToEdit['vehicule']);
      if (match != null) {
        vehicleCapacity = match.group(0);
      }
    }

    final TextEditingController placesController = TextEditingController(text: missionToEdit != null ? missionToEdit['placesLibres']?.toString() : '');
    final TextEditingController priceController = TextEditingController(text: missionToEdit != null ? (missionToEdit['pricePerSeat'] ?? 5000).toString() : '5000');
    final TextEditingController passagersController = TextEditingController(text: missionToEdit != null ? missionToEdit['passagers']?.toString() ?? '0' : '0');

    final List<String> cities = ['Dakar', 'Touba', 'Thiès', 'Saint-Louis', 'Kaolack', 'Ziguinchor', 'Mbour', 'Diourbel', 'Tambacounda'];

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (BuildContext context, StateSetter setModalState) {
            final List<Map<String, String>> availableDates = _getAvailableDates();
            if (date != null && !availableDates.any((d) => d['value'] == date)) {
              try {
                DateTime parsedDate = DateTime.parse(date!);
                List<String> jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
                List<String> mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
                String dayName = jours[parsedDate.weekday - 1];
                String dayStr = parsedDate.day == 1 ? '1er' : parsedDate.day.toString();
                String monthName = mois[parsedDate.month - 1];
                availableDates.insert(0, {'value': date!, 'label': '$dayName $dayStr $monthName'});
              } catch (e) {
                availableDates.insert(0, {'value': date!, 'label': date!});
              }
            }

            final List<String> availableHours = _getAvailableHours(date);
            if (time != null && !availableHours.contains(time)) {
              availableHours.insert(0, time!);
            }

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
                  Text(missionToEdit != null ? 'Modifier le trajet' : 'Proposer un trajet', style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
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
                                child: _buildDropdownObj('Date', date, availableDates, (v) {
                                  setModalState(() {
                                    date = v;
                                    time = null;
                                  });
                                }),
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: _buildDropdown('Heure', time, availableHours, (v) {
                                  setModalState(() { time = v; });
                                }),
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
                          Row(
                            children: [
                              Expanded(
                                child: _buildDropdownObj('Type de Voiture', vehicleCapacity, [
                                  {'value': '5', 'label': 'Voiture 5 places'},
                                  {'value': '7', 'label': 'Voiture 7 places'},
                                ], (v) {
                                  setModalState(() { vehicleCapacity = v; });
                                }),
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: _buildTextFieldController('Places Disponibles', placesController, icon: Icons.people_outline, keyboardType: TextInputType.number, hintText: 'ex: 4'),
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
                          Row(
                            children: [
                              Expanded(
                                child: _buildTextFieldController('Prix par place (FCFA)', priceController, icon: Icons.payments_outlined, keyboardType: TextInputType.number, hintText: 'ex: 5000'),
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: _buildTextFieldController('Passagers prévus', passagersController, icon: Icons.people_outline, keyboardType: TextInputType.number, hintText: 'ex: 0'),
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
                              onPressed: () async {
                                String placesLibres = placesController.text;
                                String price = priceController.text;
                                
                                if (originCity == null || destinationCity == null || date == null || time == null || vehicleCapacity == null || placesLibres.isEmpty || price.isEmpty) {
                                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Veuillez remplir tous les champs obligatoires'), backgroundColor: Colors.redAccent));
                                  return;
                                }
                                
                                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Création en cours...'), backgroundColor: Colors.blueAccent, duration: Duration(seconds: 1)));

                                String departureTime = "${date}T$time:00Z";

                                try {
                                  final url = missionToEdit != null ? 'http://localhost:3000/api/missions/${missionToEdit['id']}' : 'http://localhost:3000/api/missions';
                                  final requestFunc = missionToEdit != null ? http.patch : http.post;
                                  final res = await requestFunc(
                                    Uri.parse(url),
                                    headers: {'Content-Type': 'application/json'},
                                    body: json.encode({
                                      'originCity': originCity,
                                      'destinationCity': destinationCity,
                                      'pricePerSeat': int.tryParse(price) ?? 0,
                                      'departureTime': departureTime,
                                      'placesLibres': int.tryParse(placesLibres) ?? 0,
                                      'vehicleCapacity': int.tryParse(vehicleCapacity!) ?? 0,
                                      'isAirConditioned': isAirConditioned,
                                      'takesTollRoad': takesTollRoad,
                                      'passagers': int.tryParse(passagersController.text) ?? 0,
                                    }),
                                  );

                                  if (res.statusCode == 200 || res.statusCode == 201) {
                                    _fetchMissions();
                                    Navigator.pop(context);
                                    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Trajet créé avec succès via API !', style: TextStyle(color: Colors.white)), backgroundColor: Colors.green));
                                  } else {
                                    throw Exception('API error');
                                  }
                                } catch(e) {
                                  // Fallback si serveur éteint
                                  setState(() {
                                    missions.insert(0, {
                                      'id': 'TRIP-NEW',
                                      'trajet': '$originCity → $destinationCity',
                                      'date': date,
                                      'heure': time,
                                      'vehicule': 'Voiture $vehicleCapacity Places',
                                      'statut': 'programmé',
                                      'passagers': int.tryParse(passagersController.text) ?? 0,
                                      'placesLibres': int.tryParse(placesLibres) ?? 0,
                                      'isAirConditioned': isAirConditioned,
                                      'takesTollRoad': takesTollRoad,
                                    });
                                  });
                                  Navigator.pop(context);
                                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Mode Hors Ligne : Trajet ajouté localement', style: TextStyle(color: Colors.white)), backgroundColor: Colors.orangeAccent));
                                }
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFFEA580C),
                                foregroundColor: Colors.white,
                                padding: const EdgeInsets.symmetric(vertical: 16),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                              ),
                              child: Text(missionToEdit != null ? 'Modifier le trajet' : 'Publier le trajet', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
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

  Widget _buildDropdownObj(String label, String? value, List<Map<String, String>> items, Function(String?) onChanged) {
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
              items: items.map<DropdownMenuItem<String>>((Map<String, String> val) {
                return DropdownMenuItem<String>(
                  value: val['value'],
                  child: Text(val['label']!),
                );
              }).toList(),
            ),
          ),
        ),
      ],
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
            child: isLoading 
              ? const Center(child: CircularProgressIndicator(color: Color(0xFFF97316)))
              : filteredMissions.isEmpty
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
                                child: Text('${mission['vehicule']} • ${mission['passagers']} passagers prévus • ${mission['placesPrises'] ?? 0} places prises • ${mission['placesLibres'] ?? 0} places offertes', style: const TextStyle(color: Colors.white54, fontSize: 13)),
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
                              _buildActionButton(Icons.location_on, 'Voir détails', const Color(0xFF1A1A1A), Colors.white, () {
                                _showMissionDetailsDialog(context, mission);
                              }, borderColor: const Color(0xFF333333)),
                              if (mission['statut'] == 'programmé')
                                _buildActionButton(Icons.access_time, 'Repousser +1h', const Color(0xFF4F46E5), Colors.white, () {}),
                              if (mission['statut'] == 'programmé' || mission['statut'] == 'à venir')
                                _buildActionButton(Icons.edit, 'Modifier', const Color(0xFF2563EB), Colors.white, () {
                                  _showCreateMissionBottomSheet(context, missionToEdit: mission);
                                }),
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

  void _showMissionDetailsDialog(BuildContext context, Map<String, dynamic> mission) {
    showDialog(
      context: context,
      builder: (ctx) {
        final statutColor = _getStatutColor(mission['statut']);
        return Dialog(
          backgroundColor: const Color(0xFF141414),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(mission['displayId'] ?? mission['id'], style: const TextStyle(color: Colors.white54, fontSize: 13, fontFamily: 'monospace')),
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
                const SizedBox(height: 16),
                Text(mission['trajet'], style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                Row(
                  children: [
                    const Icon(Icons.access_time, color: Color(0xFFF97316), size: 16),
                    const SizedBox(width: 8),
                    Text('${mission['date']} à ${mission['heure']}', style: const TextStyle(color: Colors.white70, fontSize: 14)),
                  ],
                ),
                const Divider(color: Color(0xFF2A2A2A), height: 32),
                _buildDetailRow('Véhicule', mission['vehicule']),
                _buildDetailRow('Prix de la place', '${mission['pricePerSeat'] ?? 5000} FCFA'),
                _buildDetailRow('Places offertes', '${(mission['placesLibres'] ?? 0) + (mission['placesPrises'] ?? 0)} places'),
                _buildDetailRow('Places réservées', '${mission['placesPrises'] ?? 0} places'),
                _buildDetailRow('Places restantes', '${mission['placesLibres'] ?? 0} places', valueColor: const Color(0xFF10B981)),
                _buildDetailRow('Passagers prévus', '${mission['passagers'] ?? 0} passagers'),
                const SizedBox(height: 16),
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
                const SizedBox(height: 24),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () => Navigator.pop(ctx),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF2A2A2A),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      padding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                    child: const Text('Fermer', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildDetailRow(String label, String value, {Color? valueColor}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: Colors.white54, fontSize: 13)),
          Text(value, style: TextStyle(color: valueColor ?? Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
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

  Widget _buildTextFieldController(String label, TextEditingController controller, {required IconData icon, TextInputType keyboardType = TextInputType.text, String hintText = ''}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(color: Colors.white54, fontSize: 12)),
        const SizedBox(height: 8),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          decoration: BoxDecoration(
            color: const Color(0xFF000000),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: const Color(0xFF333333)),
          ),
          child: Row(
            children: [
              Icon(icon, color: Colors.white54, size: 20),
              const SizedBox(width: 12),
              Expanded(
                child: TextField(
                  controller: controller,
                  keyboardType: keyboardType,
                  style: const TextStyle(color: Colors.white, fontSize: 14),
                  decoration: InputDecoration(
                    border: InputBorder.none,
                    hintText: hintText,
                    hintStyle: const TextStyle(color: Colors.white24),
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
