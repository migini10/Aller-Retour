import 'package:flutter/material.dart';
import 'dart:ui'; // for ImageFilter
import 'wallet_screen.dart';
import 'colis_screen.dart';
import 'qr_code_screen.dart';
import 'fidelite_screen.dart';
import 'package:geolocator/geolocator.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter/foundation.dart';
class ClientDashboardScreen extends StatefulWidget {
  const ClientDashboardScreen({super.key});

  @override
  State<ClientDashboardScreen> createState() => _ClientDashboardScreenState();
}

class _ClientDashboardScreenState extends State<ClientDashboardScreen> with SingleTickerProviderStateMixin {
  AnimationController? _pulseController;
  Animation<double>? _pulseAnimation;
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    )..repeat(reverse: true);
    _pulseAnimation = Tween<double>(begin: 0.2, end: 0.6).animate(_pulseController!);
  }

  @override
  void dispose() {
    _scrollController.dispose();
    _pulseController?.dispose();
    super.dispose();
  }

  final List<Map<String, dynamic>> services = [
    {
      'title': 'Colis',
      'description': 'Gérez vos franchises et suivez l\'expédition.',
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
    return Scaffold(
      backgroundColor: const Color(0xFF020617), // slate-950
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 550),
          child: SingleChildScrollView(
            controller: _scrollController,
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
                  child: _buildHeader(context),
                ),
                _buildHeroWithWalletAndButtons(context),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 32.0),
                  child: _buildServicesSection(context),
                ),
                const SizedBox(height: 40),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Container(
      color: Colors.transparent, // 0% opacity
      padding: EdgeInsets.only(
        top: MediaQuery.of(context).padding.top + 16,
        bottom: 16,
        left: 20,
        right: 20,
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
                // Logo
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(6),
                      decoration: BoxDecoration(
                        color: Colors.orange.withOpacity(0.4),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: Colors.deepOrange.shade400, width: 2),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.2),
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
                            Shadow(color: Colors.black87, blurRadius: 6, offset: Offset(0, 2)),
                          ],
                        ),
                        children: [
                          const TextSpan(text: 'Aller-', style: TextStyle(color: Colors.white)),
                          TextSpan(text: 'Retour', style: TextStyle(color: Colors.deepOrange.shade400)),
                        ],
                      ),
                    ),
                  ],
                ),
                // Hamburger Menu
                Container(
                  decoration: BoxDecoration(
                    color: const Color(0xFF0F172A).withOpacity(0.6),
                    shape: BoxShape.circle,
                    border: Border.all(color: Colors.white.withOpacity(0.15)),
                  ),
                  child: IconButton(
                    icon: const Icon(Icons.menu, color: Colors.white, size: 26),
                    onPressed: () {
                      Scaffold.of(context).openEndDrawer();
                    },
                  ),
                ),
              ],
            ),
    );
  }

  Widget _buildHeroWithWalletAndButtons(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: 16.0, left: 16.0, right: 16.0),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(40), // Fully rounded corners
        child: Stack(
        children: [
          // Background Image
          Positioned.fill(
            child: Image.asset(
              'assets/images/peugeot_406_hero.png',
              fit: BoxFit.cover,
            ),
          ),
          // Gradient Overlay
          Positioned.fill(
            child: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    const Color(0xFF020617).withOpacity(0.3),
                    const Color(0xFF020617).withOpacity(0.4),
                    const Color(0xFF020617).withOpacity(0.85), // Darker only at the very bottom
                  ],
                  stops: const [0.0, 0.6, 1.0],
                ),
              ),
            ),
          ),
          // Content
          SafeArea(
            bottom: false,
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 30, 20, 40),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Espace Voyageur',
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.w900,
                      fontSize: 40,
                      letterSpacing: -1.0,
                      shadows: [
                        Shadow(color: Colors.black, blurRadius: 10),
                        Shadow(color: Colors.black, blurRadius: 25),
                        Shadow(color: Colors.black, blurRadius: 50),
                        Shadow(color: Colors.black87, blurRadius: 80),
                      ],
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Bienvenue sur votre tableau de bord.\nGérez vos réservations et votre wallet en toute simplicité.',
                    style: TextStyle(
                      color: Colors.white, // Solid white for better readability
                      fontSize: 16,
                      height: 1.4,
                      fontWeight: FontWeight.w600,
                      shadows: [
                        Shadow(color: Colors.black, blurRadius: 8),
                        Shadow(color: Colors.black, blurRadius: 20),
                        Shadow(color: Colors.black, blurRadius: 40),
                      ],
                    ),
                  ),
                  const SizedBox(height: 32),
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
                color: const Color(0xFF0F172A).withOpacity(0.2), // slightly darker to see the blur
                borderRadius: BorderRadius.circular(24),
                border: Border.all(
                  color: Colors.cyanAccent.withOpacity(_pulseAnimation!.value),
                  width: 1.5,
                ),
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(24),
                child: BackdropFilter(
                  filter: ImageFilter.blur(sigmaX: 4.0, sigmaY: 4.0), // subtle blur
                  child: Padding(
                    padding: const EdgeInsets.all(24.0),
            child: Row(
              children: [
                    Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: Colors.cyanAccent.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: Colors.cyanAccent.withOpacity(0.5)),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.cyanAccent.withOpacity(0.2),
                            blurRadius: 10,
                          ),
                        ],
                      ),
                      child: const Icon(
                        Icons.account_balance_wallet,
                        color: Colors.cyanAccent,
                        size: 32,
                      ),
                    ),
                    const SizedBox(width: 20),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Solde Wallet (XOF)',
                            style: TextStyle(
                              color: Colors.grey[400],
                              fontSize: 13,
                              fontWeight: FontWeight.w600,
                              letterSpacing: 0.5,
                            ),
                          ),
                          const SizedBox(height: 6),
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.baseline,
                            textBaseline: TextBaseline.alphabetic,
                            children: const [
                              Text(
                                '45 000',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 32,
                                  fontWeight: FontWeight.w900,
                                ),
                              ),
                              SizedBox(width: 6),
                              Text(
                                'FCFA',
                                style: TextStyle(
                                  color: Colors.cyanAccent,
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          GestureDetector(
                            onTap: () {
                              Navigator.pushNamed(context, '/wallet');
                            },
                            child: Row(
                              children: const [
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
                _showRechargeBottomSheet(context);
              },
              icon: const Icon(Icons.flash_on, color: Colors.white),
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
                shadowColor: Colors.orange.withOpacity(0.5),
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
            const Text(
              'Vos Services',
              style: TextStyle(
                color: Colors.white,
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
            childAspectRatio: 0.82,
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
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFF0F172A),
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: const Color(0xFF1E293B)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: service['color'].withOpacity(0.2),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: service['color'].withOpacity(0.5)),
                      ),
                      child: Icon(
                        service['icon'],
                        color: service['color'],
                        size: 28,
                      ),
                    ),
                    const Spacer(),
                    Text(
                      service['title'],
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      service['description'],
                      style: TextStyle(
                        color: Colors.grey[500],
                        fontSize: 12,
                        height: 1.3,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Text(
                          'Ouvrir',
                          style: TextStyle(
                            color: Colors.grey[400],
                            fontSize: 13,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(width: 4),
                        Icon(Icons.arrow_forward_rounded, size: 16, color: Colors.grey[400]),
                      ],
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ],
    );
  }

  void _showRechargeBottomSheet(BuildContext context) {
    int step = 1;
    String? operator;
    bool isLoading = false;
    final nameController = TextEditingController();
    final phoneController = TextEditingController();
    final amountController = TextEditingController();

    showDialog(
      context: context,
      barrierDismissible: true,
      builder: (context) {
        return StatefulBuilder(
          builder: (BuildContext context, StateSetter setState) {
            return Dialog(
              backgroundColor: Colors.transparent,
              insetPadding: const EdgeInsets.all(16),
              child: Container(
                width: 400, // Reduced from 500
                constraints: BoxConstraints(
                  minHeight: 500, // Added minHeight to increase popup height
                  maxHeight: MediaQuery.of(context).size.height * 0.9,
                ),
                decoration: BoxDecoration(
                  color: const Color(0xFF1A1A1A), // Web dark mode bg
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: [
                    BoxShadow(color: Colors.black.withOpacity(0.5), blurRadius: 24, spreadRadius: 8),
                  ],
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Header
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
                      decoration: const BoxDecoration(
                        color: Color(0xFF141414), // Header bg
                        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
                        border: Border(bottom: BorderSide(color: Color(0xFF2A2A2A))),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                step == 3 ? 'Recharge réussie' : 'Recharger mon Wallet',
                                style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.w900),
                              ),
                              if (step < 3)
                                Padding(
                                  padding: const EdgeInsets.only(top: 4),
                                  child: Text('Étape $step sur 2', style: const TextStyle(color: Colors.white54, fontSize: 13)),
                                ),
                            ],
                          ),
                          Container(
                            decoration: BoxDecoration(
                              color: const Color(0xFF222222),
                              borderRadius: BorderRadius.circular(24),
                              border: Border.all(color: const Color(0xFF333333)),
                            ),
                            child: IconButton(
                              icon: const Icon(Icons.close, color: Colors.white70),
                              onPressed: () => Navigator.pop(context),
                            ),
                          ),
                        ],
                      ),
                    ),

                    // Content
                    Flexible(
                      child: SingleChildScrollView(
                        padding: const EdgeInsets.all(24),
                        child: step == 1
                            ? _buildRechargeStep1(operator, (val) => setState(() => operator = val))
                            : step == 2
                                ? _buildRechargeStep2(operator, nameController, phoneController, amountController)
                                : _buildRechargeStep3(context),
                      ),
                    ),

                    // Footer Actions
                    if (step < 3)
                      Container(
                        padding: const EdgeInsets.all(24),
                        decoration: const BoxDecoration(
                          color: Color(0xFF141414),
                          borderRadius: BorderRadius.vertical(bottom: Radius.circular(24)),
                          border: Border(top: BorderSide(color: Color(0xFF2A2A2A))),
                        ),
                        child: Row(
                          children: [
                            if (step == 2)
                              Padding(
                                padding: const EdgeInsets.only(right: 16),
                                child: TextButton(
                                  onPressed: () => setState(() => step = 1),
                                  style: TextButton.styleFrom(
                                    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                                    backgroundColor: const Color(0xFF222222),
                                  ),
                                  child: const Text('Retour', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                                ),
                              ),
                            Expanded(
                              child: ElevatedButton(
                                onPressed: (step == 1 && operator == null) || isLoading
                                    ? null
                                    : () async {
                                        if (step == 1) {
                                          setState(() => step = 2);
                                        } else if (step == 2) {
                                          setState(() => isLoading = true);
                                          
                                          // PREPARATION DE L'API (À remplacer par les vrais appels backend plus tard)
                                          final paymentData = {
                                            'provider': operator,
                                            'customer': {
                                              'fullName': nameController.text,
                                              'phone': phoneController.text,
                                            },
                                            'amount': int.tryParse(amountController.text) ?? 0,
                                            'currency': 'XOF',
                                            'reference': 'RECHARGE_${DateTime.now().millisecondsSinceEpoch}'
                                          };
                                          
                                          debugPrint("Appel API de paiement préparé avec les données: $paymentData");
                                          
                                          // Simuler l'attente de réponse de l'API
                                          await Future.delayed(const Duration(milliseconds: 1500));
                                          
                                          // Simuler l'URL de redirection retournée par l'API de l'opérateur
                                          final mockPaymentUrl = operator == 'wave' 
                                            ? 'https://pay.wave.com/checkout?amount=${paymentData['amount']}&ref=${paymentData['reference']}'
                                            : 'https://api.orangemoney.com/checkout?amount=${paymentData['amount']}&ref=${paymentData['reference']}';
                                            
                                          debugPrint("Redirection vers l'API: $mockPaymentUrl");
                                          
                                          if (context.mounted) {
                                            ScaffoldMessenger.of(context).showSnackBar(
                                              SnackBar(
                                                content: Text('Redirection vers $operator API simulée avec succès'),
                                                backgroundColor: Colors.green,
                                              ),
                                            );
                                          }

                                          setState(() {
                                            isLoading = false;
                                            step = 3;
                                          });
                                        }
                                      },
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: operator == 'wave' ? const Color(0xFF1DA1F2) : operator == 'orange' ? const Color(0xFFFF7900) : Colors.white,
                                  foregroundColor: operator == null ? Colors.black : Colors.white,
                                  disabledBackgroundColor: const Color(0xFF222222),
                                  disabledForegroundColor: Colors.white54,
                                  padding: const EdgeInsets.symmetric(vertical: 16),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                                ),
                                child: isLoading
                                    ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                                    : Row(
                                        mainAxisAlignment: MainAxisAlignment.center,
                                        children: [
                                          Text(step == 1 ? 'Suivant' : 'Confirmer le paiement', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                                          const SizedBox(width: 8),
                                          const Icon(Icons.chevron_right),
                                        ],
                                      ),
                              ),
                            ),
                          ],
                        ),
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

  Widget _buildRechargeStep1(String? selectedOperator, Function(String) onSelect) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Choisissez votre opérateur', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
        const SizedBox(height: 20),
        Column(
          children: [
            GestureDetector(
              onTap: () => onSelect('wave'),
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 28, horizontal: 20),
                decoration: BoxDecoration(
                  color: selectedOperator == 'wave' ? const Color(0xFF1DA1F2).withOpacity(0.1) : Colors.white.withOpacity(0.05),
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(
                    color: selectedOperator == 'wave' ? const Color(0xFF1DA1F2) : Colors.white10,
                    width: 2,
                  ),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 64,
                      height: 64,
                      decoration: const BoxDecoration(
                        color: Color(0xFF1DA1F2),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.waves, color: Colors.white, size: 32),
                    ),
                    const SizedBox(width: 16),
                    Text('Wave', style: TextStyle(color: selectedOperator == 'wave' ? const Color(0xFF1DA1F2) : Colors.white70, fontSize: 18, fontWeight: FontWeight.bold)),
                    const Spacer(),
                    if (selectedOperator == 'wave')
                      const Icon(Icons.check_circle, color: Color(0xFF1DA1F2)),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            GestureDetector(
              onTap: () => onSelect('orange'),
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 28, horizontal: 20),
                decoration: BoxDecoration(
                  color: selectedOperator == 'orange' ? const Color(0xFFFF7900).withOpacity(0.1) : Colors.white.withOpacity(0.05),
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(
                    color: selectedOperator == 'orange' ? const Color(0xFFFF7900) : Colors.white10,
                    width: 2,
                  ),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 64,
                      height: 64,
                      decoration: BoxDecoration(
                        color: Colors.black,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: const Color(0xFFFF7900).withOpacity(0.3)),
                      ),
                      child: const Icon(Icons.money, color: Color(0xFFFF7900), size: 32),
                    ),
                    const SizedBox(width: 16),
                    Text('Orange Money', style: TextStyle(color: selectedOperator == 'orange' ? const Color(0xFFFF7900) : Colors.white70, fontSize: 18, fontWeight: FontWeight.bold)),
                    const Spacer(),
                    if (selectedOperator == 'orange')
                      const Icon(Icons.check_circle, color: Color(0xFFFF7900)),
                  ],
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildRechargeStep2(String? operator, TextEditingController nameCtrl, TextEditingController phoneCtrl, TextEditingController amountCtrl) {
    Color opColor = operator == 'wave' ? const Color(0xFF1DA1F2) : const Color(0xFFFF7900);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Operator header
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.05),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.white10),
          ),
          child: Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: operator == 'wave' ? opColor : Colors.black,
                  borderRadius: BorderRadius.circular(12),
                  border: operator == 'orange' ? Border.all(color: opColor.withOpacity(0.3)) : null,
                ),
                child: Icon(operator == 'wave' ? Icons.waves : Icons.money, color: operator == 'wave' ? Colors.white : opColor),
              ),
              const SizedBox(width: 16),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Recharge via', style: TextStyle(color: Colors.white54, fontSize: 13)),
                  Text(operator == 'wave' ? 'Wave Mobile Money' : 'Orange Money', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                ],
              )
            ],
          ),
        ),
        const SizedBox(height: 24),
        _buildWizardInput('Nom Complet', Icons.person, 'Ex: Abdou Bakhe', controller: nameCtrl),
        const SizedBox(height: 16),
        _buildWizardInput('Numéro de Téléphone', Icons.phone, 'Ex: 77 123 45 67', isNumber: true, controller: phoneCtrl),
        const SizedBox(height: 16),
        _buildWizardInput('Montant à Recharger (FCFA)', Icons.credit_card, 'Ex: 10000', isNumber: true, isLarge: true, controller: amountCtrl),
      ],
    );
  }

  Widget _buildRechargeStep3(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 40),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Container(
            width: 100,
            height: 100,
            decoration: BoxDecoration(
              color: Colors.greenAccent.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.check_circle, color: Colors.greenAccent, size: 60),
          ),
          const SizedBox(height: 24),
          const Text('Demande Envoyée !', style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.w900)),
          const SizedBox(height: 12),
          const Text('Veuillez valider le paiement sur votre téléphone.', textAlign: TextAlign.center, style: TextStyle(color: Colors.white54, fontSize: 16)),
          const SizedBox(height: 40),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context); // Fermer la modale
              Navigator.pushNamed(context, '/wallet'); // Naviguer vers le wallet
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 16),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            ),
            child: const Text('Retour au Wallet', style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 16)),
          ),
        ],
      ),
    );
  }

  Widget _buildWizardInput(String label, IconData icon, String hint, {bool isNumber = false, bool isLarge = false, TextEditingController? controller}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(color: Colors.white70, fontSize: 14, fontWeight: FontWeight.bold)),
        const SizedBox(height: 8),
        TextField(
          controller: controller,
          keyboardType: isNumber ? TextInputType.number : TextInputType.text,
          style: TextStyle(color: Colors.white, fontSize: isLarge ? 20 : 16, fontWeight: isLarge ? FontWeight.w900 : FontWeight.w600),
          decoration: InputDecoration(
            filled: true,
            fillColor: Colors.white.withOpacity(0.05),
            prefixIcon: Icon(icon, color: Colors.white54),
            hintText: hint,
            hintStyle: const TextStyle(color: Colors.white30),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: const BorderSide(color: Color(0xFF333333)), // Gray border like Web
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: const BorderSide(color: Color(0xFF333333)),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: const BorderSide(color: Colors.orangeAccent),
            ),
            contentPadding: const EdgeInsets.symmetric(vertical: 20),
          ),
        ),
      ],
    );
  }

  void _showReservationBottomSheet(BuildContext context) {
    bool isLocating = false;
    int step = 1;
    bool isSearching = false;
    List<dynamic> realTrips = [];
    dynamic selectedTrip;
    String? selectedSeat;
    String? ticketPour;
    String nom = 'Abdou Bakhe';
    String telephone = '+221 77 123 45 67';
    String email = 'abdou@example.com';
    int bagages = 0;

    final departController = TextEditingController();
    final pickupController = TextEditingController();
    final arriveeController = TextEditingController();
    final quartierController = TextEditingController();
    String? date;
    String? passagers = '1 Passager';

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
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setState) {
            Widget buildStep1() {
              return Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.03),
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(color: Colors.white10),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Où allez-vous avec Allo Dakar ?', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                        const SizedBox(height: 16),
                        _buildPlacesAutocomplete('Ville de départ (ex: Dakar)', departController, icon: Icons.location_on),
                        const SizedBox(height: 12),
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF97316).withOpacity(0.05),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: const Color(0xFFF97316).withOpacity(0.3)),
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
                                        color: isLocating ? const Color(0xFFF97316).withOpacity(0.5) : const Color(0xFFF97316),
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: Row(
                                        children: [
                                          const Icon(Icons.my_location, color: Colors.white, size: 12),
                                          const SizedBox(width: 4),
                                          Text(isLocating ? 'Patientez...' : 'Me localiser', style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
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
                    ),
                  ),
                ],
              );
            }

            Widget buildStep2() {
              return Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Padding(
                    padding: EdgeInsets.only(bottom: 12),
                    child: Text('Choix du véhicule Allo Dakar', style: TextStyle(color: Colors.white70, fontSize: 14, fontWeight: FontWeight.bold)),
                  ),
                  if (realTrips.isEmpty)
                    Container(
                      padding: const EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        color: const Color(0xFF1A1A1A),
                        border: Border.all(color: const Color(0xFF2A2A2A)),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: const Center(
                        child: Text("Aucun trajet trouvé pour cette date.", style: TextStyle(color: Colors.white70)),
                      ),
                    )
                  else
                    ...realTrips.map<Widget>((t) {
                      return GestureDetector(
                        onTap: () {
                          setState(() {
                            selectedTrip = t;
                            step = 3;
                          });
                        },
                        child: Container(
                          margin: const EdgeInsets.only(bottom: 12),
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: const Color(0xFF1A1A1A),
                            border: Border.all(color: const Color(0xFF2A2A2A)),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      children: [
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                          decoration: BoxDecoration(
                                            color: const Color(0xFFF97316).withOpacity(0.1),
                                            borderRadius: BorderRadius.circular(8),
                                            border: Border.all(color: const Color(0xFFF97316).withOpacity(0.3)),
                                          ),
                                          child: Text(t['time'], style: const TextStyle(color: Color(0xFFFB923C), fontWeight: FontWeight.bold)),
                                        ),
                                        const SizedBox(width: 8),
                                        Expanded(child: Text(t['company'], style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16), overflow: TextOverflow.ellipsis)),
                                      ],
                                    ),
                                    const SizedBox(height: 8),
                                    Row(
                                      children: [
                                        Text(t['type'], style: const TextStyle(color: Colors.white70, fontSize: 12)),
                                        const SizedBox(width: 8),
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                          decoration: BoxDecoration(color: Colors.blue.withOpacity(0.1), borderRadius: BorderRadius.circular(12)),
                                          child: Text(t['options'], style: const TextStyle(color: Colors.blueAccent, fontSize: 10)),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.end,
                                children: [
                                  Text("${t['price']} FCFA", style: const TextStyle(color: Color(0xFFF97316), fontWeight: FontWeight.bold, fontSize: 18)),
                                  const SizedBox(height: 4),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                    decoration: BoxDecoration(
                                      color: const Color(0xFFF97316).withOpacity(0.1),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: const Text('Choisir', style: TextStyle(color: Color(0xFFF97316), fontWeight: FontWeight.bold, fontSize: 12)),
                                  ),
                                ],
                              )
                            ],
                          ),
                        ),
                      );
                    }).toList(),
                ],
              );
            }

            Widget buildStep3() {
              List<int> occupied = [2, 5, 8];
              return Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Choix du siège', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                      Row(
                        children: [
                          Container(width: 12, height: 12, decoration: BoxDecoration(color: const Color(0xFF222222), border: Border.all(color: const Color(0xFF333333)), borderRadius: BorderRadius.circular(4))),
                          const SizedBox(width: 4), const Text('Libre', style: TextStyle(color: Colors.white70, fontSize: 10)),
                          const SizedBox(width: 8),
                          Container(width: 12, height: 12, decoration: BoxDecoration(color: const Color(0xFFF97316), borderRadius: BorderRadius.circular(4))),
                          const SizedBox(width: 4), const Text('Sélection', style: TextStyle(color: Colors.white70, fontSize: 10)),
                        ],
                      )
                    ],
                  ),
                  const SizedBox(height: 24),
                  Container(
                    width: 200,
                    padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 16),
                    decoration: BoxDecoration(
                      color: Colors.black,
                      border: Border.all(color: const Color(0xFF2A2A2A), width: 4),
                      borderRadius: BorderRadius.circular(40),
                    ),
                    child: Column(
                      children: [
                        Container(width: 48, height: 8, decoration: BoxDecoration(color: const Color(0xFF222222), borderRadius: BorderRadius.circular(4))),
                        const SizedBox(height: 24),
                        Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          children: List.generate(12, (index) {
                            int seatNum = index + 1;
                            bool isOcc = occupied.contains(seatNum);
                            bool isSel = selectedSeat == seatNum.toString();
                            return GestureDetector(
                              onTap: isOcc ? null : () => setState(() => selectedSeat = seatNum.toString()),
                              child: Container(
                                width: 45,
                                height: 45,
                                margin: EdgeInsets.only(right: (index % 3 == 1) ? 16 : 0),
                                decoration: BoxDecoration(
                                  color: isOcc ? Colors.red.withOpacity(0.1) : (isSel ? const Color(0xFFF97316) : const Color(0xFF222222)),
                                  border: Border.all(color: isOcc ? Colors.red.withOpacity(0.2) : (isSel ? Colors.transparent : const Color(0xFF333333))),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Center(
                                  child: Text(seatNum.toString(), style: TextStyle(color: isOcc ? Colors.red : (isSel ? Colors.white : Colors.white70), fontWeight: FontWeight.bold)),
                                ),
                              ),
                            );
                          }),
                        ),
                      ],
                    ),
                  ),
                ],
              );
            }

            Widget buildStep4() {
              if (ticketPour == null) {
                return Column(
                  children: [
                    const Icon(Icons.person, size: 64, color: Color(0xFFF97316)),
                    const SizedBox(height: 16),
                    const Text('Pour qui est ce billet ?', style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 8),
                    const Text('Veuillez sélectionner le bénéficiaire.', style: TextStyle(color: Colors.white70)),
                    const SizedBox(height: 32),
                    Row(
                      children: [
                        Expanded(
                          child: GestureDetector(
                            onTap: () => setState(() {
                              ticketPour = 'moi';
                              nom = 'Abdou Bakhe';
                              telephone = '+221 77 123 45 67';
                            }),
                            child: Container(
                              padding: const EdgeInsets.all(24),
                              decoration: BoxDecoration(
                                color: const Color(0xFF222222).withOpacity(0.5),
                                border: Border.all(color: const Color(0xFF333333), width: 2),
                                borderRadius: BorderRadius.circular(24),
                              ),
                              child: Column(
                                children: [
                                  const Icon(Icons.person, color: Colors.white70, size: 32),
                                  const SizedBox(height: 12),
                                  const Text("C'est pour moi", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                                  const Text("Mon profil", style: TextStyle(color: Colors.white54, fontSize: 12)),
                                ],
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: GestureDetector(
                            onTap: () => setState(() {
                              ticketPour = 'autre';
                              nom = '';
                              telephone = '';
                            }),
                            child: Container(
                              padding: const EdgeInsets.all(24),
                              decoration: BoxDecoration(
                                color: const Color(0xFF222222).withOpacity(0.5),
                                border: Border.all(color: const Color(0xFF333333), width: 2),
                                borderRadius: BorderRadius.circular(24),
                              ),
                              child: Column(
                                children: [
                                  const Icon(Icons.group, color: Colors.white70, size: 32),
                                  const SizedBox(height: 12),
                                  const Text("Pour un proche", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                                  const Text("Nouvelles infos", style: TextStyle(color: Colors.white54, fontSize: 12)),
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
                      color: Colors.black,
                      border: Border.all(color: const Color(0xFF2A2A2A)),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(color: const Color(0xFFF97316).withOpacity(0.1), shape: BoxShape.circle),
                              child: Icon(ticketPour == 'moi' ? Icons.person : Icons.group, color: const Color(0xFFF97316), size: 20),
                            ),
                            const SizedBox(width: 12),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text('Billet destiné à', style: TextStyle(color: Colors.white54, fontSize: 12)),
                                Text(ticketPour == 'moi' ? 'Moi-même' : 'Un proche', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
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
                  const Text('Nom Complet', style: TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  TextField(
                    controller: TextEditingController(text: nom)..selection = TextSelection.collapsed(offset: nom.length),
                    onChanged: (v) => nom = v,
                    style: const TextStyle(color: Colors.white),
                    decoration: InputDecoration(
                      filled: true,
                      fillColor: Colors.black,
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFF2A2A2A))),
                      enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFF2A2A2A))),
                      focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFF97316))),
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Text('Téléphone', style: TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  TextField(
                    controller: TextEditingController(text: telephone)..selection = TextSelection.collapsed(offset: telephone.length),
                    onChanged: (v) => telephone = v,
                    style: const TextStyle(color: Colors.white),
                    keyboardType: TextInputType.phone,
                    decoration: InputDecoration(
                      filled: true,
                      fillColor: Colors.black,
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFF2A2A2A))),
                      enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFF2A2A2A))),
                      focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFF97316))),
                    ),
                  ),
                ],
              );
            }

            String stepTitle = step == 1 ? 'Réserver un trajet' : step == 2 ? 'Choix du véhicule' : step == 3 ? 'Choix du siège' : 'Informations Passager';

            return Dialog(
              backgroundColor: Colors.transparent,
              insetPadding: const EdgeInsets.all(16),
              child: Container(
                width: 500, // max-w-lg
                constraints: BoxConstraints(
                  minHeight: 500,
                  maxHeight: MediaQuery.of(context).size.height * 0.9,
                ),
                decoration: BoxDecoration(
                  color: const Color(0xFF1A1A1A), // Web dark mode bg
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: [
                    BoxShadow(color: Colors.black.withOpacity(0.5), blurRadius: 24, spreadRadius: 8),
                  ],
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Header
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
                      decoration: const BoxDecoration(
                        color: Color(0xFF141414), // Header bg
                        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
                        border: Border(bottom: BorderSide(color: Color(0xFF2A2A2A))),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          if (step > 1)
                            Container(
                              decoration: BoxDecoration(
                                color: const Color(0xFF222222),
                                borderRadius: BorderRadius.circular(24),
                                border: Border.all(color: const Color(0xFF333333)),
                              ),
                              child: IconButton(
                                icon: const Icon(Icons.arrow_back, color: Colors.white70),
                                onPressed: () => setState(() => step--),
                              ),
                            )
                          else
                            const SizedBox(width: 48),
                          Text(stepTitle, style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w900)),
                          Container(
                            decoration: BoxDecoration(
                              color: const Color(0xFF222222),
                              borderRadius: BorderRadius.circular(24),
                              border: Border.all(color: const Color(0xFF333333)),
                            ),
                            child: IconButton(
                              icon: const Icon(Icons.close, color: Colors.white70),
                              onPressed: () => Navigator.pop(context),
                            ),
                          ),
                        ],
                      ),
                    ),

                    // Content
                    Flexible(
                      child: SingleChildScrollView(
                        padding: const EdgeInsets.all(24),
                        child: step == 1 ? buildStep1() : step == 2 ? buildStep2() : step == 3 ? buildStep3() : buildStep4(),
                      ),
                    ),

                    // Footer Action
                    if (step == 1 || step == 3 || (step == 4 && ticketPour != null))
                      Container(
                        padding: const EdgeInsets.all(24),
                        decoration: const BoxDecoration(
                          color: Color(0xFF141414), // Footer bg
                          borderRadius: BorderRadius.vertical(bottom: Radius.circular(24)),
                          border: Border(top: BorderSide(color: Color(0xFF2A2A2A))),
                        ),
                        child: SizedBox(
                          width: double.infinity,
                          child: ElevatedButton.icon(
                            onPressed: () async {
                              if (step == 1) {
                                setState(() => isSearching = true);
                                await Future.delayed(const Duration(seconds: 1));
                                setState(() {
                                  realTrips = [
                                    { "id": "1", "company": "Allo Dakar VIP", "price": 5000, "type": "Voiture 7 places", "options": "Climatisé", "time": "14:00" },
                                    { "id": "2", "company": "Fast Transit", "price": 4500, "type": "Voiture 5 places", "options": "Standard", "time": "15:30" }
                                  ];
                                  isSearching = false;
                                  step = 2;
                                });
                              } else if (step == 3) {
                                if (selectedSeat != null) {
                                  setState(() => step = 4);
                                } else {
                                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Veuillez choisir un siège')));
                                }
                              } else if (step == 4) {
                                if (nom.isNotEmpty && telephone.isNotEmpty) {
                                  Navigator.pop(context);
                                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Billet généré avec succès !'), backgroundColor: Color(0xFFF97316)));
                                }
                              }
                            },
                            icon: isSearching 
                              ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2)) 
                              : Icon(step == 4 ? Icons.check_circle : (step == 3 ? Icons.event_seat : Icons.search), color: Colors.white),
                            label: Text(step == 1 ? (isSearching ? 'Recherche...' : 'Rechercher un trajet') : step == 3 ? 'Confirmer le siège $selectedSeat' : 'Générer le billet', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Colors.white)),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFFF97316),
                              padding: const EdgeInsets.symmetric(vertical: 18),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                              elevation: 8,
                              shadowColor: const Color(0xFFF97316).withOpacity(0.5),
                            ),
                          ),
                        ),
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


  Widget _buildBookingInput(IconData icon, String hint, {Color iconColor = Colors.white54, TextEditingController? controller}) {
    return TextField(
      controller: controller,
      style: const TextStyle(color: Colors.white, fontSize: 14),
      decoration: InputDecoration(
        filled: true,
        fillColor: Colors.black, // bg-black
        prefixIcon: Icon(icon, color: iconColor, size: 20),
        hintText: hint,
        hintStyle: const TextStyle(color: Colors.white70),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFF2A2A2A)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFF2A2A2A)),
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
      hint: Text(hint, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(color: Colors.white70, fontSize: 13)),
      items: items.map((e) => DropdownMenuItem(value: e, child: Text(e, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 14)))).toList(),
      onChanged: onChanged,
      dropdownColor: const Color(0xFF1A1A1A),
      style: const TextStyle(color: Colors.white, fontSize: 14),
      decoration: InputDecoration(
        filled: true,
        fillColor: Colors.black,
        prefixIcon: Icon(icon, color: Colors.white54, size: 20),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFF2A2A2A))),
        enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFF2A2A2A))),
        focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFF97316))),
        contentPadding: const EdgeInsets.symmetric(vertical: 16, horizontal: 8),
      ),
      icon: const Icon(Icons.keyboard_arrow_down, color: Colors.white54),
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
          style: const TextStyle(color: Colors.white, fontSize: 14),
          decoration: InputDecoration(
            filled: true,
            fillColor: Colors.black,
            prefixIcon: icon != null ? Icon(icon, color: iconColor, size: 20) : null,
            hintText: hint,
            hintStyle: const TextStyle(color: Colors.white70),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(borderRadius), borderSide: const BorderSide(color: Color(0xFF2A2A2A))),
            enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(borderRadius), borderSide: const BorderSide(color: Color(0xFF2A2A2A))),
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
            color: const Color(0xFF1A1A1A),
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
                      decoration: const BoxDecoration(
                        border: Border(bottom: BorderSide(color: Color(0xFF2A2A2A))),
                      ),
                      child: Text(option, style: const TextStyle(color: Colors.white, fontSize: 14)),
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
