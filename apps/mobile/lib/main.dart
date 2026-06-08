import 'dart:ui';
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
import 'screens/driver/driver_marketplace_screen.dart';
import 'screens/driver/driver_revenus_screen.dart';
import 'screens/driver/driver_missions_screen.dart';
import 'screens/driver/driver_scanner_screen.dart';
import 'screens/driver/driver_vehicule_screen.dart';
import 'screens/driver/driver_settings_screen.dart';
import 'screens/driver/driver_localisation_screen.dart';
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
      scrollBehavior: const MaterialScrollBehavior().copyWith(
        dragDevices: {PointerDeviceKind.mouse, PointerDeviceKind.touch, PointerDeviceKind.stylus, PointerDeviceKind.unknown},
      ),
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
        '/driver/marketplace': (context) => const DriverMarketplaceScreen(),
        '/driver/revenus': (context) => const DriverRevenusScreen(),
        '/driver/missions': (context) => const DriverMissionsScreen(),
        '/driver/scanner': (context) => const DriverScannerScreen(),
        '/driver/vehicule': (context) => const DriverVehiculeScreen(),
        '/driver/settings': (context) => const DriverSettingsScreen(),
        '/driver/localisation': (context) => const DriverLocalisationScreen(),
      },
    );
  }
}
