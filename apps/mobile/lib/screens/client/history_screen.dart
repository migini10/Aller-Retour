import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import '../../widgets/shared_scaffold.dart';

class HistoryScreen extends StatefulWidget {
  const HistoryScreen({super.key});

  @override
  State<HistoryScreen> createState() => _HistoryScreenState();
}

class _HistoryScreenState extends State<HistoryScreen> {
  List<dynamic> _historyItems = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchHistory();
  }

  Future<void> _fetchHistory() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      if (token == null) {
        _useFallbackData();
        return;
      }
      final apiUrl = dotenv.env['API_URL'] ?? 'http://10.0.2.2:3333';
      final response = await http.get(
        Uri.parse('$apiUrl/v1/bookings/my-tickets'),
        headers: {'Authorization': 'Bearer $token'},
      );
      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        
        // Filter past/inactive tickets
        final pastTickets = data.where((t) {
          final bStatus = t['status'];
          final tStatus = t['trip']?['status'];
          
          DateTime? depTime;
          if (t['trip']?['departureTime'] != null) {
            try {
              depTime = DateTime.parse(t['trip']['departureTime'].toString().replaceAll(' ', 'T'));
            } catch (_) {}
          }
          final isPast = depTime != null && depTime.isBefore(DateTime.now());

          return bStatus == 'CANCELLED' ||
              bStatus == 'BOARDED' ||
              bStatus == 'EXPIRED' ||
              tStatus == 'COMPLETED' ||
              tStatus == 'ARRIVED' ||
              tStatus == 'CANCELLED' ||
              isPast;
        }).toList();

        if (mounted) {
          setState(() {
            _historyItems = pastTickets.isEmpty ? _getFallbackList() : pastTickets.map((t) {
              final bStatus = t['status'];
              final tStatus = t['trip']?['status'];
              
              DateTime? depTime;
              if (t['trip']?['departureTime'] != null) {
                try {
                  depTime = DateTime.parse(t['trip']['departureTime'].toString().replaceAll(' ', 'T'));
                } catch (_) {}
              }
              final isPast = depTime != null && depTime.isBefore(DateTime.now());

              String displayStatus = 'TERMINÉ';
              Color color = Colors.white54;
              if (bStatus == 'CANCELLED' || tStatus == 'CANCELLED') {
                displayStatus = 'ANNULÉ';
                color = Colors.redAccent;
              } else if (bStatus == 'BOARDED') {
                displayStatus = 'UTILISÉ';
                color = Colors.greenAccent;
              } else if (tStatus == 'COMPLETED' || tStatus == 'ARRIVED') {
                displayStatus = 'TERMINÉ';
                color = Colors.white54;
              } else if (isPast) {
                displayStatus = 'EXPIRÉ';
                color = Colors.redAccent;
              }

              final routeName = t['trip']?['route']?['name'] ?? 'Dakar ➔ Touba';
              final driverName = t['trip']?['driverName'] ?? 'Amadou N.';
              final priceVal = t['price'] ?? 4500;
              final dateFormatted = depTime != null 
                  ? '${depTime.day.toString().padLeft(2, '0')}/${depTime.month.toString().padLeft(2, '0')}/${depTime.year}'
                  : 'Date inconnue';

              return {
                'title': routeName.replaceAll(' - ', ' ➔ ').replaceAll(' -> ', ' ➔ '),
                'date': '$dateFormatted • Chauffeur: $driverName',
                'price': '$priceVal FCFA',
                'status': displayStatus,
                'color': color,
                'isColis': false,
              };
            }).toList();
            _isLoading = false;
          });
        }
      } else {
        _useFallbackData();
      }
    } catch (_) {
      _useFallbackData();
    }
  }

  void _useFallbackData() {
    if (mounted) {
      setState(() {
        _historyItems = _getFallbackList();
        _isLoading = false;
      });
    }
  }

  List<dynamic> _getFallbackList() {
    return [
      {
        'title': 'Dakar ➔ Touba',
        'date': 'Il y a 2 jours • En attente expirée',
        'price': '3 000 FCFA',
        'status': 'EXPIRÉ',
        'color': Colors.redAccent,
        'isColis': true,
      },
      {
        'title': 'Dakar ➔ Thiès',
        'date': 'Il y a 3 jours • Livreur: Ousmane D.',
        'price': '2 500 FCFA',
        'status': 'LIVRÉ',
        'color': Colors.greenAccent,
        'isColis': true,
      },
      {
        'title': 'Dakar ➔ Touba',
        'date': '12 Mai 2026 • Chauffeur: Amadou N.',
        'price': '4 500 FCFA',
        'status': 'TERMINÉ',
        'color': Colors.white54,
        'isColis': false,
      },
      {
        'title': 'Saint-Louis ➔ Dakar',
        'date': '08 Mai 2026 • Chauffeur: Cheikh T.',
        'price': '6 000 FCFA',
        'status': 'TERMINÉ',
        'color': Colors.white54,
        'isColis': false,
      },
    ];
  }

  @override
  Widget build(BuildContext context) {
    return SharedScaffold(
      title: 'Historique',
      subtitle: 'Retrouvez tous vos trajets et réservations passés.',
      icon: Icons.history,
      iconColor: Colors.greenAccent,
      onRefresh: _fetchHistory,
      body: _isLoading
          ? const Padding(
              padding: EdgeInsets.all(40),
              child: Center(child: CircularProgressIndicator()),
            )
          : Padding(
              padding: const EdgeInsets.all(20),
              child: ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: _historyItems.length,
                itemBuilder: (context, index) {
                  final item = _historyItems[index];
                  return _buildHistoryItem(
                    context: context,
                    isRecent: item['status'] == 'EXPIRÉ' || item['status'] == 'LIVRÉ' || item['status'] == 'ANNULÉ',
                    isColis: item['isColis'] ?? false,
                    title: item['title'],
                    date: item['date'],
                    price: item['price'],
                    status: item['status'],
                    color: item['color'],
                  );
                },
              ),
            ),
    );
  }

  Widget _buildHistoryItem({
    required BuildContext context,
    required bool isRecent,
    required bool isColis,
    required String title,
    required String date,
    required String price,
    required String status,
    required Color color,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: isRecent ? color.withValues(alpha: 0.5) : Colors.white10),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: isRecent ? color.withValues(alpha: 0.15) : Colors.white10,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  status,
                  style: TextStyle(
                    color: isRecent ? color : Colors.white54,
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              Text(price, style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.bold, fontSize: 16)),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Icon(isColis ? Icons.inventory_2 : Icons.directions_car, color: isColis ? Colors.greenAccent : Colors.blueAccent, size: 24),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title, style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 16, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 4),
                    Text(date, style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 12)),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            child: OutlinedButton(
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Détails à venir !')));
              },
              style: OutlinedButton.styleFrom(
                side: BorderSide(color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.24)),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              child: Text(isColis ? 'Voir le reçu du colis' : 'Voir le reçu', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant)),
            ),
          ),
        ],
      ),
    );
  }
}
