import 'package:aller_retour_mobile/core/constants/storage_keys.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import '../../services/api_client.dart';
import 'dart:convert';
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
  List<String> _selectedIds = [];

  @override
  void initState() {
    super.initState();
    _loadExpiredTickets();
  }

  Future<void> _loadExpiredTickets() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString(StorageKeys.authToken);
    if (token != null) {
      try {
        final response = await ApiClient().get('/v1/bookings/my-tickets');
        if (response.statusCode == 200) {
          final allTickets = jsonDecode(response.body) as List<dynamic>;
          setState(() {
            // Server already excludes hiddenByUser=true; just filter for past/used ones
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
      // Verify PIN first
      final verifyResponse = await ApiClient().post(
        '/v1/auth/verify-pin',
        body: {'pin': pin.trim()},
      );

      if (verifyResponse.statusCode != 200 && verifyResponse.statusCode != 201) {
        final err = jsonDecode(verifyResponse.body);
        throw Exception(err['message'] ?? 'Code PIN incorrect');
      }

      // PIN valid — hide server-side
      final hideResponse = await ApiClient().post(
        '/v1/bookings/hide',
        body: {'bookingIds': _selectedIds},
      );

      if (hideResponse.statusCode == 200 || hideResponse.statusCode == 201) {
        setState(() {
          _selectedIds.clear();
          _isLoading = false;
        });
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Billets supprimés définitivement de votre historique.')),
          );
        }
        await _loadExpiredTickets(); // Refresh from server
      } else {
        final err = jsonDecode(hideResponse.body);
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(err['message'] ?? 'Erreur lors de la suppression.')),
          );
        }
        setState(() => _isLoading = false);
      }
    } on ApiException catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(e.message)),
      );
      setState(() => _isLoading = false);
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(e.toString().replaceAll('Exception: ', ''))),
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
    // Server already excludes hiddenByUser=true tickets
    final visiblePast = _expiredTickets.toList();
    return SharedScaffold(
      title: 'Billets Expirés',
      subtitle: 'Historique de vos anciens trajets.',
      icon: Icons.history,
      iconColor: Colors.grey,
      bottomNavigationBar: _selectedIds.isEmpty
          ? null
          : SafeArea(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
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
                          style: TextStyle(
                              color: Theme.of(context).colorScheme.onSurface,
                              fontWeight: FontWeight.bold),
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
                              label: const Text('Supprimer',
                                  style: TextStyle(color: Colors.white)),
                              style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.redAccent),
                            ),
                          ],
                        )
                      ],
                    ),
                  ),
                ),
              ),
            ),
      body: Padding(
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
                    border: Border.all(color: Colors.white10),
                  ),
                  child: const Column(
                    children: [
                      Icon(Icons.history, size: 64, color: Colors.grey),
                      const SizedBox(height: 16),
                      Text("Aucun billet expiré", style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 8),
                      Text("Votre historique de voyage est vide.", style: TextStyle(color: Colors.grey), textAlign: TextAlign.center),
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
                  
                  return GestureDetector(
                    onTap: () => _toggleSelectTicket(t['id']),
                    child: Container(
                      margin: const EdgeInsets.only(bottom: 24),
                      decoration: BoxDecoration(
                        color: _selectedIds.contains(t['id']) 
                            ? Colors.orangeAccent.withValues(alpha: 0.1) 
                            : Theme.of(context).cardColor,
                        borderRadius: BorderRadius.circular(24),
                        border: Border.all(
                          color: _selectedIds.contains(t['id']) 
                              ? Colors.orangeAccent 
                              : Colors.white10,
                          width: _selectedIds.contains(t['id']) ? 2 : 1,
                        ),
                      ),
                      clipBehavior: Clip.antiAlias,
                      child: Column(
                        children: [
                          // Status Header
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                            color: const Color(0xFF1E293B),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Row(
                                  children: [
                                    const Icon(Icons.history, color: Colors.grey, size: 16),
                                    const SizedBox(width: 6),
                                    Text(
                                      'Statut: ${_getTicketStatusText(t)}',
                                      style: const TextStyle(color: Colors.grey, fontWeight: FontWeight.bold, fontSize: 12),
                                    ),
                                  ],
                                ),
                                Text(
                                  'Réf: ${t['publicReference'] ?? "VOY-${t['id'].toString().split('-')[0].toUpperCase()}"}',
                                  style: const TextStyle(color: Colors.grey, fontSize: 11),
                                ),
                              ],
                            ),
                          ),
                          
                          // Details
                          Padding(
                            padding: const EdgeInsets.all(16),
                            child: Row(
                              children: [
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        children: [
                                          const Icon(Icons.calendar_today, size: 14, color: Colors.orangeAccent),
                                          const SizedBox(width: 6),
                                          Text(dateStr, style: const TextStyle(color: Colors.grey, fontSize: 13)),
                                          const SizedBox(width: 12),
                                          const Icon(Icons.access_time, size: 14, color: Colors.orangeAccent),
                                          const SizedBox(width: 6),
                                          Text(timeStr, style: const TextStyle(color: Colors.grey, fontSize: 13)),
                                        ],
                                      ),
                                      const SizedBox(height: 12),
                                      Row(
                                        children: [
                                          Text(origin, style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
                                          const SizedBox(width: 8),
                                          const Icon(Icons.arrow_forward, color: Colors.orangeAccent, size: 18),
                                          const SizedBox(width: 8),
                                          Text(dest, style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                                Container(
                                  padding: const EdgeInsets.all(4),
                                  decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12)),
                                  child: QRCodeBrandEngine(value: t['qrCodeToken'], size: 64),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                }),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }
}
