import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:shared_preferences/shared_preferences.dart';
import 'screens/auth/biometric_lock_screen.dart';
import 'screens/auth/login_screen.dart';
import 'screens/auth/register_screen.dart';
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
import 'screens/client/parrainage_screen.dart';
import 'services/offline_db.dart';
import 'theme/app_theme.dart';
import 'theme/theme_provider.dart';
import 'package:provider/provider.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await dotenv.load(fileName: ".env");
  if (!kIsWeb) {
    await OfflineDatabase.instance.init();
  }
  
  final prefs = await SharedPreferences.getInstance();
  final isLoggedIn = prefs.getBool('isLoggedIn') ?? false;

  runApp(
    ChangeNotifierProvider(
      create: (_) => ThemeProvider(),
      child: AllerRetourApp(isLoggedIn: isLoggedIn),
    ),
  );
}

class AllerRetourApp extends StatelessWidget {
  final bool isLoggedIn;
  
  const AllerRetourApp({super.key, required this.isLoggedIn});

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);
    return MaterialApp(
      title: 'Aller-Retour Mobile',
      debugShowCheckedModeBanner: false,
      scrollBehavior: const MaterialScrollBehavior().copyWith(
        dragDevices: {PointerDeviceKind.mouse, PointerDeviceKind.touch, PointerDeviceKind.stylus, PointerDeviceKind.unknown},
      ),
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: themeProvider.themeMode,
      initialRoute: isLoggedIn ? '/lock' : '/login',
      routes: {
        '/login': (context) => const LoginScreen(),
        '/register': (context) => const RegisterScreen(),
        '/lock': (context) => const BiometricLockScreen(),
        '/home': (context) => const HomeScreen(),
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
        '/parrainage': (context) => const ParrainageScreen(),
      },
    );
  }
}
