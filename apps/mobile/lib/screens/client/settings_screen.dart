import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import '../../theme/theme_provider.dart';
import '../../widgets/shared_scaffold.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool _appLockEnabled = false;
  bool _useBiometrics = false;

  @override
  void initState() {
    super.initState();
    _loadSettings();
  }

  Future<void> _loadSettings() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _appLockEnabled = prefs.getBool('appLockEnabled') ?? false;
      _useBiometrics = prefs.getBool('useBiometrics') ?? false;
    });
  }

  Future<bool> _showPinConfirmationDialog() async {
    final pinController = TextEditingController();
    bool isVerifying = false;
    bool? confirmed = await showDialog<bool>(
      context: context,
      barrierDismissible: false,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setDialogState) {
            final isDark = Theme.of(context).brightness == Brightness.dark;
            return AlertDialog(
              backgroundColor: isDark ? const Color(0xFF141824) : Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
              title: const Text('Confirmation de sécurité', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Text('Veuillez saisir votre code PIN à 6 chiffres pour confirmer cette modification.', style: TextStyle(fontSize: 14)),
                  const SizedBox(height: 16),
                  TextField(
                    controller: pinController,
                    obscureText: true,
                    keyboardType: TextInputType.number,
                    maxLength: 6,
                    autofocus: true,
                    style: TextStyle(
                      letterSpacing: 8, 
                      fontSize: 18, 
                      fontFamily: 'monospace',
                      color: isDark ? Colors.white : Colors.black87
                    ),
                    decoration: InputDecoration(
                      hintText: '******',
                      filled: true,
                      fillColor: isDark ? Colors.grey[900] : Colors.grey[100],
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                    ),
                  ),
                ],
              ),
              actions: [
                TextButton(
                  onPressed: isVerifying ? null : () => Navigator.pop(context, false),
                  child: const Text('Annuler', style: TextStyle(color: Colors.grey)),
                ),
                ElevatedButton(
                  onPressed: isVerifying ? null : () async {
                    if (pinController.text.length != 6) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Le code PIN doit comporter 6 chiffres')),
                      );
                      return;
                    }
                    
                    setDialogState(() => isVerifying = true);
                    
                    try {
                      final prefs = await SharedPreferences.getInstance();
                      final phone = prefs.getString('userPhone') ?? '';
                      final apiUrl = dotenv.env['API_URL'] ?? 'http://localhost:3333';
                      
                      final response = await http.post(
                        Uri.parse('$apiUrl/v1/auth/login-mobile'),
                        headers: {'Content-Type': 'application/json'},
                        body: jsonEncode({
                          'phone': phone,
                          'pin': pinController.text.trim()
                        }),
                      );
                      
                      if (response.statusCode == 200 || response.statusCode == 201) {
                        Navigator.pop(context, true);
                      } else {
                        String errorMsg = 'Code PIN incorrect';
                        try {
                          final data = jsonDecode(response.body);
                          if (data['message'] != null) {
                            errorMsg = data['message'];
                          }
                        } catch (_) {}

                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text(errorMsg)),
                        );
                        Navigator.pop(context, false);
                      }
                    } catch (e) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Impossible de contacter le serveur')),
                      );
                      Navigator.pop(context, false);
                    } finally {
                      setDialogState(() => isVerifying = false);
                    }
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.orange,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: isVerifying 
                    ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                    : const Text('Confirmer'),
                ),
              ],
            );
          }
        );
      }
    );
    return confirmed ?? false;
  }

  Future<void> _toggleAppLock(bool value) async {
    final isConfirmed = await _showPinConfirmationDialog();
    if (!isConfirmed) return;

    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('appLockEnabled', value);
    if (!value) {
      await prefs.setBool('useBiometrics', false);
    }
    setState(() {
      _appLockEnabled = value;
      if (!value) {
        _useBiometrics = false;
      }
    });

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(value ? 'Verrouillage activé' : 'Verrouillage désactivé')),
      );
    }
  }

  Future<void> _toggleBiometrics(bool value) async {
    final isConfirmed = await _showPinConfirmationDialog();
    if (!isConfirmed) return;

    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('useBiometrics', value);
    setState(() {
      _useBiometrics = value;
    });

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(value ? 'Biométrie activée' : 'Biométrie désactivée')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return SharedScaffold(
      title: 'Paramètres',
      subtitle: 'Configurez l\'application selon vos besoins.',
      icon: Icons.settings,
      iconColor: Colors.grey,
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
          Text('Préférences', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.2)),
          const SizedBox(height: 16),
          _buildSettingsTile(Icons.notifications_outlined, 'Notifications', 'Gérez vos alertes de trajets', context),
          _buildSettingsTile(Icons.language, 'Langue', 'Français', context),
          Consumer<ThemeProvider>(
            builder: (context, themeProvider, child) {
              String themeText = 'Système (Défaut)';
              if (themeProvider.themeMode == ThemeMode.light) themeText = 'Clair';
              if (themeProvider.themeMode == ThemeMode.dark) themeText = 'Sombre';
              
              return _buildSettingsTile(
                Icons.dark_mode_outlined, 
                'Thème', 
                themeText, 
                context,
                onTap: () {
                  showModalBottomSheet(
                    context: context,
                    backgroundColor: Theme.of(context).scaffoldBackgroundColor,
                    shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
                    builder: (context) {
                      return SafeArea(
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Padding(
                              padding: EdgeInsets.all(16.0),
                              child: Text('Choisir le thème', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                            ),
                            ListTile(
                              leading: const Icon(Icons.brightness_auto),
                              title: const Text('Système (Défaut)'),
                              trailing: themeProvider.themeMode == ThemeMode.system ? const Icon(Icons.check, color: Colors.green) : null,
                              onTap: () {
                                themeProvider.setThemeMode(ThemeMode.system);
                                Navigator.pop(context);
                              },
                            ),
                            ListTile(
                              leading: const Icon(Icons.light_mode),
                              title: const Text('Clair'),
                              trailing: themeProvider.themeMode == ThemeMode.light ? const Icon(Icons.check, color: Colors.green) : null,
                              onTap: () {
                                themeProvider.setThemeMode(ThemeMode.light);
                                Navigator.pop(context);
                              },
                            ),
                            ListTile(
                              leading: const Icon(Icons.dark_mode),
                              title: const Text('Sombre'),
                              trailing: themeProvider.themeMode == ThemeMode.dark ? const Icon(Icons.check, color: Colors.green) : null,
                              onTap: () {
                                themeProvider.setThemeMode(ThemeMode.dark);
                                Navigator.pop(context);
                              },
                            ),
                          ],
                        ),
                      );
                    }
                  );
                }
              );
            }
          ),
          const SizedBox(height: 32),
          Text('Sécurité', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.2)),
          const SizedBox(height: 16),
          _buildSettingsTile(Icons.lock_outline, 'Mot de passe', 'Modifier votre mot de passe', context),
          _buildSettingsTile(
            Icons.phonelink_lock, 
            'Verrouillage de l\'application', 
            'Activer le verrouillage automatique (PIN/Biométrie)', 
            context, 
            isSwitch: true,
            switchValue: _appLockEnabled,
            onSwitchChanged: _toggleAppLock,
          ),
          if (_appLockEnabled)
            _buildSettingsTile(
              Icons.fingerprint, 
              'Biométrie', 
              'Connexion avec Face ID / Touch ID', 
              context, 
              isSwitch: true,
              switchValue: _useBiometrics,
              onSwitchChanged: _toggleBiometrics,
            ),
          
          const SizedBox(height: 32),
          Text('À propos', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.2)),
          const SizedBox(height: 16),
          _buildSettingsTile(Icons.info_outline, 'Conditions d\'utilisation', '', context, onTap: () => Navigator.pushNamed(context, '/terms')),
          _buildSettingsTile(Icons.privacy_tip_outlined, 'Politique de confidentialité', '', context, onTap: () => Navigator.pushNamed(context, '/privacy')),
          _buildSettingsTile(Icons.help_outline, 'Aide et support', '', context, onTap: () => Navigator.pushNamed(context, '/support')),
          _buildSettingsTile(Icons.message_outlined, 'Contactez-nous', '', context, onTap: () => Navigator.pushNamed(context, '/contact')),
        ],
        ),
      ),
    );
  }

  Widget _buildSettingsTile(
    IconData icon, 
    String title, 
    String subtitle, 
    BuildContext context, {
      bool isSwitch = false, 
      bool? switchValue,
      ValueChanged<bool>? onSwitchChanged,
      VoidCallback? onTap
    }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Theme.of(context).dividerColor.withValues(alpha: 0.5)),
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        leading: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.05),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(icon, color: Theme.of(context).colorScheme.onSurfaceVariant, size: 22),
        ),
        title: Text(title, style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.bold, fontSize: 15)),
        subtitle: subtitle.isNotEmpty ? Text(subtitle, style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 12)) : null,
        trailing: isSwitch 
            ? Switch(value: switchValue ?? false, onChanged: onSwitchChanged, activeThumbColor: Colors.cyanAccent)
            : Icon(Icons.chevron_right, color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.38)),
        onTap: isSwitch ? null : (onTap ?? () {
          ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('$title en développement')));
        }),
      ),
    );
  }
}
