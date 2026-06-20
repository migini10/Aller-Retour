import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:share_plus/share_plus.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:math';
import '../../widgets/app_drawer.dart';

class ParrainageScreen extends StatefulWidget {
  const ParrainageScreen({super.key});

  @override
  State<ParrainageScreen> createState() => _ParrainageScreenState();
}

class _ParrainageScreenState extends State<ParrainageScreen> {
  String _referralCode = 'CHARGEMENT...';
  bool _copied = false;
  final ScrollController _scrollController = ScrollController();
  double _lastScrollY = 0;
  bool _showTopbar = true;

  @override
  void initState() {
    super.initState();
    _loadOrGenerateCode();
    _scrollController.addListener(() {
      final currentScrollY = _scrollController.offset;
      if (currentScrollY < 10) {
        if (!_showTopbar) setState(() => _showTopbar = true);
      } else if (currentScrollY > _lastScrollY && currentScrollY > 60) {
        if (_showTopbar) setState(() => _showTopbar = false);
      } else if (currentScrollY < _lastScrollY) {
        if (!_showTopbar) setState(() => _showTopbar = true);
      }
      _lastScrollY = currentScrollY;
    });
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  Future<void> _loadOrGenerateCode() async {
    final prefs = await SharedPreferences.getInstance();
    String? phone = prefs.getString('userPhone');

    if (phone != null && phone.isNotEmpty) {
      int hash = 0;
      for (int i = 0; i < phone.length; i++) {
        int char = phone.codeUnitAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash.toSigned(32);
      }
      
      String baseStr = hash.abs().toRadixString(36).toUpperCase();
      String mix = ((phone.codeUnitAt(phone.length - 1) * 7) % 36).toRadixString(36).toUpperCase();
      
      String codeStr = mix + baseStr;
      if (codeStr.length > 6) {
        codeStr = codeStr.substring(0, 6);
      }
      codeStr = codeStr.padLeft(6, 'X');
      
      setState(() {
        _referralCode = 'AR-$codeStr';
      });
    } else {
      setState(() {
        _referralCode = 'AR-GUEST';
      });
    }
  }

  void _handleCopy() {
    Clipboard.setData(ClipboardData(text: _referralCode));
    setState(() {
      _copied = true;
    });
    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) {
        setState(() {
          _copied = false;
        });
      }
    });
  }

  void _handleShare() {
    Share.share(
      'Inscris-toi sur Allogoo avec mon code $_referralCode et gagne 2000 FCFA sur ton premier trajet !\nhttps://allogoo.com',
      subject: 'Rejoins Allogoo',
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      endDrawer: const AppDrawer(isDriverMode: false),
      body: SafeArea(
        child: Stack(
          children: [
            SingleChildScrollView(
              controller: _scrollController,
              padding: const EdgeInsets.only(top: 80, bottom: 40),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Hero Section
              Container(
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Colors.orange, Colors.red],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.orange.withValues(alpha: 0.3),
                      blurRadius: 20,
                      offset: const Offset(0, 10),
                    ),
                  ],
                ),
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 40),
                child: Column(
                  children: [
                    Container(
                      width: 80,
                      height: 80,
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.2),
                        shape: BoxShape.circle,
                        border: Border.all(color: Colors.white.withValues(alpha: 0.3)),
                      ),
                      child: const Icon(Icons.card_giftcard, size: 40, color: Colors.white),
                    ),
                    const SizedBox(height: 24),
                    const Text(
                      'Parrainez un proche',
                      style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.w900,
                        color: Colors.white,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 12),
                    RichText(
                      textAlign: TextAlign.center,
                      text: const TextSpan(
                        style: TextStyle(fontSize: 16, color: Colors.white, height: 1.5),
                        children: [
                          TextSpan(text: 'Offrez '),
                          TextSpan(text: '2000 FCFA', style: TextStyle(fontWeight: FontWeight.w900)),
                          TextSpan(text: ' à vos amis et gagnez '),
                          TextSpan(text: '2000 FCFA', style: TextStyle(fontWeight: FontWeight.w900)),
                          TextSpan(text: ' à leur premier trajet complété.'),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // Code Section
              Container(
                decoration: BoxDecoration(
                  color: Theme.of(context).cardColor,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: isDark ? Colors.grey[800]! : Colors.grey[200]!),
                ),
                padding: const EdgeInsets.all(24),
                child: Column(
                  children: [
                    Text(
                      'VOTRE CODE PERSONNEL',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: Colors.grey[500],
                        letterSpacing: 1.5,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.symmetric(vertical: 20),
                      decoration: BoxDecoration(
                        color: isDark ? Colors.grey[900] : Colors.grey[100],
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: isDark ? Colors.grey[800]! : Colors.grey[200]!),
                      ),
                      child: Text(
                        _referralCode,
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 28,
                          fontWeight: FontWeight.w900,
                          letterSpacing: 2,
                          color: Theme.of(context).colorScheme.onSurface,
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Expanded(
                          child: ElevatedButton.icon(
                            onPressed: _handleCopy,
                            icon: Icon(_copied ? Icons.check_circle : Icons.copy, size: 20, color: isDark ? Colors.white : Colors.black),
                            label: Text(_copied ? 'Copié !' : 'Copier'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: isDark ? Colors.grey[800] : Colors.grey[200],
                              foregroundColor: isDark ? Colors.white : Colors.black,
                              padding: const EdgeInsets.symmetric(vertical: 16),
                              elevation: 0,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: ElevatedButton.icon(
                            onPressed: _handleShare,
                            icon: const Icon(Icons.share, size: 20, color: Colors.white),
                            label: const Text('Partager'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.orange,
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(vertical: 16),
                              elevation: 8,
                              shadowColor: Colors.orange.withValues(alpha: 0.5),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            ),
                          ),
                        ),
                      ],
                    )
                  ],
                ),
              ),

              const SizedBox(height: 32),

              // How it works
              Row(
                children: [
                  Container(
                    width: 4,
                    height: 20,
                    decoration: BoxDecoration(
                      color: Colors.orange,
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    'Comment ça marche ?',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Theme.of(context).colorScheme.onSurface,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              _buildStepCard(
                icon: Icons.share,
                iconColor: Colors.blue,
                title: '1. Partagez',
                description: 'Envoyez votre code unique à vos amis et votre famille.',
                isDark: isDark,
              ),
              const SizedBox(height: 12),
              _buildStepCard(
                icon: Icons.group_add,
                iconColor: Colors.green,
                title: '2. Inscription',
                description: "Vos amis s'inscrivent en utilisant votre code de parrainage.",
                isDark: isDark,
              ),
              const SizedBox(height: 12),
              _buildStepCard(
                icon: Icons.monetization_on,
                iconColor: Colors.orange,
                title: '3. Récompense',
                description: 'Recevez 2000 FCFA dès leur premier trajet terminé !',
                isDark: isDark,
              ),
            ],
          ),
        ),
      ),
      // Custom Header with Back Button, Logo, and Hamburger Menu
      AnimatedPositioned(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
        top: _showTopbar ? 0 : -100, // Slide up to disappear
        left: 0,
        right: 0,
        child: Container(
          color: Theme.of(context).scaffoldBackgroundColor.withValues(alpha: 0.95),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  IconButton(
                    icon: const Icon(Icons.arrow_back),
                    onPressed: () => Navigator.pop(context),
                  ),
                  const SizedBox(width: 8),
                  Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      color: Colors.orange.withValues(alpha: 0.4),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: Colors.deepOrange.shade400, width: 2),
                    ),
                    child: Icon(Icons.directions_car, color: Colors.deepOrange.shade400, size: 18),
                  ),
                  const SizedBox(width: 10),
                  RichText(
                    text: TextSpan(
                      style: const TextStyle(
                        fontWeight: FontWeight.w900, 
                        fontSize: 20,
                        letterSpacing: -0.5,
                        fontFamily: 'Roboto',
                      ),
                      children: [
                        TextSpan(text: 'Aller-', style: TextStyle(color: Theme.of(context).colorScheme.onSurface)),
                        TextSpan(text: 'Retour', style: TextStyle(color: Colors.deepOrange.shade400)),
                      ],
                    ),
                  ),
                ],
              ),
              _buildHamburgerMenu(context, isDark),
            ],
          ),
        ),
      ),
    ],
  ),
),
);
}

Widget _buildHamburgerMenu(BuildContext context, bool isDark) {
  return Container(
    decoration: BoxDecoration(
      color: isDark ? const Color(0xFFF97316).withValues(alpha: 0.1) : const Color(0xFFFFF7ED),
      borderRadius: BorderRadius.circular(12),
      border: Border.all(color: isDark ? const Color(0xFFF97316).withValues(alpha: 0.3) : const Color(0xFFFED7AA), width: 1),
      boxShadow: [
        if (!isDark) BoxShadow(color: Colors.black.withValues(alpha: 0.1), blurRadius: 6, offset: const Offset(0, 3)),
      ],
    ),
    child: Builder(
      builder: (innerContext) {
        return IconButton(
          icon: Icon(Icons.menu, color: isDark ? const Color(0xFFFB923C) : const Color(0xFFF97316), size: 20),
          padding: const EdgeInsets.all(8),
          constraints: const BoxConstraints(),
          onPressed: () {
            Scaffold.of(innerContext).openEndDrawer();
          },
        );
      }
    ),
  );
}

  Widget _buildStepCard({
    required IconData icon,
    required Color iconColor,
    required String title,
    required String description,
    required bool isDark,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: isDark ? Colors.grey[800]! : Colors.grey[200]!),
      ),
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: iconColor.withValues(alpha: 0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: iconColor),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                    color: Theme.of(context).colorScheme.onSurface,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  description,
                  style: TextStyle(
                    fontSize: 13,
                    color: Colors.grey[500],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
