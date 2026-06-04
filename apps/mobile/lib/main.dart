import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'screens/home_screen.dart';
import 'screens/client/wallet_screen.dart';
import 'screens/client/colis_screen.dart';
import 'screens/client/fidelite_screen.dart';
import 'screens/client/qr_code_screen.dart';
import 'screens/client/profile_screen.dart';
import 'screens/client/history_screen.dart';
import 'screens/client/settings_screen.dart';
import 'services/offline_db.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  if (!kIsWeb) {
    await OfflineDatabase.instance.init();
  }
  runApp(const AllerRetourApp());
}

class AllerRetourApp extends StatelessWidget {
  const AllerRetourApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Aller-Retour Mobile',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF10B981), // Emerald 500
          brightness: Brightness.dark,
        ),
        useMaterial3: true,
        fontFamily: 'Roboto',
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => const HomeScreen(),
        '/wallet': (context) => const WalletScreen(),
        '/colis': (context) => const ColisScreen(),
        '/fidelite': (context) => const FideliteScreen(),
        '/qrcode': (context) => const QrCodeScreen(),
        '/profile': (context) => const ProfileScreen(),
        '/history': (context) => const HistoryScreen(),
        '/settings': (context) => const SettingsScreen(),
      },
    );
  }
}
