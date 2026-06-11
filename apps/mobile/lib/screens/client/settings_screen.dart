import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../theme/theme_provider.dart';
import '../../widgets/shared_scaffold.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return SharedScaffold(
      title: 'Paramètres',
      subtitle: 'Configurez l\'application selon vos besoins.',
      icon: Icons.settings,
      iconColor: Colors.grey,
      body: ListView(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        padding: const EdgeInsets.all(20),
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
          _buildSettingsTile(Icons.fingerprint, 'Biométrie', 'Connexion avec Face ID / Touch ID', context, isSwitch: true),
          
          const SizedBox(height: 32),
          Text('À propos', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.2)),
          const SizedBox(height: 16),
          _buildSettingsTile(Icons.info_outline, 'Conditions d\'utilisation', '', context),
          _buildSettingsTile(Icons.privacy_tip_outlined, 'Politique de confidentialité', '', context),
          _buildSettingsTile(Icons.help_outline, 'Aide et support', '', context),
        ],
      ),
    );
  }

  Widget _buildSettingsTile(IconData icon, String title, String subtitle, BuildContext context, {bool isSwitch = false, VoidCallback? onTap}) {
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
            ? Switch(value: true, onChanged: (val) {}, activeThumbColor: Colors.cyanAccent)
            : Icon(Icons.chevron_right, color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.38)),
        onTap: isSwitch ? null : (onTap ?? () {
          ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('$title en développement')));
        }),
      ),
    );
  }
}
