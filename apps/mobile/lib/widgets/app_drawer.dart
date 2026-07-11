import 'package:aller_retour_mobile/core/constants/storage_keys.dart';
import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../screens/home_screen.dart';

class AppDrawer extends StatefulWidget {
  final bool isDriverMode;
  final ValueChanged<bool>? onModeChanged;

  const AppDrawer({
    super.key,
    required this.isDriverMode,
    this.onModeChanged,
  });

  @override
  State<AppDrawer> createState() => _AppDrawerState();
}

class _AppDrawerState extends State<AppDrawer> {
  String _userName = 'Utilisateur';
  String _userInitials = 'U';
  String _userPhone = '';

  @override
  void initState() {
    super.initState();
    _loadUserData();
  }

  Future<void> _loadUserData() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _userName = prefs.getString(StorageKeys.userName) ?? 'Utilisateur';
      _userPhone = prefs.getString(StorageKeys.userPhone) ?? '';
      _userInitials = _userName.isNotEmpty ? _userName.substring(0, 1).toUpperCase() : 'U';
      if (_userName.contains(' ')) {
        final parts = _userName.split(' ');
        if (parts.length > 1 && parts[1].isNotEmpty) {
          _userInitials += parts[1].substring(0, 1).toUpperCase();
        }
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Drawer(
      backgroundColor: Colors.transparent,
      elevation: 0,
      child: ClipRRect(
        borderRadius: const BorderRadius.horizontal(left: Radius.circular(32)),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 15.0, sigmaY: 15.0),
          child: Container(
            color: Theme.of(context).brightness == Brightness.dark
                ? const Color(0xFF0B0F19).withValues(alpha: 0.95)
                : Colors.white.withValues(alpha: 0.95),
            child: SafeArea(
              child: Column(
                children: [
                  // Stylish Header
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(3),
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            border: Border.all(color: Colors.cyanAccent, width: 2),
                          ),
                          child: CircleAvatar(
                            radius: 28,
                            backgroundColor: Colors.cyanAccent.withValues(alpha: 0.2),
                            child: Text(_userInitials, style: const TextStyle(color: Colors.cyanAccent, fontSize: 20, fontWeight: FontWeight.bold)),
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(_userName, style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 20, fontWeight: FontWeight.bold)),
                              const SizedBox(height: 6),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                decoration: BoxDecoration(
                                  color: Colors.orangeAccent.withValues(alpha: 0.2),
                                  borderRadius: BorderRadius.circular(8),
                                  border: Border.all(color: Colors.orangeAccent.withValues(alpha: 0.5)),
                                ),
                                child: Text(widget.isDriverMode ? 'Chauffeur Pro' : 'Voyageur Gold', style: const TextStyle(color: Colors.orangeAccent, fontSize: 11, fontWeight: FontWeight.bold)),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24),
                    child: Divider(color: Theme.of(context).dividerColor.withValues(alpha: 0.5)),
                  ),
                  const SizedBox(height: 16),
                  // Menu Items
                  Expanded(
                    child: SingleChildScrollView(
                      child: Column(
                        children: [
                          if (widget.isDriverMode) ...[
                            _buildMenuItem(context, Icons.dashboard_outlined, 'Accueil', Colors.orange, route: '/'),
                            _buildMenuItem(context, Icons.route_outlined, 'Missions & Trajets', Colors.green, route: '/driver/missions'),
                            _buildMenuItem(context, Icons.location_on_outlined, 'Localisation Client', Colors.cyan, route: '/driver/localisation'),
                            _buildMenuItem(context, Icons.qr_code_scanner, 'Scanner Billet', Colors.purple, route: '/driver/scanner'),
                            _buildMenuItem(context, Icons.account_balance_wallet_outlined, 'Revenus', Colors.teal, route: '/driver/revenus'),
                            _buildMenuItem(context, Icons.storefront_outlined, 'Marketplace', Colors.indigo, route: '/driver/marketplace'),
                            _buildMenuItem(context, Icons.inventory_2_outlined, 'Gestion des Colis', Colors.amber, route: '/driver/colis'),
                            _buildMenuItem(context, Icons.directions_bus_outlined, 'Véhicule', Colors.blueGrey, route: '/driver/vehicule'),
                            _buildMenuItem(context, Icons.notifications_none_outlined, 'Notifications', Colors.red, route: '/driver/notifications'),
                            _buildMenuItem(context, Icons.help_outline, 'Support', Colors.lightBlue, route: '/driver/support'),
                            _buildMenuItem(context, Icons.settings_outlined, 'Paramètres', Colors.grey, route: '/driver/settings'),
                          ] else ...[
                            _buildMenuItem(context, Icons.dashboard_outlined, 'Tableau de bord', Colors.cyan, route: '/'),
                            _buildMenuItem(context, Icons.person_outline, 'Mon Profil', Colors.blue, route: '/profile'),
                            _buildMenuItem(context, Icons.account_balance_wallet_outlined, 'Mon Wallet', Colors.green, route: '/wallet'),
                            _buildMenuItem(context, Icons.inventory_2_outlined, 'Mes Colis', Colors.purple, route: '/colis'),
                            _buildMenuItem(context, Icons.qr_code_scanner_outlined, 'QR Code & Billets', Colors.orange, route: '/qrcode'),
                            _buildMenuItem(context, Icons.workspace_premium_outlined, 'Points de transport', Colors.green, route: '/fidelite'),
                            _buildMenuItem(context, Icons.card_giftcard, 'Parrainage', Colors.red, route: '/parrainage'),
                            _buildMenuItem(context, Icons.history, 'Historique', Colors.indigo, route: '/transactions'),
                            _buildMenuItem(context, Icons.settings_outlined, 'Paramètres', Colors.grey, route: '/settings'),
                            const Divider(color: Colors.white24, height: 32),
                            ListTile(
                              leading: Container(
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  color: Colors.red.withValues(alpha: 0.1),
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: const Icon(Icons.logout, color: Colors.red, size: 20),
                              ),
                              title: const Text('Se déconnecter', style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold)),
                              onTap: () async {
                                final prefs = await SharedPreferences.getInstance();
                                await prefs.setBool('isLoggedIn', false);
                                await prefs.remove(StorageKeys.userPhone);
                                await prefs.remove(StorageKeys.authToken);
                                await prefs.remove(StorageKeys.userName);
                                if (context.mounted) {
                                  Navigator.pushNamedAndRemoveUntil(context, '/login', (route) => false);
                                }
                              },
                            ),
                          ],
                        ],
                      ),
                    ),
                  ),
                  // Space Switcher button and Logout button
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24),
                    child: Divider(color: Theme.of(context).dividerColor.withValues(alpha: 0.5)),
                  ),
                  const SizedBox(height: 16),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                    child: InkWell(
                      onTap: () async {
                        final prefs = await SharedPreferences.getInstance();
                        
                        // Strict isolation enforcement for space switching
                        Navigator.pop(context);
                        await prefs.setBool('isLoggedIn', false);
                        await prefs.remove(StorageKeys.userPhone);
                        await prefs.remove(StorageKeys.authToken);
                        await prefs.remove(StorageKeys.userName);
                        await prefs.remove(StorageKeys.userRole);
                        await prefs.remove('isDriverMode');
                        // Reset HomeScreen static state
                        HomeScreen.isDriverMode = false;
                        await prefs.setString('session_error', widget.isDriverMode 
                            ? 'Déconnexion : Veuillez vous connecter avec un compte Passager' 
                            : 'Déconnexion : Veuillez vous connecter avec un compte Chauffeur');
                        
                        if (context.mounted) {
                          Navigator.pushNamedAndRemoveUntil(context, '/login', (route) => false);
                        }
                        // Le snackbar est géré sur l'écran de login via session_error
                      },
                      borderRadius: BorderRadius.circular(12),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                        decoration: BoxDecoration(
                          color: widget.isDriverMode 
                            ? Colors.cyanAccent.withValues(alpha: 0.1)
                            : Colors.greenAccent.withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: widget.isDriverMode 
                              ? Colors.cyanAccent.withValues(alpha: 0.2)
                              : Colors.greenAccent.withValues(alpha: 0.2)
                          ),
                        ),
                        child: Row(
                          children: [
                            Icon(
                              widget.isDriverMode ? Icons.person : Icons.directions_car, 
                              color: widget.isDriverMode 
                                ? (Theme.of(context).brightness == Brightness.dark ? Colors.cyanAccent : Colors.cyan.shade600)
                                : (Theme.of(context).brightness == Brightness.dark ? Colors.greenAccent : Colors.green.shade600),
                              size: 20,
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Text(
                                widget.isDriverMode ? 'Espace Voyageur' : 'Espace Chauffeur',
                                style: TextStyle(
                                  color: widget.isDriverMode 
                                    ? (Theme.of(context).brightness == Brightness.dark ? Colors.cyanAccent : Colors.cyan.shade600)
                                    : (Theme.of(context).brightness == Brightness.dark ? Colors.greenAccent : Colors.green.shade600),
                                  fontSize: 14,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                    child: InkWell(
                      onTap: () async {
                        Navigator.pop(context);
                        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Déconnexion en cours...')));
                        final prefs = await SharedPreferences.getInstance();
                        await prefs.setBool('isLoggedIn', false);
                        await prefs.remove(StorageKeys.userPhone);
                        await prefs.remove(StorageKeys.authToken);
                        await prefs.remove(StorageKeys.userName);
                        await prefs.remove(StorageKeys.userRole);
                        await prefs.remove('isDriverMode');
                        HomeScreen.isDriverMode = false;
                        if (context.mounted) {
                          Navigator.pushNamedAndRemoveUntil(context, '/login', (route) => false);
                        }
                      },
                      borderRadius: BorderRadius.circular(12),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                        child: Row(
                          children: [
                            Icon(Icons.logout, color: Theme.of(context).brightness == Brightness.dark ? Colors.white54 : const Color(0xFF64748B), size: 20),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Text(
                                'Se déconnecter',
                                style: TextStyle(
                                  color: Theme.of(context).brightness == Brightness.dark ? Colors.white54 : const Color(0xFF64748B),
                                  fontSize: 14,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildMenuItem(BuildContext context, IconData icon, String title, Color color, {bool isLogout = false, String? route}) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 2),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(16),
          hoverColor: Theme.of(context).brightness == Brightness.dark
              ? Colors.white.withValues(alpha: 0.05)
              : Colors.black.withValues(alpha: 0.02),
          onTap: () {
            if (route != null) {
              Navigator.pop(context); // Close drawer
              
              // Check if we are already on this route to avoid pushing duplicates
              bool isAlreadyOnRoute = false;
              Navigator.popUntil(context, (r) {
                if (r.settings.name == route) {
                  isAlreadyOnRoute = true;
                }
                return true;
              });
              
              if (!isAlreadyOnRoute) {
                if (route == '/') {
                  Navigator.pushNamedAndRemoveUntil(context, route, (r) => false);
                } else {
                  Navigator.pushNamed(context, route);
                }
              }
            } else {
              if (isLogout) {
                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Déconnexion en cours...')));
              } else {
                ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('$title bientôt disponible !')));
              }
            }
          },
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(16),
            ),
            child: Row(
              children: [
                Container(
                  width: 36,
                  height: 36,
                  decoration: BoxDecoration(
                    color: color.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(icon, color: color, size: 18),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    title,
                    style: TextStyle(
                      color: isLogout 
                        ? Colors.redAccent 
                        : (Theme.of(context).brightness == Brightness.dark ? Colors.white70 : const Color(0xFF475569)),
                      fontWeight: FontWeight.w600,
                      fontSize: 14,
                    ),
                  ),
                ),
                if (!isLogout)
                  Icon(Icons.chevron_right, color: Theme.of(context).brightness == Brightness.dark ? Colors.white24 : Colors.black26, size: 18),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
