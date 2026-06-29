import 'package:flutter/material.dart';
import 'dart:async';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import '../../widgets/shared_scaffold.dart';

class QrCodeScreen extends StatefulWidget {
  const QrCodeScreen({super.key});

  @override
  State<QrCodeScreen> createState() => _QrCodeScreenState();
}

class _QrCodeScreenState extends State<QrCodeScreen> {
  String _userName = 'Utilisateur';
  List<dynamic> _tickets = [];
  bool _isLoading = true;
  Timer? _refreshTimer;
  List<String> _selectedIds = [];

  @override
  void initState() {
    super.initState();
    _loadUserData();
    _refreshTimer = Timer.periodic(const Duration(seconds: 5), (_) => _loadUserData());
  }

  @override
  void dispose() {
    _refreshTimer?.cancel();
    super.dispose();
  }

  Future<void> _loadUserData() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _userName = prefs.getString('userName') ?? 'Utilisateur';
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
          setState(() {
            _tickets = jsonDecode(response.body);
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
            Text('Êtes-vous sûr de vouloir supprimer ces ${_selectedIds.length} billet(s) de la liste ?\n\nSaisissez votre code secret de connexion pour valider :'),
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
      
      // First verify PIN
      final verifyResponse = await http.post(
        Uri.parse('$apiUrl/v1/auth/verify-pin'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: jsonEncode({'pin': pin.trim()}),
      );

      if (verifyResponse.statusCode != 200 && verifyResponse.statusCode != 201) {
        final err = jsonDecode(verifyResponse.body);
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(err['message'] ?? 'Code secret incorrect.')),
          );
        }
        setState(() => _isLoading = false);
        return;
      }

      // PIN valid — hide tickets server-side
      final hideResponse = await http.post(
        Uri.parse('$apiUrl/v1/bookings/hide'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: jsonEncode({'bookingIds': _selectedIds}),
      );

      if (hideResponse.statusCode == 200 || hideResponse.statusCode == 201) {
        setState(() {
          _selectedIds.clear();
          _isLoading = false;
        });
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Billets supprimés avec succès.')),
          );
        }
        await _loadUserData(); // Refresh from server
      } else {
        final err = jsonDecode(hideResponse.body);
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(err['message'] ?? 'Erreur lors de la suppression.')),
          );
        }
        setState(() => _isLoading = false);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Erreur: $e')),
        );
      }
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

  void _selectAllTickets(List<dynamic> visibleActive) {
    final List<String> targetIds = visibleActive.map<String>((t) => t['id'] as String).toList();
    final bool allSelected = targetIds.every((id) => _selectedIds.contains(id));
    setState(() {
      if (allSelected) {
        _selectedIds.removeWhere((id) => targetIds.contains(id));
      } else {
        _selectedIds.addAll(targetIds.where((id) => !_selectedIds.contains(id)));
      }
    });
  }

  Future<void> _cancelTicket(String ticketId) async {
    final TextEditingController pinController = TextEditingController();
    
    final String? secretCode = await showDialog<String>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Confirmer l\'annulation'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Êtes-vous sûr de vouloir annuler ce billet ? Le montant payé sera reversé sur votre Wallet.\n\nSaisissez votre code secret de connexion pour valider :'),
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
            child: const Text('Confirmer l\'annulation', style: TextStyle(color: Colors.redAccent)),
          ),
        ],
      ),
    );
    
    if (secretCode == null || secretCode.trim().isEmpty) return;

    setState(() => _isLoading = true);
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      if (token == null) return;
      final apiUrl = dotenv.env['API_URL'] ?? 'http://10.0.2.2:3333';
      final response = await http.post(
        Uri.parse('$apiUrl/v1/bookings/$ticketId/cancel'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: jsonEncode({'secretCode': secretCode.trim()}),
      );
      if (response.statusCode == 200) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Réservation annulée. Montant remboursé sur votre Wallet.')),
        );
        _loadUserData(); // Refresh tickets and wallet
      } else {
        final err = jsonDecode(response.body);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(err['message'] ?? 'Erreur lors de l\'annulation.')),
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

  @override
  Widget build(BuildContext context) {
    // Server already excludes hiddenByUser=true tickets — just filter by active status
    final visibleActive = _tickets.where((t) => !_isTicketPastOrUsed(t)).toList();

    return SharedScaffold(
      title: 'QR Code & Billets',
      subtitle: 'Vos titres de transport toujours à portée de main.',
      icon: Icons.qr_code_scanner,
      iconColor: Colors.purpleAccent,
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
                              onPressed: () => _selectAllTickets(visibleActive),
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
              Text(
                'Vos billets, réservations et historiques de voyage.',
                style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 14),
              ),
              const SizedBox(height: 24),
              
              // Search Bar
              Container(
                decoration: BoxDecoration(
                  color: Theme.of(context).cardColor,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Theme.of(context).dividerColor.withValues(alpha: 0.5)),
                ),
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                child: TextField(
                  style: TextStyle(color: Theme.of(context).colorScheme.onSurface),
                  decoration: InputDecoration(
                    icon: Icon(Icons.search, color: Theme.of(context).colorScheme.onSurfaceVariant),
                    border: InputBorder.none,
                    hintText: 'Rechercher un QR code, trajet...',
                    hintStyle: TextStyle(color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.30)),
                  ),
                ),
              ),
              const SizedBox(height: 32),
              
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Liste de mes QR codes', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 18, fontWeight: FontWeight.bold)),
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: Colors.orangeAccent.withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: Colors.orangeAccent.withValues(alpha: 0.3)),
                        ),
                        child: Text('${visibleActive.length} Billet(s) actif(s)', style: const TextStyle(color: Colors.orangeAccent, fontSize: 11, fontWeight: FontWeight.bold)),
                      ),
                      const SizedBox(width: 8),
                      ElevatedButton.icon(
                        onPressed: () => Navigator.pushNamed(context, '/expired-tickets'),
                        icon: const Icon(Icons.history, size: 16),
                        label: const Text('Historique', style: TextStyle(fontSize: 11)),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Theme.of(context).dividerColor.withValues(alpha: 0.2),
                          foregroundColor: Theme.of(context).colorScheme.onSurface,
                          elevation: 0,
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          minimumSize: Size.zero,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 16),
              
              if (_isLoading)
                const Center(child: CircularProgressIndicator(color: Colors.orangeAccent))
              else if (visibleActive.isEmpty)
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
                      Icon(Icons.qr_code, size: 64, color: Theme.of(context).dividerColor),
                      const SizedBox(height: 16),
                      Text("Aucun billet trouvé", style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 18, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 8),
                      Text("Vous n'avez pas encore effectué de réservation.", style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant), textAlign: TextAlign.center),
                    ],
                  ),
                )
              else
                ...visibleActive.map((t) {
                  final tripDate = DateTime.parse(t['trip']['departureTime']).toLocal();
                  final dateStr = "${tripDate.day}/${tripDate.month}/${tripDate.year}";
                  final timeStr = "${tripDate.hour.toString().padLeft(2, '0')}:${tripDate.minute.toString().padLeft(2, '0')}";
                  final origin = t['trip']['route']['originStation']['city'];
                  final dest = t['trip']['route']['destinationStation']['city'];
                  final company = t['trip']['company'] != null ? t['trip']['company']['name'] : 'Allogoo';
                  final vehicle = t['trip']['vehicle'] != null ? t['trip']['vehicle']['type'] : 'Voiture';
                  
                  final card = _buildTicketCard(
                    context,
                    isActive: true,
                    status: _getTicketStatusText(t),
                    ref: t['qrCodeToken'],
                    date: dateStr,
                    time: timeStr,
                    from: origin,
                    to: dest,
                    ticketNo: 'VOY-${t['id'].toString().split('-')[0].toUpperCase()}',
                    seat: '#${t['seatNumber']}',
                    passenger: _userName,
                    vehicle: vehicle,
                    price: '${t['amountPaid']} FCFA',
                    ticketId: t['id'],
                  );

                  return Padding(
                    padding: const EdgeInsets.only(bottom: 24),
                    child: card,
                  );
                }),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTicketCard(
    BuildContext context, {
    required bool isActive,
    required String status,
    required String ref,
    required String date,
    required String time,
    required String from,
    required String to,
    required String ticketNo,
    required String seat,
    required String passenger,
    required String vehicle,
    required String price,
    String ticketId = '',
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: isActive ? Colors.orangeAccent.withValues(alpha: 0.5) : Colors.white10),
        boxShadow: isActive ? [BoxShadow(color: Colors.orangeAccent.withValues(alpha: 0.1), blurRadius: 20, offset: const Offset(0, 10))] : null,
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        children: [
          // Banner
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            color: isActive ? Colors.orangeAccent : const Color(0xFF1E293B),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Row(
                    children: [
                      if (ticketId.isNotEmpty) ...[
                        SizedBox(
                          width: 24,
                          height: 24,
                          child: Checkbox(
                            value: _selectedIds.contains(ticketId),
                            onChanged: (val) => _toggleSelectTicket(ticketId),
                            activeColor: Colors.white,
                            checkColor: Colors.orangeAccent,
                            side: const BorderSide(color: Colors.white70),
                          ),
                        ),
                        const SizedBox(width: 8),
                      ],
                      Icon(Icons.check_circle, color: isActive ? Colors.white : Colors.white54, size: 16),
                      const SizedBox(width: 6),
                      Expanded(
                        child: Text(
                          'Statut: $status', 
                          style: TextStyle(color: isActive ? Colors.white : Colors.white54, fontSize: 12, fontWeight: FontWeight.bold),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 8),
                Text('Réf: $ticketNo', style: TextStyle(color: isActive ? Colors.white : Colors.white54, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1.0)),
              ],
            ),
          ),
          
          // Main Body
          Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header (Route + QR)
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Icon(Icons.calendar_month, color: isActive ? Colors.orangeAccent : Colors.white54, size: 14),
                              const SizedBox(width: 4),
                              Text(date, style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 12)),
                              Padding(padding: const EdgeInsets.symmetric(horizontal: 8), child: Text('•', style: TextStyle(color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.30)))),
                              Icon(Icons.access_time, color: isActive ? Colors.orangeAccent : Colors.white54, size: 14),
                              const SizedBox(width: 4),
                              Text(time, style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 12)),
                            ],
                          ),
                          const SizedBox(height: 12),
                          Row(
                            children: [
                              Text(from, style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 24, fontWeight: FontWeight.w900)),
                              Padding(
                                padding: const EdgeInsets.symmetric(horizontal: 8),
                                child: Icon(Icons.arrow_forward, color: isActive ? Colors.orangeAccent : Colors.white38, size: 20),
                              ),
                              Text(to, style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 24, fontWeight: FontWeight.w900)),
                            ],
                          ),
                          const SizedBox(height: 12),
                          Row(
                            children: [
                              Icon(Icons.directions_bus, color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.38), size: 14),
                              const SizedBox(width: 4),
                              Text('Sénégal Express', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 13, fontWeight: FontWeight.w600)),
                            ],
                          ),
                        ],
                      ),
                    ),
                    // QR Code Image (Real)
                    Container(
                      padding: const EdgeInsets.all(4),
                      decoration: BoxDecoration(
                        color: Theme.of(context).colorScheme.onSurface,
                        borderRadius: BorderRadius.circular(16),
                        boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 4)],
                      ),
                      child: QRCodeBrandEngine(value: ref, size: 75),
                    ),
                  ],
                ),
                
                if (isActive) ...[
                  const SizedBox(height: 24),
                  // Details Grid
                  Container(
                    padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 16),
                    decoration: BoxDecoration(
                      color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.03),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Column(
                      children: [
                        Row(
                          children: [
                            Expanded(child: _buildDetailField(context, 'N° Billet', ticketNo)),
                            Expanded(child: _buildDetailField(context, 'Siège', seat, valueColor: Colors.orangeAccent)),
                            Expanded(child: _buildDetailField(context, 'Passager', passenger)),
                          ],
                        ),
                        const SizedBox(height: 20),
                        Row(
                          children: [
                            Expanded(child: _buildDetailField(context, 'Véhicule', vehicle)),
                            Expanded(flex: 2, child: _buildDetailField(context, 'Montant Payé', price)),
                          ],
                        ),
                      ],
                    ),
                  ),
                  
                  const SizedBox(height: 24),
                  // Action Buttons
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: () {
                            _showTicketDetails(context, ref, ticketNo, passenger, from, to, date, time, seat, price);
                          },
                          icon: Icon(Icons.visibility, color: Theme.of(context).colorScheme.onSurface),
                          label: Text('Détails', style: TextStyle(color: Theme.of(context).colorScheme.onSurface)),
                          style: OutlinedButton.styleFrom(
                            side: BorderSide(color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.24)),
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: () {
                            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Téléchargement du billet...')));
                          },
                          icon: Icon(Icons.download, color: Theme.of(context).colorScheme.onSurface),
                          label: const Text('Télécharger'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.orangeAccent,
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            textStyle: const TextStyle(fontWeight: FontWeight.bold),
                          ),
                        ),
                      ),
                    ],
                  ),
                  if (ticketId.isNotEmpty) ...[
                    const SizedBox(height: 12),
                    SizedBox(
                      width: double.infinity,
                      child: OutlinedButton.icon(
                        onPressed: () => _cancelTicket(ticketId),
                        icon: const Icon(Icons.cancel, color: Colors.redAccent, size: 16),
                        label: const Text('Annuler ma réservation', style: TextStyle(color: Colors.redAccent, fontWeight: FontWeight.bold)),
                        style: OutlinedButton.styleFrom(
                          side: const BorderSide(color: Colors.redAccent, width: 1.5),
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                      ),
                    ),
                  ],
                ],
                if (!isActive) ...[
                  const SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity,
                    child: OutlinedButton(
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Historique...')));
                      },
                      style: OutlinedButton.styleFrom(
                        side: BorderSide(color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.24)),
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: Text('Voir l\'historique complet', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant)),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDetailField(BuildContext context, String label, String value, {Color valueColor = Colors.white}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label.toUpperCase(), style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 9, fontWeight: FontWeight.bold, letterSpacing: 1.0)),
        const SizedBox(height: 4),
        Text(value, style: TextStyle(color: valueColor, fontSize: 13, fontWeight: FontWeight.w900), maxLines: 1, overflow: TextOverflow.ellipsis),
      ],
    );
  }

  void _showTicketDetails(BuildContext context, String ref, String ticketNo, String passenger, String from, String to, String date, String time, String seat, String price) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      useSafeArea: true,
      builder: (context) => Container(
        decoration: BoxDecoration(color: Theme.of(context).cardColor,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(32)),
        ),
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(width: 40, height: 4, decoration: BoxDecoration(color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.24), borderRadius: BorderRadius.circular(2))),
            const SizedBox(height: 24),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(color: Theme.of(context).colorScheme.onSurface, borderRadius: BorderRadius.circular(24)),
              child: QRCodeBrandEngine(value: ref, size: 180),
            ),
            const SizedBox(height: 24),
            Text('Billet N° $ticketNo', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 24, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Text('$from ➔ $to', style: const TextStyle(color: Colors.orangeAccent, fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 24),
            _buildDetailRow(context, 'Passager', passenger),
            _buildDetailRow(context, 'Date & Heure', '$date à $time'),
            _buildDetailRow(context, 'Siège', seat),
            _buildDetailRow(context, 'Montant payé', price),
            const SizedBox(height: 32),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () => Navigator.pop(context),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.white10,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  elevation: 0,
                ),
                child: const Text('Fermer'),
              ),
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow(BuildContext context, String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 15)),
          Text(value, style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 15, fontWeight: FontWeight.bold)),
        ],
      ),
    );
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
}

class QRCodeBrandEngine extends StatelessWidget {
  final String value;
  final double size;

  const QRCodeBrandEngine({
    super.key,
    required this.value,
    this.size = 80,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size,
      height: size,
      child: Stack(
        alignment: Alignment.center,
        children: [
          QrImageView(
            data: value,
            version: QrVersions.auto,
            errorCorrectionLevel: QrErrorCorrectLevel.H,
            size: size,
            backgroundColor: Colors.white,
            eyeStyle: const QrEyeStyle(
              eyeShape: QrEyeShape.square, // Keep eyes square for contrast
              color: Color(0xFFE65100), // deep orange
            ),
            dataModuleStyle: const QrDataModuleStyle(
              dataModuleShape: QrDataModuleShape.circle, // Make data modules dots
              color: Colors.black87,
            ),
            padding: const EdgeInsets.all(4),
          ),
          // Logo in the center
          Container(
            width: size * 0.3,
            height: size * 0.3,
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.onSurface,
              borderRadius: BorderRadius.circular(size * 0.08),
              border: Border.all(color: Colors.deepOrangeAccent, width: 1.5),
            ),
            child: Center(
              child: Icon(Icons.directions_car, color: Colors.deepOrange, size: size * 0.18),
            ),
          ),
        ],
      ),
    );
  }
}
