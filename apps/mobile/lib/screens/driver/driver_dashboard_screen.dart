import 'package:flutter/material.dart';
import 'dart:ui';
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:intl/intl.dart';
import 'package:local_auth/local_auth.dart';
import '../../services/api_client.dart';
import '../../core/constants/storage_keys.dart';
import '../../services/pin_storage_service.dart';

class DriverDashboardScreen extends StatefulWidget {
  const DriverDashboardScreen({super.key});

  @override
  State<DriverDashboardScreen> createState() => _DriverDashboardScreenState();
}

class _DriverDashboardScreenState extends State<DriverDashboardScreen> with SingleTickerProviderStateMixin {
  final ScrollController _scrollController = ScrollController();
  String _userName = '';
  String _operationalStatus = 'INDISPONIBLE';

  String _vehicleStatus = 'Chargement...';
  Color _vehicleStatusColor = Colors.grey;
  IconData _vehicleStatusIcon = Icons.directions_car;
  
  int _tripsToday = 0;
  Map<String, dynamic>? _nextTrip;

  @override
  void initState() {
    super.initState();
    _fetchDashboardData();
  }

  Future<void> _fetchDashboardData() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final storedName = prefs.getString(StorageKeys.userName);
      _userName = (storedName != null && storedName.isNotEmpty) ? storedName : '';

      try {
        final authResp = await ApiClient().get('/v1/auth/me');
        if (authResp.statusCode == 200) {
          final userData = json.decode(authResp.body);
          if (userData['driverProfile'] != null && userData['driverProfile']['operationalStatus'] != null) {
            _operationalStatus = userData['driverProfile']['operationalStatus'];
          }
        }
      } catch (e) {
        // ignore
      }

      try {
        final vehicleResp = await ApiClient().get('/v1/drivers/me/vehicles');
        if (vehicleResp.statusCode == 200) {
          final List vehicles = json.decode(vehicleResp.body);
          if (vehicles.isEmpty) {
            _vehicleStatus = 'Aucun véhicule';
            _vehicleStatusColor = Colors.grey;
            _vehicleStatusIcon = Icons.directions_car;
          } else {
            final vehicle = vehicles.first;
            final approval = vehicle['approvalStatus'];
            final cert = vehicle['certificationStatus'];
            
            if (cert == 'CERTIFIED') {
              _vehicleStatus = 'Véhicule certifié';
              _vehicleStatusColor = Colors.greenAccent;
              _vehicleStatusIcon = Icons.verified;
            } else if (approval == 'APPROVED') {
              _vehicleStatus = 'Véhicule approuvé';
              _vehicleStatusColor = Colors.greenAccent;
              _vehicleStatusIcon = Icons.check_circle_outline;
            } else if (approval == 'REJECTED') {
              _vehicleStatus = 'Véhicule rejeté';
              _vehicleStatusColor = Colors.redAccent;
              _vehicleStatusIcon = Icons.error_outline;
            } else {
              _vehicleStatus = 'Véhicule en attente';
              _vehicleStatusColor = Colors.orangeAccent;
              _vehicleStatusIcon = Icons.pending_actions;
            }
          }
        }
      } catch (e) {
        _vehicleStatus = 'Statut indisponible';
      }

      try {
        final tripsResp = await ApiClient().get('/v1/trips/driver/me');
        if (tripsResp.statusCode == 200) {
          final List tripsData = json.decode(tripsResp.body);
          final now = DateTime.now();
          final startOfDay = DateTime(now.year, now.month, now.day);
          final endOfDay = startOfDay.add(const Duration(days: 1));
          
          List futureTrips = tripsData.where((t) {
            final tDate = DateTime.parse(t['departureTime'] ?? t['date']);
            return tDate.isAfter(now);
          }).toList();

          futureTrips.sort((a, b) => DateTime.parse(a['departureTime'] ?? a['date']).compareTo(DateTime.parse(b['departureTime'] ?? b['date'])));
          
          if (futureTrips.isNotEmpty) {
            _nextTrip = futureTrips.first;
          }

          _tripsToday = futureTrips.where((t) {
            final tDate = DateTime.parse(t['departureTime'] ?? t['date']);
            return tDate.isAfter(startOfDay) && tDate.isBefore(endOfDay);
          }).length;
        }
      } catch (e) {
        // ignore
      }

    } catch (e) {
      // ignore
    } finally {
      // Done fetching
    }
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ColoredBox(
      color: Theme.of(context).scaffoldBackgroundColor, // slate-950
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 550),
          child: Stack(
            children: [
              RefreshIndicator(
                onRefresh: () async {
                  await _fetchDashboardData();
                },
                color: Colors.orangeAccent,
                backgroundColor: Theme.of(context).cardColor,
                child: SingleChildScrollView(
                  controller: _scrollController,
                  physics: const BouncingScrollPhysics(parent: AlwaysScrollableScrollPhysics()),
                  child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Scrolling Logo
                    AnimatedBuilder(
                      animation: _scrollController,
                      builder: (context, child) {
                        double offset = _scrollController.hasClients ? _scrollController.offset : 0;
                        double opacity = (1 - (offset / 35)).clamp(0.0, 1.0);
                        double translateX = -(offset * 3).clamp(0.0, 200.0);
                        
                        return Opacity(
                          opacity: opacity,
                          child: Transform.translate(
                            offset: Offset(translateX, 0),
                            child: child,
                          ),
                        );
                      },
                      child: _buildHeaderLogo(context),
                    ),
                
                const SizedBox(height: 32),

                // Welcome Hero Banner
                Padding(
                  padding: const EdgeInsets.only(bottom: 24),
                  child: Container(
                    decoration: BoxDecoration(
                      image: const DecorationImage(
                        image: AssetImage('assets/images/hero_driver_premium.png'),
                        fit: BoxFit.cover,
                      ),
                      borderRadius: const BorderRadius.vertical(bottom: Radius.circular(32)),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.4),
                          blurRadius: 20,
                          offset: const Offset(0, 8),
                        ),
                      ],
                    ),
                    child: Stack(
                      children: [
                        Positioned.fill(
                          child: Container(
                            decoration: BoxDecoration(
                              borderRadius: const BorderRadius.vertical(bottom: Radius.circular(32)),
                              gradient: LinearGradient(
                                colors: [Colors.black.withValues(alpha: 0.7), Colors.black.withValues(alpha: 0.4)],
                                begin: Alignment.topCenter,
                                end: Alignment.bottomCenter,
                              ),
                            ),
                          ),
                        ),
                        Positioned(
                          top: -50,
                          right: -50,
                          child: Container(
                            width: 150,
                            height: 150,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: Colors.orangeAccent.withValues(alpha: 0.1),
                              boxShadow: [BoxShadow(color: Colors.orangeAccent.withValues(alpha: 0.2), blurRadius: 50)],
                            ),
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.fromLTRB(24, 40, 24, 32),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  GestureDetector(
                                    onTap: () => _showStatusPicker(context),
                                    child: ClipRRect(
                                      borderRadius: BorderRadius.circular(16),
                                      child: BackdropFilter(
                                        filter: ImageFilter.blur(sigmaX: 8, sigmaY: 8),
                                        child: Container(
                                          height: 32,
                                          padding: const EdgeInsets.symmetric(horizontal: 12),
                                          decoration: BoxDecoration(
                                            color: _getStatusColor(_operationalStatus).withValues(alpha: 0.2),
                                            borderRadius: BorderRadius.circular(16),
                                            border: Border.all(color: _getStatusColor(_operationalStatus).withValues(alpha: 0.5)),
                                          ),
                                          alignment: Alignment.center,
                                          child: Text('STATUT : $_operationalStatus', style: TextStyle(color: _getStatusColor(_operationalStatus), fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 0.5)),
                                        ),
                                      ),
                                    ),
                                  ),
                                  const SizedBox(width: 12),
                                  if (_vehicleStatus != 'Chargement...')
                                    ClipRRect(
                                      borderRadius: BorderRadius.circular(16),
                                      child: BackdropFilter(
                                        filter: ImageFilter.blur(sigmaX: 8, sigmaY: 8),
                                        child: Container(
                                          height: 32,
                                          padding: const EdgeInsets.symmetric(horizontal: 12),
                                          decoration: BoxDecoration(
                                            color: Colors.white.withValues(alpha: 0.1),
                                            borderRadius: BorderRadius.circular(16),
                                            border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
                                          ),
                                          alignment: Alignment.center,
                                          child: Row(
                                            mainAxisSize: MainAxisSize.min,
                                            children: [
                                              Icon(_vehicleStatusIcon, color: _vehicleStatusColor, size: 14),
                                              const SizedBox(width: 6),
                                              Text(_vehicleStatus, style: TextStyle(color: _vehicleStatusColor, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 0.5)),
                                            ],
                                          ),
                                        ),
                                      ),
                                    ),
                                ],
                              ),
                              const SizedBox(height: 16),
                              Text(
                                _userName.isNotEmpty ? 'Bonjour $_userName 👋' : 'Bonjour 👋', 
                                style: const TextStyle(
                                  color: Colors.white, 
                                  fontSize: 38, 
                                  fontWeight: FontWeight.w900, 
                                  letterSpacing: -1.0,
                                  shadows: [Shadow(color: Colors.black54, blurRadius: 15, offset: Offset(0, 4))],
                                )
                              ),
                              const SizedBox(height: 12),
                              Text(
                                _tripsToday > 0 
                                  ? 'Vous avez $_tripsToday trajet${_tripsToday > 1 ? "s" : ""} programmé${_tripsToday > 1 ? "s" : ""} aujourd\'hui. Assurez-vous d\'avoir validé tous vos documents avant de démarrer.'
                                  : 'Vous n\'avez aucun trajet programmé aujourd\'hui.', 
                                style: const TextStyle(
                                  color: Colors.white, 
                                  fontSize: 16, 
                                  height: 1.5,
                                  fontWeight: FontWeight.w600,
                                  letterSpacing: 0.2,
                                  shadows: [Shadow(color: Colors.black87, blurRadius: 8, offset: Offset(0, 2))],
                                ),
                              ),
                              const SizedBox(height: 24),
                              Row(
                                children: [
                                  Expanded(
                                    child: ElevatedButton.icon(
                                      onPressed: () {
                                        Navigator.pushNamed(context, '/driver/missions');
                                      },
                                      icon: const Icon(Icons.route, size: 18),
                                      label: const Text('Créer un voyage', style: TextStyle(fontWeight: FontWeight.bold)),
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor: Colors.orangeAccent,
                                        foregroundColor: Colors.black,
                                        padding: const EdgeInsets.symmetric(vertical: 14),
                                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                        elevation: 8,
                                        shadowColor: Colors.orangeAccent.withValues(alpha: 0.4),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 24),

                // Prochain Trajet Widget
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: Container(
                    decoration: BoxDecoration(
                      color: Theme.of(context).cardColor,
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(color: Theme.of(context).dividerColor),
                      boxShadow: [
                        BoxShadow(
                          color: Theme.of(context).shadowColor.withValues(alpha: Theme.of(context).brightness == Brightness.light ? 0.05 : 0.2),
                          blurRadius: 15,
                          offset: const Offset(0, 5),
                        ),
                      ],
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(24),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              const Icon(Icons.location_on, color: Colors.orangeAccent, size: 16),
                              const SizedBox(width: 8),
                              Text('PROCHAIN DÉPART', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.2)),
                              const Spacer(),
                              Icon(Icons.directions_bus, color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.05), size: 40),
                            ],
                          ),
                          const SizedBox(height: 16),
                          if (_nextTrip == null)
                            Center(
                              child: Padding(
                                padding: const EdgeInsets.symmetric(vertical: 24),
                                child: Text('Aucun trajet programmé', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 16)),
                              ),
                            )
                          else ...[
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              crossAxisAlignment: CrossAxisAlignment.end,
                              children: [
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        children: [
                                          Expanded(child: Text(_nextTrip?['route']?['departureCity'] ?? 'Inconnu', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 24, fontWeight: FontWeight.w900), overflow: TextOverflow.ellipsis)),
                                          const SizedBox(width: 8),
                                          const Icon(Icons.arrow_outward, color: Colors.orangeAccent, size: 20),
                                          const SizedBox(width: 8),
                                          Expanded(child: Text(_nextTrip?['route']?['arrivalCity'] ?? 'Inconnu', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 24, fontWeight: FontWeight.w900), overflow: TextOverflow.ellipsis)),
                                        ],
                                      ),
                                      const SizedBox(height: 4),
                                      Builder(
                                        builder: (context) {
                                          final depTimeStr = _nextTrip?['departureTime'] ?? _nextTrip?['date'];
                                          final arrTimeStr = _nextTrip?['estimatedArrivalTime'];
                                          String depText = depTimeStr != null ? DateFormat('HH:mm').format(DateTime.parse(depTimeStr).toLocal()) : '--:--';
                                          String arrText = arrTimeStr != null ? DateFormat('HH:mm').format(DateTime.parse(arrTimeStr).toLocal()) : '--:--';
                                          return Text('Départ prévu à $depText • Arrivée estimée à $arrText', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 13), overflow: TextOverflow.ellipsis);
                                        },
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 24),
                            Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                                  decoration: BoxDecoration(
                                    color: Colors.orangeAccent.withValues(alpha: 0.1),
                                    borderRadius: BorderRadius.circular(16),
                                    border: Border.all(color: Colors.orangeAccent.withValues(alpha: 0.2)),
                                  ),
                                  child: Column(
                                    children: [
                                      const Text('PASSAGERS', style: TextStyle(color: Colors.orangeAccent, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1)),
                                      Builder(
                                        builder: (context) {
                                          final booked = _nextTrip?['seatsBooked'] ?? 0;
                                          final total = _nextTrip?['seatsOffered'] ?? _nextTrip?['capacity'] ?? 0;
                                          return RichText(
                                            text: TextSpan(
                                              children: [
                                                TextSpan(text: '$booked', style: const TextStyle(color: Colors.orangeAccent, fontSize: 24, fontWeight: FontWeight.w900)),
                                                TextSpan(text: '/$total', style: const TextStyle(color: Colors.orangeAccent, fontSize: 14, fontWeight: FontWeight.bold)),
                                              ],
                                            ),
                                          );
                                        }
                                      ),
                                    ],
                                  ),
                                ),
                                const SizedBox(width: 16),
                                Expanded(
                                  child: Builder(
                                    builder: (context) {
                                      final booked = _nextTrip?['seatsBooked'] ?? 0;
                                      final total = _nextTrip?['seatsOffered'] ?? _nextTrip?['capacity'] ?? 1; // avoid division by 0
                                      final ratio = (booked / total).clamp(0.0, 1.0);
                                      return Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          ClipRRect(
                                            borderRadius: BorderRadius.circular(8),
                                            child: LinearProgressIndicator(
                                              value: ratio,
                                              minHeight: 10,
                                              backgroundColor: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.05),
                                              valueColor: const AlwaysStoppedAnimation<Color>(Colors.orangeAccent),
                                            ),
                                          ),
                                          const SizedBox(height: 8),
                                          FittedBox(
                                            fit: BoxFit.scaleDown,
                                            alignment: Alignment.centerLeft,
                                            child: Row(
                                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                              children: [
                                                Text('Remplissage: ${(ratio * 100).toInt()}%', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 12)),
                                                const SizedBox(width: 8),
                                                Row(
                                                  children: [
                                                    Icon(ratio >= 1.0 ? Icons.check_circle : Icons.schedule, color: ratio >= 1.0 ? Colors.greenAccent : Colors.orangeAccent, size: 12),
                                                    const SizedBox(width: 4),
                                                    Text(ratio >= 1.0 ? 'Complet' : 'En cours', style: TextStyle(color: ratio >= 1.0 ? Colors.greenAccent : Colors.orangeAccent, fontSize: 12, fontWeight: FontWeight.bold)),
                                                  ],
                                                ),
                                              ],
                                            ),
                                          ),
                                        ],
                                      );
                                    }
                                  ),
                                ),
                              ],
                            ),
                          ],
                          const SizedBox(height: 24),
                          Divider(color: Theme.of(context).dividerColor.withValues(alpha: 0.5), height: 1),
                          const SizedBox(height: 16),
                          Row(
                            children: [
                              Expanded(
                                child: ElevatedButton(
                                  onPressed: () {
                                    Navigator.pushNamed(context, '/driver/missions');
                                  },
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Theme.of(context).colorScheme.onSurface,
                                    foregroundColor: Theme.of(context).colorScheme.surface,
                                    padding: const EdgeInsets.symmetric(vertical: 14),
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                  ),
                                  child: const Text('Gérer le manifeste', style: TextStyle(fontWeight: FontWeight.bold)),
                                ),
                              ),
                              const SizedBox(width: 12),
                              ElevatedButton(
                                onPressed: () {
                                  Navigator.pushNamed(context, '/driver/localisation');
                                },
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Theme.of(context).cardColor,
                                  foregroundColor: Theme.of(context).colorScheme.onSurface,
                                  padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 16),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                ),
                                child: const Icon(Icons.navigation, size: 20),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                ),

                const SizedBox(height: 24),

                // Mon Activité
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: Container(
                    decoration: BoxDecoration(
                      color: Theme.of(context).cardColor,
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(color: Theme.of(context).dividerColor),
                      boxShadow: [
                        BoxShadow(
                          color: Theme.of(context).shadowColor.withValues(alpha: Theme.of(context).brightness == Brightness.light ? 0.05 : 0.2),
                          blurRadius: 15,
                          offset: const Offset(0, 5),
                        ),
                      ],
                    ),
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            const Icon(Icons.trending_up, color: Colors.greenAccent, size: 16),
                            const SizedBox(width: 8),
                            Text('MON ACTIVITÉ', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.2)),
                          ],
                        ),
                        const SizedBox(height: 20),
                        Container(
                          padding: const EdgeInsets.all(20),
                          decoration: BoxDecoration(
                            color: Colors.greenAccent.withValues(alpha: 0.05),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: Colors.greenAccent.withValues(alpha: 0.1)),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text('Revenus du jour', style: TextStyle(color: Colors.greenAccent, fontSize: 14, fontWeight: FontWeight.bold)),
                                  const SizedBox(height: 4),
                                  RichText(
                                    text: TextSpan(
                                      children: [
                                        TextSpan(text: '— ', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 28, fontWeight: FontWeight.w900)),
                                        TextSpan(text: 'CFA', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 16, fontWeight: FontWeight.bold)),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                              const Icon(Icons.account_balance_wallet, color: Colors.greenAccent, size: 32),
                            ],
                          ),
                        ),
                        const SizedBox(height: 16),
                        Row(
                          children: [
                            Expanded(
                              child: Container(
                                padding: const EdgeInsets.all(16),
                                decoration: BoxDecoration(
                                  color: Theme.of(context).cardColor,
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(color: Theme.of(context).dividerColor),
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text('TRAJETS', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1)),
                                    const SizedBox(height: 4),
                                    RichText(
                                      text: TextSpan(
                                        children: [
                                          TextSpan(text: '—', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 24, fontWeight: FontWeight.w900)),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Container(
                                padding: const EdgeInsets.all(16),
                                decoration: BoxDecoration(
                                  color: Theme.of(context).cardColor,
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(color: Theme.of(context).dividerColor),
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text('DISTANCE', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1)),
                                    const SizedBox(height: 4),
                                    RichText(
                                      text: TextSpan(
                                        children: [
                                          TextSpan(text: '— ', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 24, fontWeight: FontWeight.w900)),
                                          TextSpan(text: 'km', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 14, fontWeight: FontWeight.bold)),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),

                SizedBox(height: MediaQuery.of(context).padding.bottom + 40),
                  ],
                ),
              ),
              ),
              // Fixed Hamburger Menu
              Positioned(
                top: MediaQuery.of(context).padding.top + 16,
                right: 20,
                child: _buildHamburgerMenu(context),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeaderLogo(BuildContext context) {
    return Container(
      color: Colors.transparent, // 0% opacity
      padding: EdgeInsets.only(
        top: MediaQuery.of(context).padding.top + 16,
        bottom: 16,
        left: 20,
        right: 80, // Space for the fixed hamburger menu
      ),
      child: Row(
        children: [
          Image.asset(
            'assets/images/logo_allogoo.png',
            height: 32,
            fit: BoxFit.contain,
          ),
        ],
      ),
    );
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'DISPONIBLE': return Colors.greenAccent;
      case 'EN_RAMASSAGE': return Colors.blueAccent;
      case 'EN_ROUTE': return Colors.orangeAccent;
      case 'EN_PAUSE': return Colors.purpleAccent;
      case 'INDISPONIBLE':
      default: return Colors.white;
    }
  }

  Future<void> _showStatusPicker(BuildContext context) async {
    final statuses = ['DISPONIBLE', 'INDISPONIBLE', 'EN_RAMASSAGE', 'EN_ROUTE', 'EN_PAUSE'];
    
    await showModalBottomSheet(
      context: context,
      backgroundColor: Theme.of(context).cardColor,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (ctx) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Padding(
              padding: EdgeInsets.all(16.0),
              child: Text('Changer de statut', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            ),
            ...statuses.map((s) => ListTile(
              leading: Icon(Icons.circle, color: _getStatusColor(s), size: 16),
              title: Text(s),
              trailing: _operationalStatus == s ? const Icon(Icons.check, color: Colors.green) : null,
              onTap: () {
                Navigator.pop(ctx);
                if (s != _operationalStatus) {
                  _promptPinAndChangeStatus(s);
                }
              },
            )),
          ],
        ),
      ),
    );
  }

  Future<void> _promptPinAndChangeStatus(String newStatus) async {
    final LocalAuthentication auth = LocalAuthentication();
    bool canCheckBiometrics = false;
    try {
      canCheckBiometrics = await auth.canCheckBiometrics;
    } catch (e) {
      // ignore
    }

    String? pin;
    bool hasStoredPin = await PinStorageService.hasPin();

    if (canCheckBiometrics && hasStoredPin) {
      try {
        final authenticated = await auth.authenticate(
          localizedReason: 'Veuillez vous authentifier pour changer votre statut',
        );
        if (authenticated) {
          pin = await PinStorageService.getPin();
        }
      } catch (e) {
        // ignore and fallback to PIN
      }
    }

    if (!mounted) return;

    if (pin == null || pin.isEmpty) {
      await showDialog(
        context: context,
        barrierDismissible: false,
        builder: (ctx) => AlertDialog(
          title: const Text('Code PIN requis'),
          content: TextField(
            obscureText: true,
            keyboardType: TextInputType.number,
            maxLength: 4,
            decoration: const InputDecoration(hintText: 'Entrez votre PIN à 4 chiffres'),
            onChanged: (val) => pin = val,
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Annuler')),
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('Valider'),
            ),
          ],
        ),
      );
    }

    if (pin != null && pin!.length == 4) {
      if (!mounted) return;
      try {
        final resp = await ApiClient().patch('/v1/drivers/me/status', body: {
          'status': newStatus,
          'pin': pin,
        });
        
        if (!mounted) return;
        
        if (resp.statusCode == 200) {
          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Statut mis à jour'), backgroundColor: Colors.green));
          await _fetchDashboardData();
        } else {
          final error = json.decode(resp.body);
          final errorMessage = error['message'] ?? 'Erreur PIN';
          ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(errorMessage), backgroundColor: Colors.red));
          
          if (resp.statusCode == 401) {
            await PinStorageService.deletePin();
          } else if (resp.statusCode == 400 && errorMessage.toString().toLowerCase().contains('non configuré')) {
            await _showPinSetupFlow();
          }
        }
      } catch (e) {
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Erreur réseau'), backgroundColor: Colors.red));
      } finally {
        // Done
      }
    }
  }

  Future<void> _showPinSetupFlow() async {
    String newPin = '';
    String confirmPin = '';
    
    await showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setStateModal) {
            bool isValid = newPin.length == 4 && confirmPin.length == 4 && newPin == confirmPin;
            return AlertDialog(
              title: const Text('Configurer votre code PIN'),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Text('Veuillez définir un code PIN à 4 chiffres pour sécuriser vos changements de statut.'),
                  const SizedBox(height: 16),
                  TextField(
                    obscureText: true,
                    keyboardType: TextInputType.number,
                    maxLength: 4,
                    decoration: const InputDecoration(hintText: 'Nouveau code PIN (4 chiffres)'),
                    onChanged: (val) => setStateModal(() => newPin = val),
                  ),
                  TextField(
                    obscureText: true,
                    keyboardType: TextInputType.number,
                    maxLength: 4,
                    decoration: const InputDecoration(hintText: 'Confirmer le code PIN'),
                    onChanged: (val) => setStateModal(() => confirmPin = val),
                  ),
                ],
              ),
              actions: [
                TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Annuler')),
                TextButton(
                  onPressed: isValid ? () => Navigator.pop(ctx, true) : null,
                  child: const Text('Configurer'),
                ),
              ],
            );
          }
        );
      },
    ).then((submit) async {
      if (submit == true && newPin == confirmPin && newPin.length == 4) {
        if (!mounted) return;
        try {
          final resp = await ApiClient().post('/v1/drivers/me/pin', body: {
            'pin': newPin,
            'confirmPin': confirmPin,
          });
          
          if (!mounted) return;
          
          if (resp.statusCode == 200 || resp.statusCode == 201) {
            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Code PIN configuré avec succès'), backgroundColor: Colors.green));
            
            final LocalAuthentication auth = LocalAuthentication();
            bool canCheckBiometrics = false;
            try {
              canCheckBiometrics = await auth.canCheckBiometrics;
            } catch (e) {
              // ignore
            }
            
            if (canCheckBiometrics && mounted) {
               bool? useBiometric = await showDialog<bool>(
                 context: context,
                 builder: (ctx) => AlertDialog(
                   title: const Text('Empreinte digitale'),
                   content: const Text("Voulez-vous utiliser l'empreinte pour les prochaines validations ?"),
                   actions: [
                     TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Non')),
                     TextButton(onPressed: () => Navigator.pop(ctx, true), child: const Text('Oui')),
                   ],
                 ),
               );
               
               if (useBiometric == true) {
                 await PinStorageService.savePin(newPin);
                 if (mounted) {
                   ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Biométrie activée'), backgroundColor: Colors.green));
                 }
               }
            }
          } else {
             final error = json.decode(resp.body);
             ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(error['message'] ?? 'Erreur lors de la configuration'), backgroundColor: Colors.red));
          }
        } catch (e) {
          if (!mounted) return;
          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Erreur réseau'), backgroundColor: Colors.red));
        } finally {
          // Done
        }
      }
    });
  }

  Widget _buildHamburgerMenu(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Theme.of(context).dividerColor.withValues(alpha: 0.5), width: 1),
        boxShadow: [
          BoxShadow(
            color: Theme.of(context).shadowColor.withValues(alpha: Theme.of(context).brightness == Brightness.light ? 0.1 : 0.4),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: IconButton(
        icon: Icon(Icons.menu, color: Theme.of(context).colorScheme.onSurface, size: 24),
        padding: const EdgeInsets.all(8),
        constraints: const BoxConstraints(),
        onPressed: () {
          Scaffold.of(context).openEndDrawer();
        },
      ),
    );
  }
}
