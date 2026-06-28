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
  List<String> _deletedIds = [];
  List<String> _selectedIds = [];

  @override
  void initState() {
    super.initState();
    _loadExpiredTickets();
  }

  Future<void> _loadExpiredTickets() async {
    final prefs = await SharedPreferences.getInstance();
    final savedDeleted = prefs.getStringList('deleted_tickets') ?? [];
    setState(() {
      _deletedIds = savedDeleted;
    });

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

  Future<void> _deleteSelectedTickets() async {
    if (_selectedIds.isEmpty) return;
    final TextEditingController pinController = TextEditingController();

    final String? pin = await showDialog<String>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Confirmer la suppression'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Êtes-vous sûr de vouloir supprimer définitivement ces ${_selectedIds.length} billet(s) de votre historique ?\n\nSaisissez votre code secret de connexion pour valider :'),
            const SizedBox(height: 16),
            TextField(
              controller: pinController,
              keyboardType: TextInputType.number,
              obscureText: true,
              decoration: const InputDecoration(
                labelText: 'Code secret',
                hintText: 'Ex: 1234',
                border: OutlineInputBorder(),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, null), child: const Text('Annuler')),
          TextButton(
            onPressed: () {
              Navigator.pop(context, pinController.text);
            },
            child: const Text('Confirmer', style: TextStyle(color: Colors.redAccent)),
          ),
        ],
      ),
    );

    if (pin == null || pin.trim().isEmpty) return;

    setState(() => _isLoading = true);
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      if (token == null) return;
      final apiUrl = dotenv.env['API_URL'] ?? 'http://10.0.2.2:3333';
      
      final response = await http.post(
        Uri.parse('$apiUrl/v1/auth/verify-pin'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: jsonEncode({'pin': pin.trim()}),
      );

      if (response.statusCode == 201 || response.statusCode == 200) {
        final newDeleted = [..._deletedIds, ..._selectedIds];
        await prefs.setStringList('deleted_tickets', newDeleted);
        setState(() {
          _deletedIds = newDeleted;
          _selectedIds.clear();
          _isLoading = false;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Billets supprimés définitivement de votre historique.')),
        );
      } else {
        final err = jsonDecode(response.body);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(err['message'] ?? 'Code secret incorrect.')),
        );
        setState(() => _isLoading = false);
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erreur: $e')),
      );
      setState(() => _isLoading = false);
    }
  }

  void _toggleSelectTicket(String id) {
    setState(() {
      if (_selectedIds.contains(id)) {
        _selectedIds.remove(id);
      } else {
        _selectedIds.add(id);
      }
    });
  }

  void _selectAllTickets(List<dynamic> visiblePast) {
    final List<String> targetIds = visiblePast.map<String>((t) => t['id'] as String).toList();
    final bool allSelected = targetIds.every((id) => _selectedIds.contains(id));
    setState(() {
      if (allSelected) {
        _selectedIds.removeWhere((id) => targetIds.contains(id));
      } else {
        _selectedIds.addAll(targetIds.where((id) => !_selectedIds.contains(id)));
      }
    });
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
    final visiblePast = _expiredTickets.where((t) => !_deletedIds.contains(t['id'])).toList();

    return SharedScaffold(
      title: 'Billets Expirés',
      subtitle: 'Historique de vos anciens trajets.',
      icon: Icons.history,
      iconColor: Colors.grey,
      body: Stack(
        children: [
          Padding(
            padding: const EdgeInsets.all(20),
            child: SingleChildScrollView(
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
                  else if (visiblePast.isEmpty)
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
                    ...visiblePast.map((t) {
                      final tripDate = DateTime.parse(t['trip']['departureTime']).toLocal();
                      final dateStr = "${tripDate.day}/${tripDate.month}/${tripDate.year}";
                      final timeStr = "${tripDate.hour.toString().padLeft(2, '0')}:${tripDate.minute.toString().padLeft(2, '0')}";
                      final origin = t['trip']['route']['originStation']['city'];
                      final dest = t['trip']['route']['destinationStation']['city'];

                      final bool isSelected = _selectedIds.contains(t['id']);

                      return Opacity(
                        opacity: isSelected ? 0.9 : 0.7,
                        child: Container(
                          margin: const EdgeInsets.only(bottom: 16),
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: Theme.of(context).cardColor,
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: isSelected ? Colors.orangeAccent : Theme.of(context).dividerColor.withValues(alpha: 0.5)),
                          ),
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Checkbox(
                                value: isSelected,
                                onChanged: (val) => _toggleSelectTicket(t['id']),
                                activeColor: Colors.orangeAccent,
                              ),
                              const SizedBox(width: 8),
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
                  const SizedBox(height: 80), // padding for floating action bar
                ],
              ),
            ),
          ),
          if (_selectedIds.isNotEmpty)
            Positioned(
              bottom: 16,
              left: 16,
              right: 16,
              child: Card(
                elevation: 10,
                color: Theme.of(context).cardColor,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        '${_selectedIds.length} sélectionné(s)',
                        style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.bold),
                      ),
                      Row(
                        children: [
                          TextButton(
                            onPressed: () => _selectAllTickets(visiblePast),
                            child: const Text('Tout'),
                          ),
                          const SizedBox(width: 8),
                          ElevatedButton.icon(
                            onPressed: _deleteSelectedTickets,
                            icon: const Icon(Icons.delete, size: 16, color: Colors.white),
                            label: const Text('Supprimer', style: TextStyle(color: Colors.white)),
                            style: ElevatedButton.styleFrom(backgroundColor: Colors.redAccent),
                          ),
                        ],
                      )
                    ],
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
