import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import '../../widgets/shared_scaffold.dart';
import 'qr_code_screen.dart'; // We can't easily import private _buildTicketCard, so we will reimplement or we can make it public.

class ExpiredTicketsScreen extends StatefulWidget {
  const ExpiredTicketsScreen({super.key});

  @override
  State<ExpiredTicketsScreen> createState() => _ExpiredTicketsScreenState();
}

class _ExpiredTicketsScreenState extends State<ExpiredTicketsScreen> {
  List<dynamic> _expiredTickets = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadExpiredTickets();
  }

  Future<void> _loadExpiredTickets() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');
    if (token != null) {
      try {
        final apiUrl = dotenv.env['API_URL'] ?? 'http://localhost:3333';
        final response = await http.get(
          Uri.parse('$apiUrl/v1/bookings/my-tickets'),
          headers: {'Authorization': 'Bearer $token'},
        );
        if (response.statusCode == 200) {
          final allTickets = jsonDecode(response.body) as List<dynamic>;
          setState(() {
            _expiredTickets = allTickets.where((t) => _isTicketPastOrUsed(t)).toList();
            _isLoading = false;
          });
        } else {
          setState(() => _isLoading = false);
        }
      } catch (e) {
        setState(() => _isLoading = false);
      }
    } else {
      setState(() => _isLoading = false);
    }
  }
  
  bool _isTicketPastOrUsed(Map<String, dynamic> ticket) {
    final bookingStatus = ticket['status'];
    final tripStatus = ticket['trip']?['status'];
    final tripDate = DateTime.parse(ticket['trip']['departureTime']).toLocal();
    final isPast = tripDate.isBefore(DateTime.now());

    if (bookingStatus == 'CANCELLED' ||
        bookingStatus == 'BOARDED' ||
        bookingStatus == 'EXPIRED' ||
        tripStatus == 'COMPLETED' ||
        tripStatus == 'ARRIVED' ||
        tripStatus == 'CANCELLED' ||
        isPast) {
      return true;
    }
    return false;
  }

  String _getTicketStatusText(Map<String, dynamic> ticket) {
    final bookingStatus = ticket['status'];
    final tripStatus = ticket['trip']?['status'];
    final tripDate = DateTime.parse(ticket['trip']['departureTime']).toLocal();
    final isPast = tripDate.isBefore(DateTime.now());

    if (bookingStatus == 'CANCELLED' || tripStatus == 'CANCELLED') return 'Annulé';
    if (bookingStatus == 'BOARDED') return 'Utilisé';
    if (tripStatus == 'COMPLETED' || tripStatus == 'ARRIVED') return 'Terminé';
    if (isPast) return 'Expiré';

    if (bookingStatus == 'CONFIRMED' || bookingStatus == 'PENDING_PAYMENT') {
      return 'Valide';
    }
    return bookingStatus;
  }

  @override
  Widget build(BuildContext context) {
    return SharedScaffold(
      title: 'Billets Expirés',
      subtitle: 'Historique de vos anciens trajets.',
      icon: Icons.history,
      iconColor: Colors.grey,
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Consultez la liste de vos billets passés et expirés.',
              style: TextStyle(color: Colors.grey, fontSize: 14),
            ),
            const SizedBox(height: 24),
            if (_isLoading)
              const Center(child: CircularProgressIndicator(color: Colors.orangeAccent))
            else if (_expiredTickets.isEmpty)
              Container(
                padding: const EdgeInsets.all(32),
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  color: Theme.of(context).cardColor,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: Theme.of(context).dividerColor.withValues(alpha: 0.5)),
                ),
                child: Column(
                  children: [
                    Icon(Icons.history_toggle_off, size: 64, color: Theme.of(context).dividerColor),
                    const SizedBox(height: 16),
                    Text("Aucun billet expiré", style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 18, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 8),
                    Text("Vous n'avez pas de billets dans l'historique.", style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant), textAlign: TextAlign.center),
                  ],
                ),
              )
            else
              ..._expiredTickets.map((t) {
                final tripDate = DateTime.parse(t['trip']['departureTime']).toLocal();
                final dateStr = "${tripDate.day}/${tripDate.month}/${tripDate.year}";
                final timeStr = "${tripDate.hour.toString().padLeft(2, '0')}:${tripDate.minute.toString().padLeft(2, '0')}";
                final origin = t['trip']['route']['originStation']['city'];
                final dest = t['trip']['route']['destinationStation']['city'];

                return Opacity(
                  opacity: 0.7,
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 16),
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Theme.of(context).cardColor,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: Theme.of(context).dividerColor.withValues(alpha: 0.5)),
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Expanded(child: Text('$origin ➔ $dest', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16), overflow: TextOverflow.ellipsis)),
                                  const SizedBox(width: 8),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                    decoration: BoxDecoration(color: Colors.grey.withValues(alpha: 0.2), borderRadius: BorderRadius.circular(8)),
                                    child: Text(_getTicketStatusText(t), style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey)),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 8),
                              Text('$dateStr à $timeStr', style: const TextStyle(color: Colors.grey, fontSize: 13)),
                              const SizedBox(height: 4),
                              Text('Réf: VOY-${t['id'].toString().split('-').first.toUpperCase()}', style: const TextStyle(color: Colors.grey, fontSize: 12, fontFamily: 'monospace')),
                            ],
                          ),
                        ),
                        const SizedBox(width: 16),
                        Opacity(
                          opacity: 0.5,
                          child: Container(
                            padding: const EdgeInsets.all(4),
                            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12)),
                            child: QRCodeBrandEngine(value: t['qrCodeToken'], size: 64),
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              }),
          ],
        ),
      ),
    );
  }
}
