import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import '../../models/trip_model.dart';
import '../../services/api_client.dart';
import 'package:aller_retour_mobile/screens/driver/driver_live_tracking_screen.dart' as driver_live_tracking_screen;
import 'package:aller_retour_mobile/screens/driver/driver_colis_screen.dart';

class DriverMissionsScreen extends StatefulWidget {
  const DriverMissionsScreen({super.key});

  @override
  State<DriverMissionsScreen> createState() => _DriverMissionsScreenState();
}

class _DriverMissionsScreenState extends State<DriverMissionsScreen> {
  String selectedTab = 'Programmées';
  final List<String> tabs = ['Programmées', 'Toutes', 'Aujourd\'hui', 'Historique'];

  List<Map<String, dynamic>> missions = [];
  List<Map<String, dynamic>> filteredMissions = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchMissions();
  }

  Future<void> _fetchMissions() async {
    try {
      final res = await ApiClient().get('/v1/trips/driver/me');
      if (res.statusCode == 200) {
        final List<dynamic> data = json.decode(res.body);
        List<Map<String, dynamic>> fetchedMissions = data.map((m) {
          final tripModel = TripModel.fromJson(m);
          return tripModel.toLegacyMap();
        }).toList();

        if (mounted) {
          setState(() {
      missions = fetchedMissions;
            filteredMissions = missions;
            isLoading = false;
    });
        }
      } else {
        _loadFallbackData();
      }
    } on ApiException catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Erreur API: ${e.message}')),
        );
        setState(() => isLoading = false);
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
      case 'expiré': return const Color(0xFFF43F5E); // Red for expired
      default: return Colors.white54;
    }
  }

  bool _isUrgentAndNotReady(Map<String, dynamic> m) {
    if (m['statut'] != 'programmé') return false;
    if (m['date'] != 'Aujourd\'hui') return false;
    if (m['heure'] == null) return false;
    try {
      final now = DateTime.now();
      final parts = m['heure'].toString().split(':');
      final h = int.parse(parts[0]);
      final min = int.parse(parts[1]);
      final tripTime = DateTime(now.year, now.month, now.day, h, min);
      final diffMinutes = tripTime.difference(now).inMinutes;
      return diffMinutes >= 0 && diffMinutes < 60;
    } catch (e) {}
    return false;
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

  List<int> _dynamicRecommendedPrices = [];

  Future<void> _fetchPopularPrices(String? origin, String? dest, StateSetter setModalState) async {
    if (origin == null || dest == null) return;
    try {
      final response = await ApiClient().get(
        '/v1/trips/popular-prices?origin=$origin&destination=$dest',
      );
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['prices'] != null && data['prices'].isNotEmpty) {
          setModalState(() {
      _dynamicRecommendedPrices = List<int>.from(data['prices']);
    });
        } else {
          setModalState(() {
      _dynamicRecommendedPrices = [];
    });
        }
      }
    } on ApiException catch (e) {
      debugPrint('Error fetching popular prices API: ${e.message}');
      setModalState(() {
      _dynamicRecommendedPrices = [];
    });
    } catch (e) {
      debugPrint('Error fetching popular prices: $e');
      setModalState(() {
      _dynamicRecommendedPrices = [];
    });
    }
  }

  List<String> _getAvailableHours(String? selectedDate) {
    List<String> hours = [];
    DateTime now = DateTime.now();
    String todayStr = now.toIso8601String().split('T')[0];
    bool isToday = selectedDate == todayStr || selectedDate == "Aujourd'hui";

    int currentTotalMinutes = now.hour * 60 + now.minute;
    const int marginMinutes = 60;

    for (int i = 0; i < 24; i++) {
      String hourStr = i.toString().padLeft(2, '0');
      
      int slot00TotalMinutes = i * 60;
      if (!isToday || slot00TotalMinutes >= currentTotalMinutes + marginMinutes) {
        hours.add('$hourStr:00');
      }
      
      int slot30TotalMinutes = i * 60 + 30;
      if (!isToday || slot30TotalMinutes >= currentTotalMinutes + marginMinutes) {
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

    bool isLoading = false;
    bool _isPricesFetchedInit = false;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (BuildContext context, StateSetter setModalState) {
            if (!_isPricesFetchedInit && originCity != null && destinationCity != null) {
              _isPricesFetchedInit = true;
              _fetchPopularPrices(originCity, destinationCity, setModalState);
            }

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
              decoration: BoxDecoration(color: Theme.of(context).cardColor,
                borderRadius: const BorderRadius.vertical(top: Radius.circular(32)),
              ),
              child: Column(
                children: [
                  Container(
                    margin: const EdgeInsets.only(top: 12, bottom: 24),
                    width: 40,
                    height: 5,
                    decoration: BoxDecoration(
                      color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.24),
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                  Text(missionToEdit != null ? 'Modifier le trajet' : 'Proposer un trajet', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 20, fontWeight: FontWeight.bold)),
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
                                child: _buildDropdown('Départ', originCity, cities, (v) {
                                  setModalState(() => originCity = v!);
                                  _fetchPopularPrices(originCity, destinationCity, setModalState);
                                }), ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: _buildDropdown('Arrivée', destinationCity, cities, (v) {
                                  setModalState(() => destinationCity = v!);
                                  _fetchPopularPrices(originCity, destinationCity, setModalState);
                                }), ),
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
                                }), ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: _buildDropdown('Heure', time, availableHours, (v) {
                                  setModalState(() { time = v; });
                                }), ),
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
                                  setModalState(() {
                                    vehicleCapacity = v;
                                    if (v != null) {
                                      int cap = int.tryParse(v) ?? 5;
                                      int pax = int.tryParse(passagersController.text) ?? 0;
                                      int places = cap - 1 - pax;
                                      placesController.text = places > 0 ? places.toString() : '0';
                                    }
    });
                                }), ),
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
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    _buildTextFieldController('Prix par place (FCFA)', priceController, icon: Icons.payments_outlined, keyboardType: TextInputType.number, hintText: 'ex: 5000'),
                                    if (originCity != null && destinationCity != null && _dynamicRecommendedPrices.isNotEmpty)
                                      Padding(
                                        padding: const EdgeInsets.only(top: 8.0),
                                        child: Wrap(
                                          spacing: 6.0,
                                          runSpacing: 4.0,
                                          children: _dynamicRecommendedPrices.map((price) {
                                            return ActionChip(
                                              label: Text('$price FCFA', style: const TextStyle(fontSize: 11, color: Color(0xFFF97316), fontWeight: FontWeight.bold)),
                                              backgroundColor: const Color(0xFFF97316).withValues(alpha: 0.1),
                                              side: const BorderSide(color: Color(0xFFF97316), width: 1),
                                              padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 0),
                                              onPressed: () {
                                                setModalState(() {
      priceController.text = price.toString();
    });
                                              },
                                            );
                                          }).toList(),
                                        ),
                                      ),
                                  ],
                                ),
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: _buildTextFieldController('Passagers prévus', passagersController, icon: Icons.people_outline, keyboardType: TextInputType.number, hintText: 'ex: 0', onChanged: (val) {
                                  int pax = int.tryParse(val) ?? 0;
                                  if (vehicleCapacity != null) {
                                    int cap = int.tryParse(vehicleCapacity!) ?? 5;
                                    int places = cap - 1 - pax;
                                    placesController.text = places > 0 ? places.toString() : '0';
                                  }
                                }), ),
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
                                      Text('❄️ Climatisé', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 14)),
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
                                      Text('🛣️ Autoroute', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 14)),
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
                              onPressed: isLoading ? null : () async {
                                String placesLibres = placesController.text;
                                String price = priceController.text;
                                
                                if (originCity == null || destinationCity == null || date == null || time == null || vehicleCapacity == null || placesLibres.isEmpty || price.isEmpty) {
                                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Veuillez remplir tous les champs obligatoires'), backgroundColor: Colors.redAccent));
                                  return;
                                }

                                if (originCity!.trim().toLowerCase() == destinationCity!.trim().toLowerCase()) {
                                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('La ville de départ et d\'arrivée ne peuvent pas être identiques'), backgroundColor: Colors.redAccent));
                                  return;
                                }
                                
                                setModalState(() => isLoading = true);

                                String departureTime = "${date}T$time:00Z";

                                try {
                                  
                                  final url = missionToEdit != null ? '/v1/trips/${missionToEdit['id']}' : '/v1/trips/create-allo-dakar';
                                  final requestFunc = missionToEdit != null ? ApiClient().patch : ApiClient().post;
                                  final res = await requestFunc(
                                    url,
                                    
                                    body: {
                                      'originCity': originCity,
                                      'destinationCity': destinationCity,
                                      'pricePerSeat': int.tryParse(price) ?? 0,
                                      'departureTime': departureTime,
                                      'placesLibres': int.tryParse(placesLibres) ?? 0,
                                      'vehicleCapacity': int.tryParse(vehicleCapacity!) ?? 0,
                                      'isAirConditioned': isAirConditioned,
                                      'takesTollRoad': takesTollRoad,
                                      'passagers': int.tryParse(passagersController.text) ?? 0,
                                    }, );

                                  if (res.statusCode == 200 || res.statusCode == 201) {
                                    _fetchMissions();
                                    Navigator.pop(context);
                                    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Trajet créé avec succès via API !', style: TextStyle(color: Theme.of(context).colorScheme.onSurface)), backgroundColor: Colors.green));
                                  } else {
                                    final errorBody = res.body;
                                    throw Exception('API error: ${res.statusCode} - $errorBody');
                                  }
                                } catch(e) {
                                  ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Erreur: $e', style: TextStyle(color: Theme.of(context).colorScheme.onError)), backgroundColor: Theme.of(context).colorScheme.error, duration: const Duration(seconds: 5)));
                                } finally {
                                  if (context.mounted) {
                                    setModalState(() => isLoading = false);
                                  }
                                }
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFFEA580C),
                                disabledBackgroundColor: Theme.of(context).brightness == Brightness.dark ? const Color(0xFF222222) : const Color(0xFFCBD5E1),
                                disabledForegroundColor: Theme.of(context).brightness == Brightness.dark ? Colors.white54 : Colors.white,
                                foregroundColor: Colors.white,
                                padding: const EdgeInsets.symmetric(vertical: 16),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                              ),
                              child: isLoading 
                                ? Row(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Theme.of(context).brightness == Brightness.dark ? Colors.white54 : Colors.white, strokeWidth: 2)),
                                      const SizedBox(width: 8),
                                      const Text('Traitement en cours...', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                                    ],
                                  )
                                : Text(missionToEdit != null ? 'Modifier le trajet' : 'Publier le trajet', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
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
        Text(label, style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 12)),
        const SizedBox(height: 8),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          decoration: BoxDecoration(
            color: const Color(0xFF0A0A0A),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: Theme.of(context).dividerColor),
          ),
          child: DropdownButtonHideUnderline(
            child: DropdownButton<String>(
              value: value,
              hint: Text('Choisir', style: TextStyle(color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.24), fontSize: 14)),
              isExpanded: true,
              dropdownColor: Theme.of(context).cardColor,
              icon: Icon(Icons.arrow_drop_down, color: Theme.of(context).colorScheme.onSurfaceVariant),
              style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 14),
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
        Text(label, style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 12)),
        const SizedBox(height: 8),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          decoration: BoxDecoration(
            color: const Color(0xFF0A0A0A),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: Theme.of(context).dividerColor),
          ),
          child: DropdownButtonHideUnderline(
            child: DropdownButton<String>(
              value: value,
              hint: Text('Choisir', style: TextStyle(color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.24), fontSize: 14)),
              isExpanded: true,
              dropdownColor: Theme.of(context).cardColor,
              icon: Icon(Icons.arrow_drop_down, color: Theme.of(context).colorScheme.onSurfaceVariant),
              style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 14),
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


  bool _isMissionExpired(Map<String, dynamic> m) {
    if (m['statut'] == 'terminé' || m['statut'] == 'expiré') return true;
    if (m['departureTime'] == null) {
      try {
        DateTime now = DateTime.now();
        DateTime dateVal = DateTime(now.year, now.month, now.day);
        if (m['date'] == 'Aujourd\'hui') {
          // use today's date
        } else if (m['date'] == 'Demain') {
          dateVal = dateVal.add(const Duration(days: 1));
        } else if (m['rawDate'] != null) {
          dateVal = DateTime.parse(m['rawDate']);
        }
        if (m['heure'] != null) {
          List<String> parts = m['heure'].toString().split(':');
          dateVal = DateTime(dateVal.year, dateVal.month, dateVal.day, int.parse(parts[0]), int.parse(parts[1]));
        }
        return dateVal.isBefore(DateTime.now());
      } catch (e) {
        return false;
      }
    }
    try {
      DateTime depTime = DateTime.parse(m['departureTime']).toLocal();
      return depTime.isBefore(DateTime.now());
    } catch (e) {
      return false;
    }
  }

  @override
  Widget build(BuildContext context) {
    List<Map<String, dynamic>> filteredMissions = missions.where((m) {
      final isExpired = _isMissionExpired(m);
      if (selectedTab == 'Toutes') return true;
      if (selectedTab == 'Aujourd\'hui') {
        return (m['date'] == 'Aujourd\'hui' || m['rawDate'] == DateTime.now().toString().split(' ')[0]) && !isExpired;
      }
      if (selectedTab == 'Programmées') return (m['statut'] == 'programmé' || m['statut'] == 'à venir') && !isExpired;
      if (selectedTab == 'Historique') return m['statut'] == 'terminé' || isExpired;
      return true;
    }).toList();

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Text('Missions & Trajets', style: TextStyle(fontWeight: FontWeight.bold, color: Theme.of(context).colorScheme.onSurface)),
        centerTitle: true,
        iconTheme: IconThemeData(color: Theme.of(context).colorScheme.onSurface),
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
                Row(
                  children: [
                    Icon(Icons.route, color: Color(0xFFF97316), size: 20),
                    SizedBox(width: 8),
                    Text('Mes Missions', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 18, fontWeight: FontWeight.bold)),
                  ],
                ),
                ElevatedButton.icon(
                  onPressed: () {
                    _showCreateMissionBottomSheet(context);
                  },
                  icon: Icon(Icons.directions_car, size: 16),
                  label: Text('Proposer un Trajet', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Color(0xFFEA580C),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    padding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  ),
                ),
              ],
            ),
          ),
          
          // Urgent Alert
          if (filteredMissions.any((m) => _isUrgentAndNotReady(m)))
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFFF43F5E).withValues(alpha: 0.1),
                border: Border.all(color: const Color(0xFFF43F5E).withValues(alpha: 0.3)),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
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
                        color: isSelected ? const Color(0xFFF97316) : Theme.of(context).cardColor,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: isSelected ? const Color(0xFFF97316) : Theme.of(context).dividerColor),
                      ),
                      child: Text(t, style: TextStyle(
                        color: isSelected ? Colors.black : Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.6),
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
                  ? Center(child: Text('Aucune mission pour cette catégorie', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant)))
                  : ListView.builder(
                  padding: EdgeInsets.only(
                    left: 16,
                    right: 16,
                    top: 0,
                    bottom: MediaQuery.of(context).padding.bottom + 80,
                  ),
                  itemCount: filteredMissions.length,
                  itemBuilder: (context, index) {
                    final mission = filteredMissions[index];
                    final statutColor = _getStatutColor(mission['statut']);
                    final isUrgentNotReady = _isUrgentAndNotReady(mission);
                    final isDark = Theme.of(context).brightness == Brightness.dark;
                    final cardBgColor = isUrgentNotReady
                        ? (isDark ? const Color(0xFF991B1B).withValues(alpha: 0.15) : const Color(0xFFFEE2E2))
                        : Theme.of(context).cardColor;
                    final cardBorderColor = isUrgentNotReady
                        ? (isDark ? const Color(0xFFF43F5E).withValues(alpha: 0.4) : const Color(0xFFFCA5A5))
                        : Theme.of(context).dividerColor;

                    return Container(
                      margin: const EdgeInsets.only(bottom: 16),
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: cardBgColor,
                        borderRadius: BorderRadius.circular(24),
                        border: Border.all(color: cardBorderColor),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(mission['displayId'] ?? mission['id'], style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 12, fontFamily: 'monospace')),
                              Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                    decoration: BoxDecoration(
                                      color: statutColor.withValues(alpha: 0.1),
                                      border: Border.all(color: statutColor.withValues(alpha: 0.3)),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: Text(mission['statut'], style: TextStyle(color: statutColor, fontSize: 10, fontWeight: FontWeight.bold)),
                                  ),
                                  if (mission['isLocked'] == true) ...[
                                    const SizedBox(width: 8),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                      decoration: BoxDecoration(
                                        color: Colors.amber.withValues(alpha: 0.1),
                                        border: Border.all(color: Colors.amber.withValues(alpha: 0.3)),
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: const Row(
                                        mainAxisSize: MainAxisSize.min,
                                        children: [
                                          Icon(Icons.lock, color: Colors.amber, size: 10),
                                          SizedBox(width: 4),
                                          Text('Verrouillé', style: TextStyle(color: Colors.amber, fontSize: 10, fontWeight: FontWeight.bold)),
                                        ],
                                      ),
                                    ),
                                  ],
                                ],
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),
                          Text(mission['trajet'], style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 18, fontWeight: FontWeight.bold)),
                          const SizedBox(height: 8),
                          Row(
                            children: [
                              Icon(Icons.calendar_today, size: 14, color: Theme.of(context).colorScheme.onSurfaceVariant),
                              const SizedBox(width: 6),
                              Text('${mission['date']} à ${mission['heure']}', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 13)),
                            ],
                          ),
                          const SizedBox(height: 4),
                          Row(
                            children: [
                              Icon(Icons.directions_bus, size: 14, color: Theme.of(context).colorScheme.onSurfaceVariant),
                              const SizedBox(width: 6),
                              Expanded(
                                child: Text('${mission['vehicule']} • ${mission['passagers']} passagers prévus • ${mission['placesPrises'] ?? 0} places prises • ${mission['placesLibres'] ?? 0} places offertes', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 13)),
                              ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          Row(
                            children: [
                              Icon(Icons.payments_outlined, size: 14, color: Theme.of(context).colorScheme.onSurfaceVariant),
                              const SizedBox(width: 6),
                              Text('${mission['pricePerSeat'] ?? 5000} FCFA / place', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.bold, fontSize: 13)),
                              if (mission['distance'] != null) ...[
                                const SizedBox(width: 16),
                                Icon(Icons.straighten, size: 14, color: Theme.of(context).colorScheme.onSurfaceVariant),
                                const SizedBox(width: 6),
                                Text('${mission['distance']}', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 13)),
                              ],
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
                                    color: Colors.lightBlueAccent.withValues(alpha: 0.1),
                                    border: Border.all(color: Colors.lightBlueAccent.withValues(alpha: 0.2)),
                                    borderRadius: BorderRadius.circular(6),
                                  ),
                                  child: const Text('❄️ Climatisé', style: TextStyle(color: Colors.lightBlueAccent, fontSize: 10, fontWeight: FontWeight.bold)),
                                ),
                              if (mission['takesTollRoad'] == true)
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: Colors.indigoAccent.withValues(alpha: 0.1),
                                    border: Border.all(color: Colors.indigoAccent.withValues(alpha: 0.2)),
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
                                Builder(
                                  builder: (ctx) {
                                    String trajet = mission['trajet'] ?? '';
                                    String separator = trajet.contains('→') ? '→' : trajet.contains('->') ? '->' : trajet.contains(' - ') ? ' - ' : '-';
                                    List<String> parts = trajet.split(separator);
                                    String destinationCity = parts.length > 1 ? parts[1].trim() : 'Destination';
                                    
                                    return _buildActionButton(Icons.play_arrow, 'En route vers $destinationCity', const Color(0xFFEA580C), Colors.white, () {
                                      Navigator.push(context, MaterialPageRoute(
                                        builder: (context) => driver_live_tracking_screen.DriverLiveTrackingScreen(mission: mission),
                                      ));
    });
                                  }
                                ),
                              if (mission['statut'] == 'en cours')
                                _buildActionButton(Icons.check_circle, 'Terminer trajet', const Color(0xFF059669), Colors.white, () {}),
                              _buildActionButton(Icons.location_on, 'Voir détails', Theme.of(context).cardColor, Theme.of(context).colorScheme.onSurface, () {
                                _showMissionDetailsDialog(context, mission);
                              }, borderColor: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.24)),
                              if (mission['statut'] == 'programmé' && _isUrgentAndNotReady(mission))
                                _buildActionButton(Icons.access_time, 'Repousser +1h', const Color(0xFF4F46E5), Colors.white, () async {
                                  try {
                                    String date = mission['rawDate'] ?? DateTime.now().toIso8601String().split('T')[0];
                                    String time = mission['heure'] ?? '12:00';
                                    DateTime currentDep = DateTime.parse("${date}T$time:00Z");
                                    DateTime newDep = currentDep.add(const Duration(hours: 1));
                                    String newDepStr = newDep.toIso8601String();

                                    String trajet = mission['trajet'] ?? '';
                                    String separator = trajet.contains('→') ? '→' : trajet.contains('->') ? '->' : trajet.contains(' - ') ? ' - ' : '-';
                                    List<String> parts = trajet.split(separator);
                                    String origin = parts.isNotEmpty ? parts[0].trim() : 'Dakar';
                                    String destination = parts.length > 1 ? parts[1].trim() : 'Touba';

                                    
                                    final url = '/v1/trips/${mission['id']}';
                                    final res = await ApiClient().patch(
                                      url,
                                      
                                      body: {
                                        'originCity': origin,
                                        'destinationCity': destination,
                                        'pricePerSeat': mission['pricePerSeat'] ?? 5000,
                                        'departureTime': newDepStr,
                                        'placesLibres': mission['placesLibres'] ?? 4,
                                        'vehicleCapacity': (mission['placesLibres'] ?? 0) + (mission['placesPrises'] ?? 0) + 1,
                                        'passagers': mission['passagers'] ?? 0,
                                        'isAirConditioned': mission['isAirConditioned'] ?? true,
                                        'takesTollRoad': mission['takesTollRoad'] ?? true,
                                      }, );

                                    if (res.statusCode == 200 || res.statusCode == 201) {
                                      _fetchMissions();
                                      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Trajet repoussé de 1h avec succès !'), backgroundColor: Colors.green));
                                    } else {
                                      throw Exception('API error');
                                    }
                                  } catch (e) {
                                    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Erreur lors du report: $e'), backgroundColor: Colors.redAccent));
                                  }
                                }),
                              if (mission['statut'] == 'programmé' || mission['statut'] == 'à venir')
                                _buildActionButton(Icons.edit, 'Modifier', const Color(0xFF2563EB), Colors.white, () {
                                  _showCreateMissionBottomSheet(context, missionToEdit: mission);
                                }),
                              if (mission['statut'] == 'programmé' || mission['statut'] == 'à venir')
                                _buildActionButton(Icons.swap_horiz, 'Transférer clients', const Color(0xFFF97316), Colors.white, () {
                                  _showManifestAndTransferDialog(context, mission);
                                }),
                              if (mission['statut'] == 'programmé' || mission['statut'] == 'à venir')
                                _buildActionButton(
                                  mission['isLocked'] == true ? Icons.lock_open : Icons.lock_outline,
                                  mission['isLocked'] == true ? 'Déverrouiller' : 'Verrouiller',
                                  mission['isLocked'] == true ? const Color(0xFFD97706) : const Color(0xFF475569),
                                  Colors.white,
                                  () async {
                                    if (mission['isLocked'] == true) {
                                      try {
                                        
                                        final res = await ApiClient().patch(
                                          '/v1/trips/${mission['id']}/toggle-lock',
                                          
                                          body: {}, );
                                        if (res.statusCode == 200) {
                                          final data = json.decode(res.body);
                                          setState(() {
                                            mission['isLocked'] = data['isLocked'] ?? false;
                                          });
                                          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Trajet déverrouillé avec succès.'), backgroundColor: Colors.green));
                                        }
                                      } catch (e) {
                                        setState(() {
                                          mission['isLocked'] = false;
                                        });
                                        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Démo : Trajet déverrouillé.'), backgroundColor: Colors.green));
                                      }
                                    } else {
                                      final pinCode = await _showPinConfirmationDialog(context);
                                      if (pinCode == null || pinCode.isEmpty) {
                                        return;
                                      }
                                      try {
                                        
                                        final res = await ApiClient().patch(
                                          '/v1/trips/${mission['id']}/toggle-lock',
                                          
                                          body: {'code': pinCode}, );
                                        if (res.statusCode == 200) {
                                          final data = json.decode(res.body);
                                          if (data['success'] == false) {
                                            ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(data['error'] ?? 'Code PIN incorrect.'), backgroundColor: Colors.red));
                                            return;
                                          }
                                          setState(() {
                                            mission['isLocked'] = data['isLocked'] ?? true;
                                          });
                                          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Trajet verrouillé avec succès.'), backgroundColor: Colors.green));
                                        } else {
                                          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Code PIN incorrect (Démo: 123456).'), backgroundColor: Colors.red));
                                        }
                                      } catch (e) {
                                        if (pinCode == '123456') {
                                          setState(() {
                                            mission['isLocked'] = true;
                                          });
                                          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Démo : Trajet verrouillé.'), backgroundColor: Colors.green));
                                        } else {
                                          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Code PIN incorrect (Démo: 123456).'), backgroundColor: Colors.red));
                                        }
                                      }
                                    }
                                  },
                                ),
                              if (mission['statut'] == 'à venir' || mission['statut'] == 'en cours')
                               _buildActionButton(Icons.warning_amber_rounded, 'Signaler incident', Theme.of(context).cardColor, const Color(0xFFFBBF24), () {}, borderColor: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.24)),
                              if (mission['statut'] == 'programmé' && mission['passagers'] == 0)
                                _buildActionButton(Icons.close, 'Supprimer', Theme.of(context).cardColor, const Color(0xFFF43F5E), () {
                                  _showDeleteConfirmationDialog(context, mission);
                                }, borderColor: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.24)),
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

  void _showDeleteConfirmationDialog(BuildContext context, Map<String, dynamic> mission) {
    showDialog(
      context: context,
      builder: (ctx) {
        return Dialog(
          backgroundColor: Theme.of(context).cardColor,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(Icons.warning_amber_rounded, color: Color(0xFFF43F5E), size: 28),
                    const SizedBox(width: 12),
                    Text(
                      'Supprimer le trajet',
                      style: TextStyle(
                        color: Theme.of(context).colorScheme.onSurface,
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Text(
                  'Êtes-vous sûr de vouloir supprimer ce trajet ? Cette action est irréversible.',
                  style: TextStyle(
                    color: Theme.of(context).colorScheme.onSurfaceVariant,
                    fontSize: 14,
                  ),
                ),
                const SizedBox(height: 24),
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    TextButton(
                      onPressed: () => Navigator.pop(ctx),
                      child: Text(
                        'Annuler',
                        style: TextStyle(
                          color: Theme.of(context).colorScheme.onSurfaceVariant,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    ElevatedButton(
                      onPressed: () {
                        Navigator.pop(ctx);
                        _deleteMission(mission);
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFF43F5E),
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                      ),
                      child: const Text(
                        'Supprimer',
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Future<void> _deleteMission(Map<String, dynamic> mission) async {
    final missionId = mission['id'];
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Suppression en cours...'),
        backgroundColor: Colors.blueAccent,
        duration: Duration(seconds: 1),
      ),
    );

    try {
      
      final res = await ApiClient().delete(
        '/v1/trips/$missionId',
      );

      if (res.statusCode == 200 || res.statusCode == 204) {
        _fetchMissions();
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(
                'Trajet supprimé avec succès via API !',
                style: TextStyle(color: Theme.of(context).colorScheme.onSurface),
              ),
              backgroundColor: Colors.green,
            ),
          );
        }
      } else {
        throw Exception('API error');
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          missions.removeWhere((m) => m['id'] == missionId);
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Mode Hors Ligne : Trajet supprimé localement',
              style: TextStyle(color: Theme.of(context).colorScheme.onSurface),
            ),
            backgroundColor: Colors.orangeAccent,
          ),
        );
      }
    }
  }

  void _showMissionDetailsDialog(BuildContext context, Map<String, dynamic> mission) {
    showDialog(
      context: context,
      builder: (ctx) {
        final statutColor = _getStatutColor(mission['statut']);
        return Dialog(
          backgroundColor: Theme.of(context).cardColor,
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
                    Text(mission['displayId'] ?? mission['id'], style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 13, fontFamily: 'monospace')),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: statutColor.withValues(alpha: 0.1),
                        border: Border.all(color: statutColor.withValues(alpha: 0.3)),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(mission['statut'], style: TextStyle(color: statutColor, fontSize: 10, fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Text(mission['trajet'], style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 20, fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                Row(
                  children: [
                    const Icon(Icons.access_time, color: Color(0xFFF97316), size: 16),
                    const SizedBox(width: 8),
                    Text('${mission['date']} à ${mission['heure']}', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 14)),
                  ],
                ),
                Divider(color: Theme.of(context).dividerColor, height: 32),
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
                          color: Colors.lightBlueAccent.withValues(alpha: 0.1),
                          border: Border.all(color: Colors.lightBlueAccent.withValues(alpha: 0.2)),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: const Text('❄️ Climatisé', style: TextStyle(color: Colors.lightBlueAccent, fontSize: 10, fontWeight: FontWeight.bold)),
                      ),
                    if (mission['takesTollRoad'] == true)
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.indigoAccent.withValues(alpha: 0.1),
                          border: Border.all(color: Colors.indigoAccent.withValues(alpha: 0.2)),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: const Text('🛣️ Autoroute', style: TextStyle(color: Colors.indigoAccent, fontSize: 10, fontWeight: FontWeight.bold)),
                      ),
                  ],
                ),
                const SizedBox(height: 16),
                // Option de verrouillage avec Switch
                StatefulBuilder(
                  builder: (context, setStateDialog) {
                    final bool isLocked = mission['isLocked'] ?? false;
                    return SwitchListTile(
                      title: Text(
                        isLocked ? '🔒 Trajet Verrouillé' : '🔓 Trajet Déverrouillé',
                        style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold),
                      ),
                      subtitle: const Text('Bloque les nouvelles réservations publiques', style: TextStyle(color: Colors.grey, fontSize: 11)),
                      value: isLocked,
                      activeColor: const Color(0xFFF97316),
                      contentPadding: EdgeInsets.zero,
                      onChanged: (bool value) async {
                        if (value) {
                          // Demander le code d'accès PIN pour le verrouillage
                          final pinCode = await _showPinConfirmationDialog(context);
                          if (pinCode == null || pinCode.isEmpty) {
                            return; // Annulé
                          }
                          try {
                            
                            final res = await ApiClient().patch(
                              '/v1/trips/${mission['id']}/toggle-lock',
                              
                              body: {'code': pinCode}, );
                            if (res.statusCode == 200) {
                              final data = json.decode(res.body);
                              if (data['success'] == false) {
                                ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(data['error'] ?? 'Code PIN incorrect.'), backgroundColor: Colors.red));
                                return;
                              }
                              setState(() {
                                mission['isLocked'] = data['isLocked'] ?? true;
                              });
                              setStateDialog(() {});
                              ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Trajet verrouillé avec succès.'), backgroundColor: Colors.green));
                            } else {
                              ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Code PIN incorrect (Démo: 123456).'), backgroundColor: Colors.red));
                            }
                          } catch (e) {
                            // Fallback de démo si l'API n'est pas lancée
                            if (pinCode == '123456') {
                              setState(() {
                                mission['isLocked'] = true;
                              });
                              setStateDialog(() {});
                              ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Démo : Trajet verrouillé.'), backgroundColor: Colors.green));
                            } else {
                              ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Code PIN incorrect (Démo: 123456).'), backgroundColor: Colors.red));
                            }
                          }
                        } else {
                          // Déverrouiller directement
                          try {
                            
                            final res = await ApiClient().patch(
                              '/v1/trips/${mission['id']}/toggle-lock',
                              
                              body: {}, );
                            if (res.statusCode == 200) {
                              final data = json.decode(res.body);
                              setState(() {
                                mission['isLocked'] = data['isLocked'] ?? false;
                              });
                              setStateDialog(() {});
                              ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Trajet déverrouillé avec succès.'), backgroundColor: Colors.green));
                            }
                          } catch (e) {
                            // Fallback démo
                            setState(() {
                              mission['isLocked'] = false;
                                          });
                            setStateDialog(() {});
                          }
                        }
                      },
                    );
                  }
                ),
                const SizedBox(height: 12),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: () {
                      Navigator.pop(ctx);
                      _showManifestAndTransferDialog(context, mission);
                    },
                    icon: const Icon(Icons.swap_horiz, size: 18),
                    label: const Text('Transférer des Clients', style: TextStyle(fontWeight: FontWeight.bold)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFF97316),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      padding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: () {
                      Navigator.pop(ctx);
                      Navigator.push(context, MaterialPageRoute(
                        builder: (context) => DriverColisScreen(tripId: mission['id']),
                      ));
                    },
                    icon: const Icon(Icons.inventory_2, size: 18),
                    label: const Text('Gérer les Colis', style: TextStyle(fontWeight: FontWeight.bold)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.blueAccent,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      padding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () => Navigator.pop(ctx),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Theme.of(context).dividerColor,
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

  Future<String?> _showPinConfirmationDialog(BuildContext context) {
    final TextEditingController pinController = TextEditingController();
    return showDialog<String>(
      context: context,
      builder: (ctx) {
        return Dialog(
          backgroundColor: Theme.of(context).cardColor,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Icon(Icons.lock_outline, color: Color(0xFFF97316), size: 22),
                    SizedBox(width: 8),
                    Text('Verrouiller le trajet ?', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                  ],
                ),
                const SizedBox(height: 12),
                const Text(
                  '⚠️ Attention : vous êtes sur le point de verrouiller ce trajet. Plus aucune réservation publique ne sera acceptée sur ce départ.',
                  style: TextStyle(color: Colors.grey, fontSize: 13),
                ),
                const SizedBox(height: 20),
                const Text('Saisir votre Code PIN d\'accès', style: TextStyle(color: Colors.grey, fontSize: 12)),
                const SizedBox(height: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  decoration: BoxDecoration(
                    color: const Color(0xFF000000),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFF333333)),
                  ),
                  child: TextField(
                    controller: pinController,
                    obscureText: true,
                    keyboardType: TextInputType.number,
                    maxLength: 6,
                    textAlign: TextAlign.center,
                    style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold, letterSpacing: 8),
                    decoration: const InputDecoration(
                      border: InputBorder.none,
                      counterText: '',
                      hintText: '••••••',
                      hintStyle: TextStyle(color: Colors.grey),
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                Row(
                  children: [
                    Expanded(
                      child: ElevatedButton(
                        onPressed: () => Navigator.pop(ctx, null),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Theme.of(context).dividerColor,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                          padding: const EdgeInsets.symmetric(vertical: 12),
                        ),
                        child: const Text('Annuler', style: TextStyle(fontWeight: FontWeight.bold)),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: ElevatedButton(
                        onPressed: () => Navigator.pop(ctx, pinController.text),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFFF97316),
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                          padding: const EdgeInsets.symmetric(vertical: 12),
                        ),
                        child: const Text('Valider', style: TextStyle(fontWeight: FontWeight.bold)),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  void _showManifestAndTransferDialog(BuildContext context, Map<String, dynamic> mission) {
    _showSelectTargetTripDialog(context, mission);
  }

  void _showSelectTargetTripDialog(BuildContext context, Map<String, dynamic> mission) {
    final List<Map<String, dynamic>> targetTrips = [
      { 'id': 'TRIP-501', 'chauffeur': 'Moustapha Dieng', 'vehicule': 'Toyota 7 Places', 'heure': '15:00', 'placesLibres': 3, 'isLocked': false },
      { 'id': 'TRIP-502', 'chauffeur': 'Abdoulaye Sow', 'vehicule': 'Peugeot 505 particulier', 'heure': '15:15', 'placesLibres': 4, 'isLocked': true },
      { 'id': 'TRIP-503', 'chauffeur': 'Cheikh Gueye', 'vehicule': 'Bus 50 Places', 'heure': '16:00', 'placesLibres': 20, 'isLocked': false },
    ];

    showDialog(
      context: context,
      builder: (ctx) {
        return Dialog(
          backgroundColor: Theme.of(context).cardColor,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('1. Choisir le trajet cible', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
                    IconButton(
                      icon: const Icon(Icons.close, color: Colors.grey),
                      onPressed: () => Navigator.pop(ctx),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Flexible(
                  child: ListView.builder(
                    shrinkWrap: true,
                    itemCount: targetTrips.length,
                    itemBuilder: (c, idx) {
                      final t = targetTrips[idx];
                      return ListTile(
                        title: Text('Chauffeur: ${t['chauffeur']}', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
                        subtitle: Text(
                          '${t['vehicule']} • ${t['heure']} • ${t['placesLibres']} places libres${t['isLocked'] ? ' • 🔒 Verrouillé (Transfert OK)' : ''}',
                          style: const TextStyle(color: Colors.grey, fontSize: 11),
                        ),
                        trailing: const Icon(Icons.chevron_right, color: Color(0xFFF97316), size: 18),
                        onTap: () {
                          Navigator.pop(ctx);
                          _showPassengerSelectionDialog(context, mission, t);
                        },
                      );
                    },
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  void _showPassengerSelectionDialog(BuildContext context, Map<String, dynamic> mission, Map<String, dynamic> targetTrip) {
    final int capacity = (mission['placesLibres'] ?? 0) + (mission['placesPrises'] ?? 0) + 1;
    final bool isParticularVehicle = capacity <= 7;

    final List<Map<String, dynamic>> passagers = [
      {'id': 'AR-74892374', 'nom': 'Fatou Diop', 'siege': '3', 'tel': '+221 77 123 45 67', 'bagage': '12 kg'},
      {'id': 'AR-84512987', 'nom': 'Mamadou Ndiaye', 'siege': '1', 'tel': '+221 78 987 65 43', 'bagage': '25 kg (+1000F)'},
      {'id': 'AR-62019384', 'nom': 'Awa Fall', 'siege': '2', 'tel': '+221 70 456 78 90', 'bagage': 'Aucun'},
      {'id': 'AR-11029384', 'nom': 'Ousmane Sow', 'siege': '4', 'tel': '+221 76 543 21 09', 'bagage': '15 kg'},
    ];

    final Set<String> selectedPassengerIds = {};

    showDialog(
      context: context,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setStateDialog) {
            final int maxAllowed = targetTrip['placesLibres'] ?? 0;
            return Dialog(
              backgroundColor: Theme.of(context).cardColor,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          '2. Sélectionner les clients',
                          style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                        IconButton(
                          icon: const Icon(Icons.close, color: Colors.grey),
                          onPressed: () => Navigator.pop(ctx),
                        ),
                      ],
                    ),
                    Text(
                      'Cible : ${targetTrip['chauffeur']} (${maxAllowed} places libres max)',
                      style: const TextStyle(color: Color(0xFFF97316), fontSize: 12, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 16),
                    Flexible(
                      child: Container(
                        constraints: const BoxConstraints(maxHeight: 250),
                        child: ListView.builder(
                          shrinkWrap: true,
                          itemCount: passagers.length,
                          itemBuilder: (c, idx) {
                            final p = passagers[idx];
                            final isSelected = selectedPassengerIds.contains(p['id']);
                            final bool reachedLimit = selectedPassengerIds.length >= maxAllowed && !isSelected;
                            
                            return CheckboxListTile(
                              title: Text(p['nom'] ?? '', style: TextStyle(color: reachedLimit ? Colors.grey : Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
                              subtitle: Text(
                                isParticularVehicle ? 'Placement libre • ${p['bagage']}' : 'Siège #${p['siege']} • ${p['bagage']}',
                                style: const TextStyle(color: Colors.grey, fontSize: 11),
                              ),
                              value: isSelected,
                              activeColor: const Color(0xFFF97316),
                              contentPadding: EdgeInsets.zero,
                              onChanged: reachedLimit ? null : (bool? val) {
                                setStateDialog(() {
                                  if (val == true) {
                                    selectedPassengerIds.add(p['id']!);
                                  } else {
                                    selectedPassengerIds.remove(p['id']);
                                  }
                                });
                              },
                            );
                          },
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Expanded(
                          child: ElevatedButton(
                            onPressed: () => Navigator.pop(ctx),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Theme.of(context).dividerColor,
                              foregroundColor: Colors.white,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                              padding: const EdgeInsets.symmetric(vertical: 12),
                            ),
                            child: const Text('Retour', style: TextStyle(fontWeight: FontWeight.bold)),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: ElevatedButton(
                            onPressed: selectedPassengerIds.isEmpty ? null : () {
                              Navigator.pop(ctx);
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text('${selectedPassengerIds.length} client(s) transféré(s) avec succès à ${targetTrip['chauffeur']} !'),
                                  backgroundColor: Colors.green,
                                ),
                              );
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFFF97316),
                              foregroundColor: Colors.white,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                              padding: const EdgeInsets.symmetric(vertical: 12),
                            ),
                            child: Text(
                              'Transférer (${selectedPassengerIds.length})',
                              style: const TextStyle(fontWeight: FontWeight.bold),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            );
          },
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
          Text(label, style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 13)),
          Text(value, style: TextStyle(color: valueColor ?? Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
        ],
      ),
    );
  }

  Widget _buildActionButton(IconData icon, String label, Color bgColor, Color textColor, VoidCallback onPressed, {Color? borderColor}) {
    return ElevatedButton.icon(
      onPressed: onPressed,
      icon: Icon(icon, size: 14, color: textColor),
      label: Text(label, style: TextStyle(color: textColor, fontWeight: FontWeight.bold, fontSize: 11)),
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

  Widget _buildTextFieldController(String label, TextEditingController controller, {required IconData icon, TextInputType? keyboardType, String? hintText, void Function(String)? onChanged}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 12)),
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
              Icon(icon, color: Theme.of(context).colorScheme.onSurfaceVariant, size: 20),
              const SizedBox(width: 12),
              Expanded(
                child: TextField(
                  controller: controller,
                  onChanged: onChanged,
                  keyboardType: keyboardType,
                  style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 14),
                  decoration: InputDecoration(
                    border: InputBorder.none,
                    hintText: hintText,
                    hintStyle: TextStyle(color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.24)),
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
