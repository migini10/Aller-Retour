import 'package:flutter/material.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF020617),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0F172A),
        elevation: 0,
        title: const Text('Paramètres', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          const Text('Préférences', style: TextStyle(color: Colors.white54, fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.2)),
          const SizedBox(height: 16),
          _buildSettingsTile(Icons.notifications_outlined, 'Notifications', 'Gérez vos alertes de trajets', context),
          _buildSettingsTile(Icons.language, 'Langue', 'Français', context),
          _buildSettingsTile(Icons.dark_mode_outlined, 'Thème', 'Sombre (Défaut)', context),
          
          const SizedBox(height: 32),
          const Text('Sécurité', style: TextStyle(color: Colors.white54, fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.2)),
          const SizedBox(height: 16),
          _buildSettingsTile(Icons.lock_outline, 'Mot de passe', 'Modifier votre mot de passe', context),
          _buildSettingsTile(Icons.fingerprint, 'Biométrie', 'Connexion avec Face ID / Touch ID', context, isSwitch: true),
          
          const SizedBox(height: 32),
          const Text('À propos', style: TextStyle(color: Colors.white54, fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.2)),
          const SizedBox(height: 16),
          _buildSettingsTile(Icons.info_outline, 'Conditions d\'utilisation', '', context),
          _buildSettingsTile(Icons.privacy_tip_outlined, 'Politique de confidentialité', '', context),
          _buildSettingsTile(Icons.help_outline, 'Aide et support', '', context),
        ],
      ),
    );
  }

  Widget _buildSettingsTile(IconData icon, String title, String subtitle, BuildContext context, {bool isSwitch = false}) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: const Color(0xFF0F172A),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white10),
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        leading: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.05),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(icon, color: Colors.white70, size: 22),
        ),
        title: Text(title, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15)),
        subtitle: subtitle.isNotEmpty ? Text(subtitle, style: const TextStyle(color: Colors.white54, fontSize: 12)) : null,
        trailing: isSwitch 
            ? Switch(value: true, onChanged: (val) {}, activeColor: Colors.cyanAccent)
            : const Icon(Icons.chevron_right, color: Colors.white38),
        onTap: isSwitch ? null : () {
          ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('$title en développement')));
        },
      ),
    );
  }
}
