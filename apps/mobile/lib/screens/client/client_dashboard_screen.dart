import 'package:flutter/material.dart';
import '../../widgets/app_drawer.dart';
import 'dart:ui'; // for ImageFilter
import 'dart:ui' as ui;
import 'dart:async';
import 'package:geolocator/geolocator.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:typed_data';
import 'package:flutter/rendering.dart';
import 'package:share_plus/share_plus.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../widgets/orange_money_logo.dart';
import 'widgets/recharge_modal.dart';
import 'package:aller_retour_mobile/screens/driver/driver_live_tracking_screen.dart' as driver_live_tracking_screen;

class ClientDashboardScreen extends StatefulWidget {
  const ClientDashboardScreen({super.key});

  @override
  State<ClientDashboardScreen> createState() => _ClientDashboardScreenState();
}

class _ClientDashboardScreenState extends State<ClientDashboardScreen> with SingleTickerProviderStateMixin {
  AnimationController? _pulseController;
  Animation<double>? _pulseAnimation;
  final ScrollController _scrollController = ScrollController();
  final PageController _promoController = PageController(viewportFraction: 0.85);
  Timer? _carouselTimer;
  
  String _userName = 'Utilisateur';
  String _userPhone = '';
  int? _walletBalance;
  
  String? _currentCity;
  String? _currentAddress;
  List<Map<String, String>> _destinations = [];
  List<dynamic> activeParcels = [];
  List<dynamic> recentHistory = [];
  
  final List<Map<String, String>> _allDestinations = [
    {'id': 'dakar', 'name': 'Dakar', 'price': '4000 FCFA', 'image': 'assets/images/destinations/dakar.jpg'},
    {'id': 'touba', 'name': 'Touba', 'price': '5000 FCFA', 'image': 'assets/images/destinations/touba.jpg'},
    {'id': 'thies', 'name': 'Thiès', 'price': '2500 FCFA', 'image': 'assets/images/destinations/thies.jpg'},
    {'id': 'mbour', 'name': 'Mbour', 'price': '3000 FCFA', 'image': 'assets/images/destinations/mbour.jpg'},
    {'id': 'kaolack', 'name': 'Kaolack', 'price': '4500 FCFA', 'image': 'assets/images/destinations/kaolack.jpg'},
    {'id': 'saint_louis', 'name': 'Saint-Louis', 'price': '6000 FCFA', 'image': 'assets/images/destinations/saint_louis.jpg'},
  ];

  @override
  void initState() {
    super.initState();
    _destinations = List.from(_allDestinations);
    _loadUserData();
    _fetchLocationAndDestinations();
    _fetchWalletBalance();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    )..repeat(reverse: true);
    _pulseAnimation = Tween<double>(begin: 0.2, end: 0.6).animate(_pulseController!);

    _carouselTimer = Timer.periodic(const Duration(seconds: 6), (Timer timer) {
      if (_promoController.hasClients) {
        int nextPage = (_promoController.page?.round() ?? 0) + 1;
        if (nextPage > 1) { // We only have 2 pages
          nextPage = 0;
        }
        _promoController.animateToPage(
          nextPage,
          duration: const Duration(milliseconds: 500),
          curve: Curves.easeInOut,
        );
      }
    });
  }

  Future<void> _loadUserData() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _userName = prefs.getString('userName') ?? 'Utilisateur';
      _userPhone = prefs.getString('userPhone') ?? '';
    });
  }

  Future<void> _fetchWalletBalance() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      if (token == null) return;
      final apiUrl = dotenv.env['API_URL'] ?? 'http://10.0.2.2:3333';
      final response = await http.get(
        Uri.parse('$apiUrl/v1/wallets/my-balance'),
        headers: {'Authorization': 'Bearer $token'},
      );
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (mounted) {
          setState(() {
            _walletBalance = data['balance'] is num ? (data['balance'] as num).toInt() : int.tryParse(data['balance'].toString());
          });
        }
      }
    } catch (e) {
      debugPrint('Erreur solde wallet: $e');
    }
  }

  Future<void> _fetchLocationAndDestinations() async {
    try {
      bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) return;

      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) return;
      }

      if (permission == LocationPermission.deniedForever) return;

      Position position = await Geolocator.getCurrentPosition(desiredAccuracy: LocationAccuracy.medium);
      final apiKey = dotenv.env['GOOGLE_MAPS_API_KEY'];
      if (apiKey == null || apiKey.isEmpty) return;

      final url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.latitude},${position.longitude}&key=$apiKey';
      final response = await http.get(Uri.parse(url));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['results'] != null && data['results'].isNotEmpty) {
          final components = data['results'][0]['address_components'] as List;
          final locality = components.firstWhere(
            (c) => (c['types'] as List).contains('locality') || (c['types'] as List).contains('administrative_area_level_2'),
            orElse: () => null,
          );

          if (locality != null) {
            String city = locality['long_name'];
            _currentAddress = data['results'][0]['formatted_address'];
            _updateDestinationsBasedOnCity(city);
          }
        }
      }
    } catch (e) {
      debugPrint('Geocoding error: $e');
    }
  }

  Future<void> _updateDestinationsBasedOnCity(String currentCity) async {
    setState(() {
      _currentCity = currentCity;
      String normalized = currentCity.toLowerCase();
      
      var filtered = _allDestinations.where((d) => !normalized.contains(d['name']!.toLowerCase().replaceAll('è', 'e'))).toList();
      
      if (normalized.contains('dakar')) {
        filtered.sort((a, b) {
          const popular = ['touba', 'thiès', 'mbour'];
          int aIndex = popular.indexOf(a['name']!.toLowerCase());
          int bIndex = popular.indexOf(b['name']!.toLowerCase());
          if (aIndex != -1 && bIndex != -1) return aIndex.compareTo(bIndex);
          if (aIndex != -1) return -1;
          if (bIndex != -1) return 1;
          return 0;
        });
      } else if (normalized.contains('touba')) {
        filtered.sort((a, b) {
          const popular = ['dakar', 'thiès', 'kaolack'];
          int aIndex = popular.indexOf(a['name']!.toLowerCase());
          int bIndex = popular.indexOf(b['name']!.toLowerCase());
          if (aIndex != -1 && bIndex != -1) return aIndex.compareTo(bIndex);
          if (aIndex != -1) return -1;
          if (bIndex != -1) return 1;
          return 0;
        });
      }
      _destinations = filtered.map((d) => Map<String, String>.from(d)).toList();
    });

    // Fetch dynamic prices
    final String apiUrl = dotenv.env['API_URL'] ?? 'http://10.0.2.2:3333';
    List<Map<String, String>> updatedDests = List.from(_destinations);
    
    for (int i = 0; i < updatedDests.length; i++) {
      try {
        final origin = Uri.encodeComponent(currentCity);
        final dest = Uri.encodeComponent(updatedDests[i]['name']!);
        final response = await http.get(Uri.parse('$apiUrl/v1/missions/popular-prices?origin=$origin&destination=$dest'));
        
        if (response.statusCode == 200) {
          final data = json.decode(response.body);
          if (data['prices'] != null && (data['prices'] as List).isNotEmpty) {
            updatedDests[i] = {
              ...updatedDests[i],
              'price': '${data['prices'][0]} FCFA',
            };
          }
        }
      } catch (e) {
        debugPrint('Error fetching price for ${updatedDests[i]['name']}: $e');
      }
    }
    
    if (mounted) {
      setState(() {
        _destinations = updatedDests;
      });
    }
  }

  @override
  void dispose() {
    _carouselTimer?.cancel();
    _promoController.dispose();
    _scrollController.dispose();
    _pulseController?.dispose();
    super.dispose();
  }

  final List<Map<String, dynamic>> services = [
    {
      'title': 'Colis Express',
      'description': 'Envoyez vos colis.',
      'icon': Icons.inventory_2,
      'color': Colors.purpleAccent,
      'route': '/colis',
    },
    {
      'title': 'Wallet',
      'description': 'Rechargez et payez.',
      'icon': Icons.account_balance_wallet,
      'color': Colors.cyanAccent,
      'route': '/wallet',
    },
    {
      'title': 'Fidélité',
      'description': 'Cumulez des kilomètres et gagnez des billets.',
      'icon': Icons.workspace_premium_outlined,
      'color': Colors.greenAccent,
      'route': '/fidelite',
    },
    {
      'title': 'QR Code',
      'description': 'Montrez votre QR Code lors de l\'embarquement.',
      'icon': Icons.qr_code_scanner,
      'color': Colors.blueAccent,
      'route': '/qrcode',
    },
  ];

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
                  await _fetchWalletBalance();
                  await _fetchLocationAndDestinations();
                },
                color: Colors.orangeAccent,
                backgroundColor: Theme.of(context).cardColor,
                child: SingleChildScrollView(
                  controller: _scrollController,
                  physics: const BouncingScrollPhysics(parent: AlwaysScrollableScrollPhysics()),
                  child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    AnimatedBuilder(
                      animation: _scrollController,
                      builder: (context, child) {
                        double offset = _scrollController.hasClients ? _scrollController.offset : 0;
                        // Disparaît rapidement
                        double opacity = (1 - (offset / 35)).clamp(0.0, 1.0);
                        // Translation latérale (glisse vers la gauche agressivement)
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
                    _buildHeroWithWalletAndButtons(context),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 24.0),
                      child: _buildLiveStatusSection(context),
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16.0),
                      child: _buildServicesSection(context),
                    ),
                    const SizedBox(height: 32.0),
                    _buildPromoCarousel(context),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 32.0),
                      child: _buildRecentHistory(context),
                    ),
                    _buildPopularDestinations(context),
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
          Container(
            padding: const EdgeInsets.all(6),
            decoration: BoxDecoration(
              color: Colors.orange.withValues(alpha: 0.4),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: Colors.deepOrange.shade400, width: 2),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.2),
                  blurRadius: 4,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Icon(Icons.directions_car, color: Colors.deepOrange.shade400, size: 18),
          ),
          const SizedBox(width: 10),
          RichText(
            text: TextSpan(
              style: const TextStyle(
                fontWeight: FontWeight.w900, 
                fontSize: 24,
                letterSpacing: -0.5,
                fontFamily: 'Roboto',
                shadows: [
                  Shadow(color: Colors.black26, blurRadius: 2, offset: Offset(0, 1)),
                ],
              ),
              children: [
                TextSpan(text: 'Aller-', style: TextStyle(color: Theme.of(context).colorScheme.onSurface)),
                TextSpan(text: 'Retour', style: TextStyle(color: Colors.deepOrange.shade400)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHamburgerMenu(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Container(
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFFF97316).withValues(alpha: 0.1) : const Color(0xFFFFF7ED),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: isDark ? const Color(0xFFF97316).withValues(alpha: 0.3) : const Color(0xFFFED7AA), width: 1),
        boxShadow: [
          if (!isDark) BoxShadow(color: Colors.black.withValues(alpha: 0.1), blurRadius: 6, offset: const Offset(0, 3)),
        ],
      ),
      child: IconButton(
        icon: Icon(Icons.menu, color: isDark ? const Color(0xFFFB923C) : const Color(0xFFF97316), size: 20),
        padding: const EdgeInsets.all(8),
        constraints: const BoxConstraints(),
        onPressed: () {
          Scaffold.of(context).openEndDrawer();
        },
      ),
    );
  }

  Widget _buildHeroWithWalletAndButtons(BuildContext context) {
    // Calculate the exact height for the hero to stop right above the Android footer.
    final screenHeight = MediaQuery.of(context).size.height;
    final topPadding = MediaQuery.of(context).padding.top;
    final bottomPadding = MediaQuery.of(context).padding.bottom;
    
    // Header logo height is approximately 16 (top padding) + 16 (bottom padding) + 30 (avatar size) = 62.
    // We want the hero to take the remaining height minus some margin (16 for top margin, 16 for bottom margin).
    final heroHeight = screenHeight - topPadding - 62 - bottomPadding - 32;

    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: ClipRRect(
        borderRadius: const BorderRadius.vertical(bottom: Radius.circular(32)), // Arrondi en bas uniquement pour un style moderne pleine largeur
        child: SizedBox(
          height: heroHeight > 550 ? heroHeight : 550, // Fallback for very small screens
          child: Stack(
            children: [
              // Background Image
              Positioned.fill(
                child: Image.asset(
                  'assets/images/hero_client_premium.png',
                  fit: BoxFit.cover,
                ),
              ),
              // Overlay pour assombrir l'image et rendre le texte lisible (plus de dégradé)
              Positioned.fill(
                child: Container(
                  color: Colors.black.withValues(alpha: 0.5), 
                ),
              ),
              // Content
              SafeArea(
                bottom: false,
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(20, 30, 20, 40),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      const Text(
                        'Espace Voyageur', 
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.w900,
                          fontSize: 38, // Plus grand, plus moderne
                          letterSpacing: -1.5,
                          height: 1.1,
                          shadows: [
                            Shadow(color: Colors.black54, blurRadius: 15, offset: Offset(0, 4)),
                          ],
                        ),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'Bienvenue sur votre tableau de bord.\nGérez vos réservations et votre wallet en toute simplicité.', 
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 16, // Plus lisible
                          height: 1.5,
                          fontWeight: FontWeight.w600,
                          letterSpacing: 0.2,
                          shadows: [
                            Shadow(color: Colors.black87, blurRadius: 8, offset: Offset(0, 2)),
                          ],
                        ),
                      ),
                      const Spacer(),
                      _buildPremiumWalletCard(context),
                      const SizedBox(height: 24),
                      _buildActionButtons(),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPremiumWalletCard(BuildContext context) {
    if (_pulseAnimation == null) return const SizedBox(); // safety for hot reloads

    return AnimatedBuilder(
      animation: _pulseAnimation!,
      builder: (context, child) {
        return Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 330),
            child: Container(
              width: double.infinity,
              decoration: BoxDecoration(
                color: Colors.black.withValues(alpha: 0.15), 
                borderRadius: BorderRadius.circular(24),
                border: Border.all(
                  color: Colors.cyanAccent.withValues(alpha: 0.4 + (_pulseAnimation!.value * 0.6)), // Base opacity + pulse
                  width: 2.0,
                ),
                gradient: RadialGradient(
                  colors: [
                    Colors.cyanAccent.withValues(alpha: _pulseAnimation!.value * 0.20),
                    Colors.transparent,
                  ],
                  radius: 1.5,
                  center: Alignment.centerLeft,
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.cyanAccent.withValues(alpha: _pulseAnimation!.value * 0.25),
                    blurRadius: 15,
                    spreadRadius: 1,
                  ),
                ],
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(24),
                child: BackdropFilter(
                  filter: ImageFilter.blur(sigmaX: 0.5, sigmaY: 0.5), // Très léger flou
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 14.0),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: Colors.cyanAccent.withValues(alpha: 0.2),
                            borderRadius: BorderRadius.circular(14),
                            border: Border.all(color: Colors.cyanAccent.withValues(alpha: 0.5)),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.cyanAccent.withValues(alpha: 0.2),
                                blurRadius: 8,
                              ),
                            ],
                          ),
                          child: const Icon(
                            Icons.account_balance_wallet,
                            color: Colors.cyanAccent,
                            size: 26,
                          ),
                        ),
                    const SizedBox(width: 20),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Solde Wallet (XOF)',
                            style: TextStyle(
                              color: Colors.white70,
                              fontSize: 13,
                              fontWeight: FontWeight.w600,
                              letterSpacing: 0.5,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              Text(
                                _walletBalance != null ? _walletBalance.toString().replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]} ') : '---',
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 32,
                                  fontWeight: FontWeight.w900,
                                  letterSpacing: -1.0,
                                ),
                              ),
                              const SizedBox(width: 6),
                              Padding(
                                padding: const EdgeInsets.only(bottom: 6),
                                child: Text(
                                  'FCFA',
                                  style: TextStyle(
                                    color: Colors.cyanAccent.withValues(alpha: 0.9),
                                    fontSize: 14,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          GestureDetector(
                            onTap: () {
                              Navigator.pushNamed(context, '/wallet');
                            },
                            child: const Row(
                              children: [
                                Text(
                                  'Voir mon compte',
                                  style: TextStyle(
                                    color: Colors.cyanAccent,
                                    fontSize: 13,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                SizedBox(width: 4),
                                Icon(Icons.arrow_forward, size: 14, color: Colors.cyanAccent),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
);
}

  Widget _buildActionButtons() {
    return Center(
      child: Column(
        children: [
          SizedBox(
            width: 330,
            child: ElevatedButton.icon(
              onPressed: () {
                showRechargeModal(context);
              },
              icon: Icon(Icons.flash_on, color: Theme.of(context).colorScheme.onSurface),
              label: const Text('Recharger via Wave ou OM'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.deepOrangeAccent,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 20),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
                textStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                elevation: 8,
                shadowColor: Colors.orange.withValues(alpha: 0.5),
              ),
            ),
          ),
          const SizedBox(height: 16),
          SizedBox(
            width: 330,
            child: ElevatedButton.icon(
              onPressed: () {
                _showReservationBottomSheet(context);
              },
              icon: const Icon(Icons.directions_car, color: Colors.black),
              label: const Text('Réserver une voiture'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.white,
                foregroundColor: Colors.black,
                padding: const EdgeInsets.symmetric(vertical: 20),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
                textStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                elevation: 4,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildServicesSection(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Container(
              width: 4,
              height: 24,
              decoration: BoxDecoration(
                color: Colors.orange,
                borderRadius: BorderRadius.circular(4),
              ),
            ),
            const SizedBox(width: 12),
            Text(
              'Vos Services', style: TextStyle(color: Theme.of(context).colorScheme.onSurface,
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
        const SizedBox(height: 20),
        GridView.builder(
          physics: const NeverScrollableScrollPhysics(),
          shrinkWrap: true,
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            crossAxisSpacing: 16,
            mainAxisSpacing: 16,
            childAspectRatio: 0.70,
          ),
          itemCount: services.length,
          itemBuilder: (context, index) {
            final service = services[index];
            return GestureDetector(
              onTap: () {
                if (service['route'] != null) {
                  Navigator.pushNamed(context, service['route']);
                }
              },
              child: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      Theme.of(context).brightness == Brightness.dark ? const Color(0xFF1E293B) : Colors.white, 
                      Theme.of(context).cardColor
                    ],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: service['color'].withValues(alpha: 0.3), width: 1.5),
                  boxShadow: [
                    BoxShadow(
                      color: Theme.of(context).brightness == Brightness.dark ? Colors.black.withValues(alpha: 0.4) : Colors.black.withValues(alpha: 0.05),
                      blurRadius: 15,
                      offset: const Offset(0, 8),
                    ),
                  ],
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(24),
                  child: Stack(
                    children: [
                      // Faint background icon
                      Positioned(
                        bottom: -15,
                        right: -15,
                        child: Transform.rotate(
                          angle: -0.2,
                          child: Icon(
                            service['icon'],
                            size: 100,
                            color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.04),
                          ),
                        ),
                      ),
                      // Foreground Content
                      Padding(
                        padding: const EdgeInsets.all(20),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: service['color'].withOpacity(0.1),
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(color: service['color'].withOpacity(0.3)),
                              ),
                              child: Icon(
                                service['icon'],
                                color: service['color'],
                                size: 28,
                              ),
                            ),
                            const SizedBox(height: 12),
                            FittedBox(
                              fit: BoxFit.scaleDown,
                              alignment: Alignment.centerLeft,
                              child: Text(
                                service['title'],
                                style: TextStyle(color: Theme.of(context).colorScheme.onSurface,
                                  fontSize: 18,
                                  fontWeight: FontWeight.w900,
                                  letterSpacing: -0.5,
                                ),
                                maxLines: 1,
                              ),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              service['description'],
                              style: TextStyle(
                                color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.6),
                                fontSize: 12,
                                height: 1.3,
                              ),
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                            ),
                            const Spacer(),
                            Row(
                              children: [
                                Text(
                                  'Ouvrir',
                                  style: TextStyle(
                                    color: service['color'],
                                    fontSize: 13,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(width: 6),
                                Icon(Icons.arrow_forward_rounded, size: 16, color: service['color']),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            );
          },
        ),
      ],
    );
  }

  Widget _buildActivitySummarySection(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: const Color(0xFFF97316).withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Icon(Icons.analytics_rounded, color: Color(0xFFF97316), size: 20),
            ),
            const SizedBox(width: 12),
            Text(
              "Aperçu de l'activité", style: TextStyle(color: Theme.of(context).colorScheme.onSurface,
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
        const SizedBox(height: 20),
        _buildActivityCard(context, 'Points Cumulés', 'X', Icons.stars_rounded, const Color(0xFFEAB308)),
        const SizedBox(height: 12),
        _buildActivityCard(context, 'Dernier Billet', 'X', Icons.directions_car_rounded, const Color(0xFF3B82F6)),
        const SizedBox(height: 12),
        _buildActivityCard(context, 'Dernier Colis', 'X', Icons.local_shipping_rounded, const Color(0xFF10B981)),
      ],
    );
  }

  Widget _buildActivityCard(BuildContext context, String title, String value, IconData icon, Color color) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E293B) : Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color.withValues(alpha: 0.2)),
        boxShadow: [
          BoxShadow(
            color: isDark ? Colors.black.withValues(alpha: 0.2) : Colors.black.withValues(alpha: 0.03),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Icon(icon, color: color, size: 24),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Text(
              title,
              style: TextStyle(
                color: Theme.of(context).colorScheme.onSurface,
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF0F172A) : const Color(0xFFF1F5F9),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Text(
              value,
              style: TextStyle(
                color: Theme.of(context).colorScheme.onSurface,
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLiveStatusSection(BuildContext context) {
    return GestureDetector(
      onTap: () {
        if (activeParcels.isNotEmpty) {
          Navigator.push(context, MaterialPageRoute(
            builder: (context) => driver_live_tracking_screen.DriverLiveTrackingScreen(
              mission: {
                'trajet': 'Dakar → Touba',
                'statut': 'En transit',
                'destinataire': 'Client',
              },
            ),
          ));
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text("Vous n'avez aucun colis en cours de livraison."),
              backgroundColor: Colors.orange,
              duration: Duration(seconds: 3),
            ),
          );
        }
      },
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: const Color(0xFF151C2C), // Fond sombre similaire au design
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: const Color(0xFF10B981).withValues(alpha: 0.3)), // Bordure verte
          boxShadow: [
            BoxShadow(
              color: const Color(0xFF10B981).withValues(alpha: 0.05),
              blurRadius: 15,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFF10B981).withValues(alpha: 0.2), // Fond cercle vert foncé
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.inventory_2, color: Color(0xFF10B981), size: 24),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Colis en transit',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 4),
                  activeParcels.isNotEmpty 
                    ? Text(
                        'Dakar → Touba • Arrivée estimée : 14h30',
                        style: TextStyle(
                          color: Colors.white.withValues(alpha: 0.6),
                          fontSize: 13,
                        ),
                      )
                    : Text(
                        "Vos colis en transit s'afficheront ici.",
                        style: TextStyle(
                          color: Colors.white.withValues(alpha: 0.5),
                          fontSize: 13,
                          fontStyle: FontStyle.italic,
                        ),
                      ),
                ],
              ),
            ),
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(color: const Color(0xFF10B981).withValues(alpha: 0.5)),
              ),
              child: const Icon(Icons.arrow_forward, size: 16, color: Color(0xFF10B981)),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPromoCarousel(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0),
          child: Text(
            'Offres Exclusives',
            style: TextStyle(
              color: Theme.of(context).colorScheme.onSurface,
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        const SizedBox(height: 16),
        SizedBox(
          height: 140,
          child: PageView(
            controller: _promoController,
            children: [
          GestureDetector(
            onTap: () => Navigator.pushNamed(context, '/parrainage'),
            child: _buildPromoCard(
              context,
              'Parrainez un proche',
              'Gagnez 1000 FCFA sur votre prochain trajet',
              const Color(0xFFF97316),
              Icons.card_giftcard,
            ),
          ),
          GestureDetector(
            onTap: () => Navigator.pushNamed(context, '/colis'),
            child: _buildPromoCard(
              context,
              'Voyagez Léger',
              '-10% sur les envois de colis cette semaine',
              const Color(0xFF10B981),
              Icons.local_offer,
            ),
          ),
        ],
      ),
    ),
      ],
    );
  }

  Widget _buildPromoCard(BuildContext context, String title, String subtitle, Color color, IconData icon) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 8),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [color.withValues(alpha: 0.8), color],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: color.withValues(alpha: 0.4),
            blurRadius: 15,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  title,
                  style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 8),
                Text(
                  subtitle,
                  style: const TextStyle(color: Colors.white70, fontSize: 13),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
          Icon(icon, color: Colors.white.withValues(alpha: 0.5), size: 60),
        ],
      ),
    );
  }

  Widget _buildRecentHistory(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Historique Récent',
          style: TextStyle(
            color: Theme.of(context).colorScheme.onSurface,
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 20),
        if (recentHistory.isNotEmpty) ...[
          _buildTimelineItem(context, 'Réservation confirmée', 'Dakar - Touba', 'Il y a 2h', Icons.check_circle, const Color(0xFF10B981), isLast: false),
          _buildTimelineItem(context, 'Colis livré', 'Touba - Dakar', 'Hier', Icons.local_shipping, const Color(0xFF3B82F6), isLast: true),
        ] else
          Center(
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: 20),
              child: Column(
                children: [
                  Container(
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.05),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(Icons.history, color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.3)),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    'Aucun historique récent',
                    style: TextStyle(
                      color: Theme.of(context).colorScheme.onSurface,
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Vos dernières activités apparaîtront ici.',
                    style: TextStyle(
                      color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.5),
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
            ),
          ),
      ],
    );
  }

  Widget _buildTimelineItem(BuildContext context, String title, String subtitle, String time, IconData icon, Color color, {required bool isLast}) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Column(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: color, size: 16),
            ),
            if (!isLast)
              Container(
                width: 2,
                height: 30,
                color: Theme.of(context).dividerColor,
              ),
          ],
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: TextStyle(
                  color: Theme.of(context).colorScheme.onSurface,
                  fontSize: 15,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                subtitle,
                style: TextStyle(
                  color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.6),
                  fontSize: 13,
                ),
              ),
              if (!isLast) const SizedBox(height: 20),
            ],
          ),
        ),
        Text(
          time,
          style: TextStyle(
            color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.5),
            fontSize: 12,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }

  Widget _buildPopularDestinations(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0),
          child: Text(
            'Destinations Populaires',
            style: TextStyle(
              color: Theme.of(context).colorScheme.onSurface,
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        const SizedBox(height: 16),
        SizedBox(
          height: 180,
          child: ListView.separated(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            scrollDirection: Axis.horizontal,
            itemCount: _destinations.length,
            separatorBuilder: (context, index) => const SizedBox(width: 16),
            itemBuilder: (context, index) {
              final dest = _destinations[index];
              return _buildDestinationCard(context, dest['name']!, dest['price']!, dest['image']!);
            },
          ),
        ),
      ],
    );
  }

  Widget _buildDestinationCard(BuildContext context, String city, String price, String imageUrl) {
    return GestureDetector(
      onTap: () {
        _showReservationBottomSheet(context, initialOrigin: _currentCity, initialDestination: city, initialPickupAddress: _currentAddress);
      },
      child: Container(
      width: 140,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        color: Theme.of(context).cardColor,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.1),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20),
        child: Stack(
          fit: StackFit.expand,
          children: [
            Image.asset(
              imageUrl,
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) => Container(color: Colors.grey[300]),
            ),
            Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [Colors.transparent, Colors.black.withValues(alpha: 0.8)],
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.end,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    city,
                    style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 4),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF97316),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      price,
                      style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        ),
      ),
    );
  }
  void _showReservationBottomSheet(BuildContext context, {String? initialOrigin, String? initialDestination, String? initialPickupAddress}) {
    bool isLocating = false;
    int step = 1;
    bool isSearching = false;
    String errorMessage = '';
    List<dynamic> realTrips = [];
    dynamic selectedTrip;
    String? selectedSeat;
    String? ticketPour;
    String? paymentMethod;
    String nom = _userName;
    String telephone = _userPhone;
    String email = 'abdou@example.com';
    int bagages = 0;
    bool isQueued = false;
    String queueMessage = '';
    List<dynamic> alternativeTrips = [];

    final departController = TextEditingController(text: initialOrigin ?? '');
    final pickupController = TextEditingController(text: initialPickupAddress ?? '');
    final arriveeController = TextEditingController(text: initialDestination ?? '');
    final quartierController = TextEditingController();
    String? date;
    String? passagers = '1 Passager';
    final GlobalKey ticketKey = GlobalKey();

    Future<void> handleGeolocate(StateSetter setState) async {
      bool serviceEnabled;
      LocationPermission permission;
      serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        if (context.mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Les services de localisation sont désactivés.")));
        return;
      }
      permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) {
          if (context.mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("La permission a été refusée.")));
          return;
        }
      }
      if (permission == LocationPermission.deniedForever) {
        if (context.mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Permissions refusées de manière permanente.")));
        return;
      }
      setState(() => isLocating = true);
      try {
        Position position = await Geolocator.getCurrentPosition(desiredAccuracy: LocationAccuracy.high);
        final lat = position.latitude;
        final lon = position.longitude;
        const googleMapsApiKey = 'AIzaSyBEcIPoabk6yTJNGU06FjC5251syM9FGqA';
        final response = await http.get(Uri.parse('https://maps.googleapis.com/maps/api/geocode/json?latlng=$lat,$lon&key=$googleMapsApiKey'));
        if (response.statusCode == 200) {
          final data = json.decode(response.body);
          if (data['status'] == 'OK' && data['results'].isNotEmpty) {
            final result = data['results'][0];
            String address = result['formatted_address'] ?? '';
            String city = '';
            if (result['address_components'] != null) {
              for (var component in result['address_components']) {
                List types = component['types'] ?? [];
                if (types.contains('locality')) {
                  city = component['long_name'];
                  break;
                }
              }
              if (city.isEmpty) {
                for (var component in result['address_components']) {
                  List types = component['types'] ?? [];
                  if (types.contains('administrative_area_level_1')) {
                    city = component['long_name'];
                    break;
                  }
                }
              }
            }
            setState(() {
              pickupController.text = address;
              if (city.isNotEmpty) {
                departController.text = '$city, Sénégal';
              }
            });
          } else {
            setState(() { pickupController.text = 'Point GPS: ${lat.toStringAsFixed(5)}, ${lon.toStringAsFixed(5)}'; });
          }
        } else {
          setState(() { pickupController.text = 'Point GPS: ${lat.toStringAsFixed(5)}, ${lon.toStringAsFixed(5)}'; });
        }
      } catch (e) {
        if (context.mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Impossible de récupérer l'adresse.")));
      } finally {
        setState(() => isLocating = false);
      }
    }

    showDialog(
      context: context,
      barrierDismissible: true,
      barrierColor: Colors.black.withValues(alpha: 0.8),
      builder: (context) {
        final isDark = Theme.of(context).brightness == Brightness.dark;
        final bgColor = isDark ? const Color(0xFF000000) : Colors.white;
        final headerBgColor = isDark ? const Color(0xFF0A0A0A) : const Color(0xFFF8FAFC);
        final borderColor = isDark ? const Color(0xFF2A2A2A) : const Color(0xFFE2E8F0);
        final textColor = isDark ? Colors.white : const Color(0xFF0F172A);
        final textMutedColor = isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B);
        return Stack(
          children: [
            Positioned.fill(
              child: BackdropFilter(
                filter: ui.ImageFilter.blur(sigmaX: 8.0, sigmaY: 8.0),
                child: const SizedBox(),
              ),
            ),
            StatefulBuilder(
              builder: (context, setState) {
                Widget buildStep1() {
              return Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Où allez-vous avec Allo Dakar ?', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 18, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 16),
                  _buildPlacesAutocomplete('Ville de départ (ex: Dakar)', departController, icon: Icons.location_on),
                  const SizedBox(height: 12),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF97316).withValues(alpha: 0.05),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: const Color(0xFFF97316).withValues(alpha: 0.3)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Expanded(child: Text('Adresse de prise en charge (Google Places)', style: TextStyle(color: Color(0xFFFB923C), fontSize: 12, fontWeight: FontWeight.bold))),
                            const SizedBox(width: 8),
                            GestureDetector(
                              onTap: isLocating ? null : () => handleGeolocate(setState),
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                decoration: BoxDecoration(
                                  color: isLocating ? const Color(0xFFF97316).withValues(alpha: 0.5) : const Color(0xFFF97316),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Row(
                                  children: [
                                    Icon(Icons.my_location, color: Theme.of(context).colorScheme.onSurface, size: 12),
                                    const SizedBox(width: 4),
                                    Text(isLocating ? 'Patientez...' : 'Me localiser', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 10, fontWeight: FontWeight.bold)),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        _buildPlacesAutocomplete(
                          'Entrez l\'adresse exacte du passager',
                          pickupController,
                          borderRadius: 8,
                          contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 12),
                  _buildPlacesAutocomplete('Ville d\'arrivée (ex: Saly)', arriveeController, icon: Icons.location_on, iconColor: const Color(0xFFF97316)),
                  const SizedBox(height: 12),
                  _buildPlacesAutocomplete('Quartier ou point de chute exact', quartierController, icon: Icons.pin_drop),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(child: _buildDropdownInput(Icons.calendar_month, 'Date de départ', ['Aujourd\'hui', 'Demain', 'Après-demain'], date, (val) => setState(() => date = val))),
                      const SizedBox(width: 12),
                      Expanded(child: _buildDropdownInput(Icons.group, 'Passagers', ['1 Passager', '2 Passagers', '3 Passagers', '4 Passagers'], passagers, (val) => setState(() => passagers = val))),
                    ],
                  ),
                ],
              );
            }

            Widget buildStep2() {
              List<Widget> tripWidgets = [];
              for (var t in realTrips) {
                int requestedPassengers = int.tryParse((passagers ?? '1').split(' ')[0]) ?? 1;
                int availableSeats = t['availableSeats'] ?? 5;
                bool isFull = requestedPassengers > availableSeats;

                tripWidgets.add(
                  GestureDetector(
                    onTap: () {
                      if (isFull) {
                        setState(() { errorMessage = 'Places insuffisantes pour ce trajet.'; });
                        return;
                      }
                      setState(() {
                        selectedTrip = t;
                        step = 3;
                      });
                    },
                    child: Container(
                      margin: const EdgeInsets.only(bottom: 12),
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: isDark ? const Color(0xFF1A1A1A) : const Color(0xFFF8FAFC),
                        border: Border.all(color: isFull ? Colors.red.withValues(alpha: 0.5) : borderColor),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(t['company'] as String, style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.bold, fontSize: 16)),
                                const SizedBox(height: 4),
                                Text('${t['type']} • ${t['options']}', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 12)),
                                if (isFull)
                                  Padding(
                                    padding: const EdgeInsets.only(top: 4),
                                    child: Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                      decoration: BoxDecoration(color: Colors.red.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(8)),
                                      child: Text('Places insuffisantes ($availableSeats)', style: const TextStyle(color: Colors.red, fontSize: 10, fontWeight: FontWeight.bold)),
                                    ),
                                  )
                              ],
                            ),
                          ),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              Text('${t['price']} FCFA', style: const TextStyle(color: Colors.orangeAccent, fontWeight: FontWeight.bold, fontSize: 16)),
                              const SizedBox(height: 4),
                              Text('Départ à ${t['time']}', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.bold, fontSize: 12)),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              }
              return Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Padding(
                    padding: EdgeInsets.only(bottom: 12),
                    child: Text('Choix du véhicule Allo Dakar', style: TextStyle(color: textMutedColor, fontSize: 14, fontWeight: FontWeight.bold)),
                  ),
                  if (realTrips.isEmpty)
                    Container(
                      padding: const EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        color: isDark ? const Color(0xFF1A1A1A) : const Color(0xFFF8FAFC),
                        border: Border.all(color: borderColor),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Center(
                        child: Text("Aucun trajet trouvé pour cette date.", style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant)),
                      ),
                    )
                  else
                    ...tripWidgets,
                ],
              );
            }

            Widget buildStep3() {
              if (ticketPour == null) {
                return Column(
                  children: [
                    Icon(Icons.person, size: 64, color: Color(0xFFF97316)),
                    SizedBox(height: 16),
                    Text('Pour qui est ce billet ?', style: TextStyle(color: textColor, fontSize: 20, fontWeight: FontWeight.bold)),
                    SizedBox(height: 8),
                    Text('Veuillez sélectionner le bénéficiaire.', style: TextStyle(color: textMutedColor)),
                    SizedBox(height: 32),
                    Row(
                      children: [
                        Expanded(
                          child: GestureDetector(
                            onTap: () => setState(() {
                              ticketPour = 'moi';
                              nom = _userName;
                              telephone = _userPhone;
                            }),
                            child: Container(
                              padding: EdgeInsets.all(24),
                              decoration: BoxDecoration(
                                color: isDark ? const Color(0xFF1A1A1A) : const Color(0xFFF8FAFC).withValues(alpha: 0.5),
                                border: Border.all(color: borderColor, width: 2),
                                borderRadius: BorderRadius.circular(24),
                              ),
                              child: Column(
                                children: [
                                  Icon(Icons.person, color: textMutedColor, size: 32),
                                  SizedBox(height: 12),
                                  Text("C'est pour moi", style: TextStyle(color: textColor, fontWeight: FontWeight.bold)),
                                  Text("Mon profil", style: TextStyle(color: textMutedColor, fontSize: 12)),
                                ],
                              ),
                            ),
                          ),
                        ),
                        SizedBox(width: 16),
                        Expanded(
                          child: GestureDetector(
                            onTap: () => setState(() {
                              ticketPour = 'autre';
                              nom = '';
                              telephone = '';
                            }),
                            child: Container(
                              padding: EdgeInsets.all(24),
                              decoration: BoxDecoration(
                                color: isDark ? const Color(0xFF1A1A1A) : const Color(0xFFF8FAFC).withValues(alpha: 0.5),
                                border: Border.all(color: borderColor, width: 2),
                                borderRadius: BorderRadius.circular(24),
                              ),
                              child: Column(
                                children: [
                                  Icon(Icons.group, color: textMutedColor, size: 32),
                                  SizedBox(height: 12),
                                  Text("Pour un proche", style: TextStyle(color: textColor, fontWeight: FontWeight.bold)),
                                  Text("Nouvelles infos", style: TextStyle(color: textMutedColor, fontSize: 12)),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                );
              }

              return Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: isDark ? const Color(0xFF141414) : Colors.white,
                      border: Border.all(color: borderColor),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(8),
                              decoration: const BoxDecoration(color: Color(0xFFF97316), shape: BoxShape.circle),
                              child: Icon(ticketPour == 'moi' ? Icons.person : Icons.group, color: Colors.white, size: 20),
                            ),
                            const SizedBox(width: 12),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('Billet destiné à', style: TextStyle(color: textMutedColor, fontSize: 12)),
                                Text(ticketPour == 'moi' ? 'Moi-même' : 'Un proche', style: TextStyle(color: textColor, fontWeight: FontWeight.bold)),
                              ],
                            ),
                          ],
                        ),
                        TextButton(
                          onPressed: () => setState(() => ticketPour = null),
                          child: const Text('Modifier', style: TextStyle(color: Color(0xFFF97316))),
                        )
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
                  Text('Nom Complet', style: TextStyle(color: textMutedColor, fontSize: 12, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  TextField(
                    controller: TextEditingController(text: nom)..selection = TextSelection.collapsed(offset: nom.length),
                    onChanged: (v) => setState(() => nom = v),
                    style: TextStyle(color: textColor),
                    decoration: InputDecoration(
                      filled: true,
                      fillColor: Theme.of(context).brightness == Brightness.dark ? Colors.black : Colors.white,
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: borderColor)),
                      enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: borderColor)),
                      focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFF97316))),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text('Téléphone', style: TextStyle(color: textMutedColor, fontSize: 12, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  TextField(
                    controller: TextEditingController(text: telephone)..selection = TextSelection.collapsed(offset: telephone.length),
                    onChanged: (v) => setState(() => telephone = v),
                    style: TextStyle(color: textColor),
                    keyboardType: TextInputType.phone,
                    decoration: InputDecoration(
                      filled: true,
                      fillColor: Theme.of(context).brightness == Brightness.dark ? Colors.black : Colors.white,
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: borderColor)),
                      enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: borderColor)),
                      focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFF97316))),
                    ),
                  ),
                ],
              );
            }

            Widget buildStep4() {
              int passagersCount = int.tryParse((passagers ?? '1').split(' ')[0]) ?? 1;
              int basePrice = selectedTrip?['price'] ?? 5000;
              int total = basePrice * passagersCount;

              Widget buildPaymentMethodOption(String id, String name, IconData icon, Color color, {Widget? customIcon}) {
                bool isSelected = paymentMethod == id;
                return GestureDetector(
                  onTap: () => setState(() => paymentMethod = id),
                  child: Container(
                    decoration: BoxDecoration(
                      color: isSelected ? color.withValues(alpha: 0.1) : Theme.of(context).cardColor,
                      border: Border.all(color: isSelected ? color : Theme.of(context).dividerColor, width: isSelected ? 2 : 1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        customIcon ?? Icon(icon, color: isSelected ? color : (isDark ? Colors.white70 : Colors.black54), size: 20),
                        const SizedBox(width: 8),
                        Flexible(child: Text(name, style: TextStyle(color: isSelected ? color : (isDark ? Colors.white70 : Colors.black54), fontSize: 12, fontWeight: isSelected ? FontWeight.bold : FontWeight.normal), overflow: TextOverflow.ellipsis)),
                      ],
                    ),
                  ),
                );
              }

              return Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: isDark ? const Color(0xFF1A1A1A) : const Color(0xFFF8FAFC),
                      border: Border.all(color: borderColor),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Résumé de la commande', style: TextStyle(color: textColor, fontWeight: FontWeight.bold, fontSize: 16)),
                        const SizedBox(height: 16),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Expanded(child: Text('Billet ${selectedTrip?['company'] ?? 'Allo Dakar'}', style: TextStyle(color: textMutedColor), overflow: TextOverflow.ellipsis)),
                            const SizedBox(width: 8),
                            Text('$total FCFA', style: TextStyle(color: textColor, fontWeight: FontWeight.bold)),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text('Taxes et frais', style: TextStyle(color: textMutedColor, fontSize: 12)),
                            Text('0 FCFA', style: TextStyle(color: textMutedColor, fontSize: 12)),
                          ],
                        ),
                        Padding(
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          child: Divider(color: borderColor),
                        ),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text('Total à payer', style: TextStyle(color: textColor, fontWeight: FontWeight.bold)),
                            Text('$total FCFA', style: const TextStyle(color: Color(0xFFF97316), fontWeight: FontWeight.bold, fontSize: 18)),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
                  Text('Moyen de paiement', style: TextStyle(color: textMutedColor, fontWeight: FontWeight.bold, fontSize: 14)),
                  const SizedBox(height: 12),
                  GridView.count(
                    crossAxisCount: 2,
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    mainAxisSpacing: 12,
                    crossAxisSpacing: 12,
                    childAspectRatio: 2.5,
                    children: [
                      buildPaymentMethodOption('CASH', 'Payer à l\'arrivée', Icons.payments_outlined, const Color(0xFF059669)),
                      buildPaymentMethodOption('wave', 'Wave', Icons.phone_android, const Color(0xFF2563EB)),
                      buildPaymentMethodOption('om', 'Orange Money', Icons.phone_android, const Color(0xFFF97316), customIcon: const OrangeMoneyLogo(size: 20)),
                      buildPaymentMethodOption('wallet', 'Wallet', Icons.account_balance_wallet, const Color(0xFF9CA3AF)),
                    ],
                  ),
                  if (isQueued) ...[
                    const SizedBox(height: 24),
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF97316).withValues(alpha: 0.1),
                        border: Border.all(color: const Color(0xFFF97316).withValues(alpha: 0.2)),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Column(
                        children: [
                          const Center(child: CircularProgressIndicator(color: Color(0xFFF97316))),
                          const SizedBox(height: 12),
                          const Center(child: Text('File d\'attente', style: TextStyle(color: Color(0xFFF97316), fontWeight: FontWeight.bold, fontSize: 16))),
                          const SizedBox(height: 4),
                          Text(queueMessage.isNotEmpty ? queueMessage : "Un autre client réserve une place devant vous. Veuillez patienter...", textAlign: TextAlign.center, style: const TextStyle(color: Color(0xFFF97316), fontSize: 12)),
                        ],
                      ),
                    ),
                  ],
                  if (alternativeTrips.isNotEmpty) ...[
                    const SizedBox(height: 24),
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.red.withValues(alpha: 0.1),
                        border: Border.all(color: Colors.red.withValues(alpha: 0.2)),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              const Icon(Icons.error_outline, color: Colors.red),
                              const SizedBox(width: 8),
                              const Text('Véhicule complet !', style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold, fontSize: 16)),
                            ],
                          ),
                          const SizedBox(height: 8),
                          const Text("La voiture que vous avez choisie vient d'être remplie. Voici d'autres trajets disponibles :", style: TextStyle(color: Colors.red, fontSize: 12)),
                          const SizedBox(height: 12),
                          ...alternativeTrips.map((alt) => GestureDetector(
                            onTap: () {
                              setState(() {
                                selectedTrip = alt;
                                alternativeTrips = [];
                                errorMessage = '';
                              });
                            },
                            child: Container(
                              margin: const EdgeInsets.only(bottom: 8),
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: Theme.of(context).cardColor,
                                border: Border.all(color: Theme.of(context).dividerColor),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text('${DateTime.parse(alt['departureTime']).toLocal().toString().substring(11, 16)} - ${alt['companyName'] ?? 'Allo Dakar'}', style: const TextStyle(fontWeight: FontWeight.bold)),
                                      Text('${alt['availableSeats']} place(s) dispo', style: const TextStyle(color: Colors.grey, fontSize: 12)),
                                    ],
                                  ),
                                  Text('${alt['pricePerSeat'] ?? alt['price'] ?? 5000} FCFA', style: const TextStyle(color: Color(0xFFF97316), fontWeight: FontWeight.bold)),
                                ],
                              ),
                            ),
                          )).toList(),
                        ],
                      ),
                    ),
                  ],
                ],
              );
            }

            Widget buildStep5() {
              int passagersCount = int.tryParse((passagers ?? '1').split(' ')[0]) ?? 1;
              int basePrice = selectedTrip?['price'] ?? 5000;
              int total = basePrice * passagersCount;
              String departCity = departController.text.isNotEmpty ? departController.text : 'Dakar, Sénégal';
              String arriveeCity = arriveeController.text.isNotEmpty ? arriveeController.text : 'Touba, Sénégal';
              String dateStr = date ?? 'Aujourd\'hui';

              return Column(
                children: [
                  Container(
                    width: 80,
                    height: 80,
                    decoration: BoxDecoration(
                      color: const Color(0xFF10B981).withValues(alpha: 0.2),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.check_circle, color: Color(0xFF10B981), size: 40),
                  ),
                  const SizedBox(height: 24),
                  Text('Paiement Réussi !', style: TextStyle(color: textColor, fontSize: 24, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  Text('Votre billet a été généré.', textAlign: TextAlign.center, style: TextStyle(color: textMutedColor, fontSize: 14)),
                  const SizedBox(height: 32),
                  RepaintBoundary(
                    key: ticketKey,
                    child: Container(
                      width: double.infinity,
                      decoration: BoxDecoration(
                        color: const Color(0xFF0F172A),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Column(
                        children: [
                          // Header ticket
                        Container(
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          decoration: const BoxDecoration(
                            color: Color(0xFF0A0A0A),
                            borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
                            border: Border(bottom: BorderSide(color: Color(0xFFF97316), width: 3)),
                          ),
                          child: Column(
                            children: [
                              Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  const Icon(Icons.directions_car, color: Color(0xFFF97316)),
                                  const SizedBox(width: 8),
                                  Text('Aller', style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
                                  const Text('Retour', style: TextStyle(color: Color(0xFFF97316), fontSize: 20, fontWeight: FontWeight.bold)),
                                ],
                              ),
                              const SizedBox(height: 4),
                              Text('Billet Confirmé : ${selectedTrip?['company'] ?? 'Allogoo'}', style: TextStyle(color: textMutedColor, fontSize: 12)),
                            ],
                          ),
                        ),
                        
                        // Body ticket
                        Padding(
                          padding: const EdgeInsets.all(24),
                          child: Column(
                            children: [
                              // Trajet
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text('DÉPART', style: TextStyle(color: Color(0xFF64748B), fontSize: 10, fontWeight: FontWeight.bold)),
                                        SizedBox(height: 4),
                                        Text(departCity.split(',')[0], style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w900)),
                                        Text('Sénégal', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w900)),
                                      ],
                                    ),
                                  ),
                                  Icon(Icons.arrow_forward, color: Color(0xFFF97316)),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.end,
                                      children: [
                                        Text('ARRIVÉE', style: TextStyle(color: Color(0xFF64748B), fontSize: 10, fontWeight: FontWeight.bold)),
                                        SizedBox(height: 4),
                                        Text(arriveeCity.split(',')[0], style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w900)),
                                        Text('Sénégal', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w900)),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                              
                              Padding(
                                padding: EdgeInsets.symmetric(vertical: 16),
                                child: Text('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -', style: TextStyle(color: Color(0xFFE2E8F0)), maxLines: 1, overflow: TextOverflow.clip),
                              ),
                              
                              // Infos 1
                              Row(
                                children: [
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text('PASSAGER', style: TextStyle(color: Color(0xFF64748B), fontSize: 10, fontWeight: FontWeight.bold)),
                                        SizedBox(height: 4),
                                        Text(nom, style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold)),
                                      ],
                                    ),
                                  ),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text('PLACES', style: TextStyle(color: Color(0xFF64748B), fontSize: 10, fontWeight: FontWeight.bold)),
                                        SizedBox(height: 4),
                                        Text('$passagersCount', style: TextStyle(color: Color(0xFFEA580C), fontSize: 16, fontWeight: FontWeight.bold)),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                              
                              SizedBox(height: 16),
                              
                              // Infos 2
                              Row(
                                children: [
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text('DATE & HEURE', style: TextStyle(color: Color(0xFF64748B), fontSize: 10, fontWeight: FontWeight.bold)),
                                        SizedBox(height: 4),
                                        Text('$dateStr à\nFlexible', style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold)),
                                      ],
                                    ),
                                  ),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text('PRIX TOTAL', style: TextStyle(color: Color(0xFF64748B), fontSize: 10, fontWeight: FontWeight.bold)),
                                        SizedBox(height: 4),
                                        Text('$total FCFA', style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold)),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                              
                              Padding(
                                padding: EdgeInsets.symmetric(vertical: 16),
                                child: Text('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -', style: TextStyle(color: Color(0xFFE2E8F0)), maxLines: 1, overflow: TextOverflow.clip),
                              ),
                              
                              // QR Code
                              Container(
                                padding: EdgeInsets.all(16),
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  borderRadius: BorderRadius.circular(24),
                                  border: Border.all(color: Colors.white, width: 4),
                                ),
                                child: Stack(
                                  alignment: Alignment.center,
                                  children: [
                                    QrImageView(
                                      data: 'ALLORETOUR-$nom-$departCity-$arriveeCity',
                                      version: QrVersions.auto,
                                      size: 160.0,
                                      padding: EdgeInsets.zero,
                                      dataModuleStyle: QrDataModuleStyle(
                                        dataModuleShape: QrDataModuleShape.circle,
                                        color: Colors.black,
                                      ),
                                      eyeStyle: QrEyeStyle(
                                        eyeShape: QrEyeShape.square,
                                        color: Colors.black,
                                      ),
                                    ),
                                    Container(
                                      width: 40,
                                      height: 40,
                                      color: Color(0xFFEA580C),
                                      alignment: Alignment.center,
                                      child: Text('AR', style: TextStyle(color: textColor, fontWeight: FontWeight.bold, fontSize: 16)),
                                    ),
                                  ],
                                ),
                              ),
                              
                              SizedBox(height: 16),
                              Text('Scanner au moment de l\'embarquement', style: TextStyle(color: Color(0xFF10B981), fontSize: 12, fontWeight: FontWeight.bold)),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  ), // Closing RepaintBoundary
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton(
                          onPressed: () async {
                            try {
                              RenderRepaintBoundary boundary = ticketKey.currentContext!.findRenderObject() as RenderRepaintBoundary;
                              ui.Image image = await boundary.toImage(pixelRatio: 3.0);
                              ByteData? byteData = await image.toByteData(format: ui.ImageByteFormat.png);
                              Uint8List pngBytes = byteData!.buffer.asUint8List();
                              final file = XFile.fromData(pngBytes, name: 'billet.png', mimeType: 'image/png');
                              await Share.shareXFiles([file], text: 'Voici mon billet Allo Dakar !');
                            } catch (e) {}
                          },
                          style: ElevatedButton.styleFrom(backgroundColor: Theme.of(context).cardColor, padding: const EdgeInsets.symmetric(vertical: 12), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
                          child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [Icon(Icons.download, size: 16, color: textColor), const SizedBox(width: 4), Flexible(child: Text('Billet', style: TextStyle(color: textColor, fontSize: 12, fontWeight: FontWeight.bold), overflow: TextOverflow.ellipsis))]),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: ElevatedButton(
                          onPressed: () async {
                            try {
                              RenderRepaintBoundary boundary = ticketKey.currentContext!.findRenderObject() as RenderRepaintBoundary;
                              ui.Image image = await boundary.toImage(pixelRatio: 3.0);
                              ByteData? byteData = await image.toByteData(format: ui.ImageByteFormat.png);
                              Uint8List pngBytes = byteData!.buffer.asUint8List();
                              final file = XFile.fromData(pngBytes, name: 'billet.png', mimeType: 'image/png');
                              await Share.shareXFiles([file], text: 'Voici mon billet Allo Dakar !');
                            } catch (e) {}
                          },
                          style: ElevatedButton.styleFrom(backgroundColor: Theme.of(context).cardColor, padding: const EdgeInsets.symmetric(vertical: 12), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
                          child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [Icon(Icons.share, size: 16, color: textColor), const SizedBox(width: 4), Flexible(child: Text('Partager', style: TextStyle(color: textColor, fontSize: 12, fontWeight: FontWeight.bold), overflow: TextOverflow.ellipsis))]),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: ElevatedButton(
                          onPressed: () async {
                            final url = Uri.parse('whatsapp://send?text=Voici mon billet Allo Dakar !');
                            try { await launchUrl(url); } catch (e) { if (context.mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Erreur WhatsApp'))); }
                          },
                          style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF25D366), padding: const EdgeInsets.symmetric(vertical: 12), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
                          child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [Icon(Icons.chat, size: 16, color: textColor), const SizedBox(width: 4), Flexible(child: Text('WhatsApp', style: TextStyle(color: textColor, fontSize: 12, fontWeight: FontWeight.bold), overflow: TextOverflow.ellipsis))]),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () => Navigator.pop(context),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Theme.of(context).cardColor,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                      child: Text('Retour à l\'accueil', style: TextStyle(color: textColor, fontWeight: FontWeight.bold)),
                    ),
                  ),
                ],
              );
            }

            String stepTitle = step == 1 ? 'Réserver un trajet' : step == 2 ? 'Choix du véhicule' : step == 3 ? 'Informations Passager' : 'Paiement';

              return Dialog(
                backgroundColor: Colors.transparent,
                insetPadding: const EdgeInsets.all(16),
                child: Container(
                  width: 420, // max-w-md (equivalent)
                  constraints: BoxConstraints(
                    minHeight: 500,
                  maxHeight: MediaQuery.of(context).size.height * 0.9,
                ),
                decoration: BoxDecoration(
                  color: bgColor,
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: [
                    BoxShadow(color: Colors.black.withValues(alpha: 0.2), blurRadius: 24, spreadRadius: 0),
                  ],
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Header
                    if (step < 5)
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
                        decoration: BoxDecoration(color: headerBgColor,
                          borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
                          border: Border(bottom: BorderSide(color: borderColor)),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            if (step > 1)
                              Container(
                                decoration: BoxDecoration(
                                  color: isDark ? const Color(0xFF1A1A1A) : const Color(0xFFF8FAFC),
                                  borderRadius: BorderRadius.circular(24),
                                  border: Border.all(color: borderColor),
                                ),
                                child: IconButton(
                                  icon: Icon(Icons.arrow_back, color: textMutedColor),
                                  onPressed: () => setState(() => step--),
                                ),
                              )
                            else
                              const SizedBox(width: 48),
                          Expanded(
                            child: Column(
                              children: [
                                Text('Nouvelle Demande', style: TextStyle(color: textColor, fontSize: 18, fontWeight: FontWeight.bold)),
                                const SizedBox(height: 4),
                                Text('Étape $step sur 4 : $stepTitle', style: TextStyle(color: textMutedColor, fontSize: 12)),
                              ],
                            ),
                          ),
                          Container(
                            decoration: BoxDecoration(
                              color: isDark ? const Color(0xFF1A1A1A) : const Color(0xFFF8FAFC),
                              borderRadius: BorderRadius.circular(24),
                              border: Border.all(color: borderColor),
                            ),
                            child: IconButton(
                              icon: Icon(Icons.close, color: textMutedColor),
                              onPressed: () => Navigator.pop(context),
                            ),
                          ),
                        ],
                      ),
                    ),

                    // Progress bar
                    if (step < 5)
                      Container(
                        height: 4,
                        width: double.infinity,
                        color: borderColor,
                        alignment: Alignment.centerLeft,
                        child: FractionallySizedBox(
                          widthFactor: step / 4,
                          child: Container(
                            decoration: const BoxDecoration(
                              gradient: LinearGradient(colors: [Color(0xFFEA580C), Color(0xFFFB923C)]),
                            ),
                          ),
                        ),
                      ),

                    // Content
                    Flexible(
                      child: SingleChildScrollView(
                        padding: EdgeInsets.all(step == 5 ? 16 : 24),
                        child: step == 1 ? buildStep1() : step == 2 ? buildStep2() : step == 3 ? buildStep3() : step == 4 ? buildStep4() : buildStep5(),
                      ),
                    ),

                    // Footer Action
                    if (step < 5 && (step == 1 || (step == 3 && ticketPour != null) || step == 4))
                      Container(
                        padding: const EdgeInsets.all(24),
                        decoration: BoxDecoration(color: isDark ? const Color(0xFF1A1A1A) : const Color(0xFFF8FAFC), // Footer bg
                          borderRadius: const BorderRadius.vertical(bottom: Radius.circular(24)),
                          border: Border(top: BorderSide(color: borderColor)),
                        ),
                        child: SizedBox(
                          width: double.infinity,
                          child: ElevatedButton.icon(
                            onPressed: isSearching || (step == 3 && (nom.isEmpty || telephone.isEmpty)) || (step == 4 && (isQueued || alternativeTrips.isNotEmpty)) ? null : () async {
                              if (step == 1) {
                                setState(() => isSearching = true);
                                try {
                                  String formattedDate = '';
                                  if (date == 'Demain') {
                                    final d = DateTime.now().add(const Duration(days: 1));
                                    formattedDate = "${d.year}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}";
                                  } else if (date == 'Après-demain') {
                                    final d = DateTime.now().add(const Duration(days: 2));
                                    formattedDate = "${d.year}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}";
                                  } else {
                                    final d = DateTime.now();
                                    formattedDate = "${d.year}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}";
                                  }

                                  final apiUrl = dotenv.env['API_URL'] ?? 'http://localhost:3333';
                                  final uri = Uri.parse('$apiUrl/v1/trips/search?originCity=${Uri.encodeComponent(departController.text)}&destinationCity=${Uri.encodeComponent(arriveeController.text)}&date=$formattedDate');
                                  final response = await http.get(uri);
                                  if (response.statusCode == 200) {
                                    final List<dynamic> data = jsonDecode(response.body);
                                    setState(() {
                                      realTrips = data.map((e) => {
                                        "id": e['id'],
                                        "company": e['company'] != null ? e['company']['name'] : "Allogoo",
                                        "price": e['pricePerSeat'] ?? 5000,
                                        "type": e['vehicle'] != null ? (e['vehicle']['type'] == 'TAXI_7_PLACES' ? 'Taxi 7 Places' : e['vehicle']['type']) : "Voiture",
                                        "options": "Climatisé",
                                        "time": DateTime.parse(e['departureTime']).toLocal().toString().substring(11, 16),
                                        "passagers": e['passagers'] ?? 0,
                                        "placesPrises": e['placesPrises'] ?? 0,
                                        "availableSeats": e['availableSeats'] ?? 5
                                      }).toList();
                                      isSearching = false;
                                      step = 2;
                                    });
                                  } else {
                                    setState(() { isSearching = false; });
                                    setState(() { isSearching = false; errorMessage = 'Erreur de recherche'; });
                                  }
                                } catch (e) {
                                  setState(() { isSearching = false; errorMessage = 'Erreur réseau: Vérifiez votre connexion'; });
                                }
                              } else if (step == 3) {
                                if (nom.isNotEmpty && telephone.isNotEmpty) {
                                  setState(() => step = 4);
                                }
                              } else if (step == 4) {
                                if (paymentMethod != null) {
                                  Future<void> attemptBooking() async {
                                    if (!isQueued) setState(() => isSearching = true);
                                    try {
                                      final prefs = await SharedPreferences.getInstance();
                                      final token = prefs.getString('auth_token');
                                      final apiUrl = dotenv.env['API_URL'] ?? 'http://localhost:3333';
                                      
                                      final response = await http.post(
                                        Uri.parse('$apiUrl/v1/bookings'),
                                        headers: {
                                          'Content-Type': 'application/json',
                                          if (token != null) 'Authorization': 'Bearer $token'
                                        },
                                        body: jsonEncode({
                                          'tripId': selectedTrip!['id'],
                                          'seatNumber': 1,
                                          'passengersCount': int.tryParse((passagers ?? '1').split(' ')[0]) ?? 1,
                                          'paymentMethod': paymentMethod == 'om' ? 'ORANGE_MONEY' : (paymentMethod == 'wallet' ? 'WALLET' : paymentMethod!.toUpperCase())
                                        })
                                      );
                                      if (response.statusCode == 201 || response.statusCode == 200) {
                                        final apiData = jsonDecode(response.body);
                                        setState(() => isQueued = false);
                                        
                                        if (apiData['booking'] != null && apiData['booking']['status'] == 'PENDING_PAYMENT') {
                                          if (apiData['paymentSession'] != null && apiData['paymentSession']['paymentUrl'] != null) {
                                            final pUrl = Uri.parse(apiData['paymentSession']['paymentUrl']);
                                            if (await canLaunchUrl(pUrl)) {
                                              await launchUrl(pUrl, mode: LaunchMode.externalApplication);
                                            }
                                          }

                                          setState(() {
                                            errorMessage = 'Veuillez valider le paiement dans l\'application ouverte...';
                                          });

                                          // Polling de la vérification de paiement
                                          bool isPaid = false;
                                          int attempts = 0;
                                          
                                          if (apiData['paymentSession'] != null && apiData['paymentSession']['webhook_simulation_url'] != null) {
                                            Future.delayed(const Duration(seconds: 8), () {
                                              http.get(Uri.parse('$apiUrl${apiData['paymentSession']['webhook_simulation_url']}')); // Async sans await
                                            });
                                          }

                                          while (attempts < 20 && !isPaid) {
                                            await Future.delayed(const Duration(seconds: 3));
                                            attempts++;
                                            try {
                                              if (apiData['paymentSession'] != null && apiData['paymentSession']['bookingId'] != null) {
                                                final statusRes = await http.get(Uri.parse('$apiUrl/bookings/${apiData['paymentSession']['bookingId']}/status'));
                                                if (statusRes.statusCode == 200) {
                                                  final statusData = jsonDecode(statusRes.body);
                                                  if (statusData['status'] == 'CONFIRMED') {
                                                    isPaid = true;
                                                  }
                                                }
                                              } else {
                                                isPaid = true;
                                              }
                                            } catch (e) {
                                              // Ignorer les erreurs réseau pendant le polling
                                            }
                                          }

                                          if (!isPaid) {
                                            setState(() { isSearching = false; errorMessage = 'Délai d\'attente dépassé pour la confirmation du paiement.'; });
                                            return;
                                          }
                                        }
                                        
                                        setState(() { errorMessage = ''; });
                                        setState(() { isSearching = false; step = 5; });
                                      } else {
                                      final err = jsonDecode(response.body);
                                      if (err['code'] == 'QUEUE_WAIT') {
                                        setState(() {
                                          isQueued = true;
                                          queueMessage = err['message'] ?? 'File d\'attente...';
                                        });
                                        await Future.delayed(const Duration(seconds: 2));
                                        await attemptBooking();
                                      } else if (err['code'] == 'TRIP_FULL_ALTERNATIVES') {
                                        setState(() {
                                          isSearching = false;
                                          errorMessage = '';
                                          alternativeTrips = err['alternatives'] ?? [];
                                        });
                                      } else {
                                        setState(() { isSearching = false; errorMessage = err['message'] ?? 'Erreur de réservation'; });
                                      }
                                    }
                                  } catch (e) {
                                    setState(() { isSearching = false; errorMessage = 'Erreur réseau: Impossible de contacter le serveur'; });
                                  }
                                }
                                attemptBooking();
                              } else {
                                setState(() => errorMessage = 'Veuillez choisir un moyen de paiement');
                              }
                            }
                            },
                            icon: isSearching 
                              ? SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: isDark ? Colors.white54 : Colors.white, strokeWidth: 2)) 
                              : Icon(step == 4 ? Icons.payment : (step == 3 ? Icons.check_circle : Icons.search), color: textColor),
                            label: Text(step == 1 ? (isSearching ? 'Recherche...' : 'Rechercher un trajet') : step == 3 ? 'Continuer' : (isQueued ? 'En attente...' : (isSearching ? 'Traitement en cours...' : 'Payer maintenant')), style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: (isSearching || isQueued) ? (isDark ? Colors.white54 : Colors.white) : textColor)),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFFF97316),
                              disabledBackgroundColor: isDark ? const Color(0xFF222222) : const Color(0xFFCBD5E1),
                              disabledForegroundColor: isDark ? Colors.white54 : Colors.white,
                              padding: const EdgeInsets.symmetric(vertical: 18),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                              elevation: 8,
                              shadowColor: const Color(0xFFF97316).withValues(alpha: 0.5),
                            ),
                          ),
                        ),
                      ),
                      if (isSearching && errorMessage.contains('Veuillez valider le paiement'))
                        const SizedBox(height: 12),
                      if (isSearching && errorMessage.contains('Veuillez valider le paiement'))
                        TextButton(
                          onPressed: () {
                            // Simulation manuelle
                            setState(() {
                              isSearching = false;
                              errorMessage = '';
                              step = 5;
                            });
                          },
                          child: const Text('Simuler le paiement (Test)', style: TextStyle(color: Colors.blueAccent)),
                        ),
                      if (errorMessage.isNotEmpty)
                        Padding(
                          padding: const EdgeInsets.only(top: 16.0),
                          child: Text(
                            errorMessage,
                            style: const TextStyle(color: Colors.red, fontWeight: FontWeight.bold),
                            textAlign: TextAlign.center,
                          ),
                        ),
                  ],
                ),
              ),
            );
          },
        ),
        ],
        );
      },
    );
  }


  Widget _buildBookingInput(IconData icon, String hint, {Color iconColor = Colors.white54, TextEditingController? controller}) {
    return TextField(
      controller: controller,
      style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 14),
      decoration: InputDecoration(
        filled: true,
        fillColor: Theme.of(context).brightness == Brightness.dark ? Colors.black : Colors.white,
        prefixIcon: Icon(icon, color: iconColor, size: 20),
        hintText: hint,
        hintStyle: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: Theme.of(context).dividerColor),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: Theme.of(context).dividerColor),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFFF97316)),
        ),
        contentPadding: const EdgeInsets.symmetric(vertical: 16),
      ),
    );
  }

  Widget _buildDropdownInput(IconData icon, String hint, List<String> items, String? value, void Function(String?) onChanged) {
    return DropdownButtonFormField<String>(
      isExpanded: true,
      value: value?.isEmpty == true ? null : value,
      hint: Text(hint, maxLines: 1, overflow: TextOverflow.ellipsis, style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 13)),
      items: items.map((e) => DropdownMenuItem(value: e, child: Text(e, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 14)))).toList(),
      onChanged: onChanged,
      dropdownColor: Theme.of(context).cardColor,
      style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 14),
      decoration: InputDecoration(
        filled: true,
        fillColor: Theme.of(context).brightness == Brightness.dark ? Colors.black : Colors.white,
        prefixIcon: Icon(icon, color: Theme.of(context).colorScheme.onSurfaceVariant, size: 20),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: Theme.of(context).dividerColor)),
        enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: Theme.of(context).dividerColor)),
        focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFF97316))),
        contentPadding: const EdgeInsets.symmetric(vertical: 16, horizontal: 8),
      ),
      icon: Icon(Icons.keyboard_arrow_down, color: Theme.of(context).colorScheme.onSurfaceVariant),
    );
  }

  Widget _buildPlacesAutocomplete(String hint, TextEditingController mainController, {IconData? icon, Color iconColor = Colors.white54, double borderRadius = 12, EdgeInsetsGeometry contentPadding = const EdgeInsets.symmetric(vertical: 16)}) {
    return Autocomplete<String>(
      optionsBuilder: (TextEditingValue textEditingValue) async {
        if (textEditingValue.text.length < 2) {
          return const Iterable<String>.empty();
        }
        const apiKey = 'AIzaSyBEcIPoabk6yTJNGU06FjC5251syM9FGqA';
        final url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${Uri.encodeComponent(textEditingValue.text)}&components=country:sn&key=$apiKey';
        try {
          final response = await http.get(Uri.parse(url));
          if (response.statusCode == 200) {
            final data = json.decode(response.body);
            if (data['status'] == 'OK') {
              return (data['predictions'] as List).map<String>((p) => p['description'] as String).toList();
            }
          }
        } catch (e) {
          debugPrint("Error fetching places: $e");
        }
        return const Iterable<String>.empty();
      },
      onSelected: (String selection) {
        mainController.text = selection;
      },
      fieldViewBuilder: (BuildContext context, TextEditingController textEditingController, FocusNode focusNode, VoidCallback onFieldSubmitted) {
        // Sync l'initial value if present
        if (textEditingController.text != mainController.text && !focusNode.hasFocus) {
          textEditingController.text = mainController.text;
        }
        return TextField(
          controller: textEditingController,
          focusNode: focusNode,
          style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 14),
          decoration: InputDecoration(
            filled: true,
            fillColor: Theme.of(context).brightness == Brightness.dark ? Colors.black : Colors.white,
            prefixIcon: icon != null ? Icon(icon, color: iconColor, size: 20) : null,
            hintText: hint,
            hintStyle: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(borderRadius), borderSide: BorderSide(color: Theme.of(context).dividerColor)),
            enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(borderRadius), borderSide: BorderSide(color: Theme.of(context).dividerColor)),
            focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(borderRadius), borderSide: const BorderSide(color: Color(0xFFF97316))),
            contentPadding: contentPadding,
          ),
          onChanged: (val) => mainController.text = val,
        );
      },
      optionsViewBuilder: (BuildContext context, AutocompleteOnSelected<String> onSelected, Iterable<String> options) {
        return Align(
          alignment: Alignment.topLeft,
          child: Material(
            elevation: 8,
            color: Theme.of(context).cardColor,
            borderRadius: BorderRadius.circular(12),
            child: Container(
              width: 330,
              constraints: const BoxConstraints(maxHeight: 200),
              child: ListView.builder(
                padding: const EdgeInsets.all(8),
                itemCount: options.length,
                shrinkWrap: true,
                itemBuilder: (BuildContext context, int index) {
                  final String option = options.elementAt(index);
                  return InkWell(
                    onTap: () => onSelected(option),
                    child: Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        border: Border(bottom: BorderSide(color: Theme.of(context).dividerColor)),
                      ),
                      child: Text(option, style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 14)),
                    ),
                  );
                },
              ),
            ),
          ),
        );
      },
    );
  }
}
