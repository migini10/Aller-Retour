import 'dart:ui';
import 'dart:async';
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
import 'screens/client/allo_prive_screen.dart';
import 'screens/client/history_screen.dart';
import 'screens/client/transactions_screen.dart';
import 'screens/client/transactions_screen.dart';
import 'screens/client/settings_screen.dart';
import 'screens/contact_screen.dart';
import 'screens/support_screen.dart';
import 'screens/privacy_screen.dart';
import 'screens/terms_screen.dart';
import 'screens/client/expired_tickets_screen.dart';
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

final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();

class InactivityTimer {
  static Timer? _timer;
  static const int _timeoutMinutes = 10;
  static bool _isLocked = false;

  static void resetTimer() {
    _timer?.cancel();
    _timer = Timer(const Duration(minutes: _timeoutMinutes), () async {
      final prefs = await SharedPreferences.getInstance();
      final isLoggedIn = prefs.getBool('isLoggedIn') ?? false;
      final appLockEnabled = prefs.getBool('appLockEnabled') ?? false;
      if (!isLoggedIn || !appLockEnabled) return; // Only lock if logged in and app lock is enabled
      
      _isLocked = true;
      if (navigatorKey.currentState != null) {
        // Prevent pushing multiple lock screens
        bool canPush = true;
        navigatorKey.currentState!.popUntil((route) {
          if (route.settings.name == '/lock' || route.settings.name == '/' || route.settings.name == '/login' || route.settings.name == '/register') {
            canPush = false;
          }
          return true; // Don't actually pop anything
        });
        if (canPush) {
          navigatorKey.currentState!.pushNamed('/lock');
        }
      }
    });
  }
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await dotenv.load(fileName: ".env");
  if (!kIsWeb) {
    await OfflineDatabase.instance.init();
  }
  
  final prefs = await SharedPreferences.getInstance();
  final hasToken = prefs.getString('auth_token') != null;
  final isLoggedIn = (prefs.getBool('isLoggedIn') ?? false) && hasToken;
  final appLockEnabled = prefs.getBool('appLockEnabled') ?? false;

  runApp(
    ChangeNotifierProvider(
      create: (_) => ThemeProvider(),
      child: AllerRetourApp(isLoggedIn: isLoggedIn, appLockEnabled: appLockEnabled),
    ),
  );
}

class AllerRetourApp extends StatelessWidget {
  final bool isLoggedIn;
  final bool appLockEnabled;
  
  const AllerRetourApp({super.key, required this.isLoggedIn, required this.appLockEnabled});

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);
    return MaterialApp(
      navigatorKey: navigatorKey,
      builder: (context, child) {
        return GestureDetector(
          behavior: HitTestBehavior.translucent,
          onTapDown: (_) => InactivityTimer.resetTimer(),
          onPanDown: (_) => InactivityTimer.resetTimer(),
          child: child,
        );
      },
      title: 'Allogoo Mobile',
      debugShowCheckedModeBanner: false,
      scrollBehavior: const MaterialScrollBehavior().copyWith(
        dragDevices: {PointerDeviceKind.mouse, PointerDeviceKind.touch, PointerDeviceKind.stylus, PointerDeviceKind.unknown},
      ),
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: themeProvider.themeMode,
      initialRoute: '/',
      routes: {
        '/': (context) => isLoggedIn 
            ? (appLockEnabled ? const BiometricLockScreen() : const HomeScreen())
            : const LoginScreen(),
        '/login': (context) => const LoginScreen(),
        '/register': (context) => const RegisterScreen(),
        '/lock': (context) => const BiometricLockScreen(),
        '/home': (context) => const HomeScreen(),
        '/wallet': (context) => const WalletScreen(),
        '/colis': (context) => const ColisScreen(),
        '/fidelite': (context) => const FideliteScreen(),
        '/qrcode': (context) => const QrCodeScreen(),
        '/expired-tickets': (context) => const ExpiredTicketsScreen(),
        '/profile': (context) => const ProfileScreen(),
        '/allo-prive': (context) => const AlloPriveScreen(),
        '/history': (context) => const HistoryScreen(),
        '/transactions': (context) => const TransactionsScreen(),
        '/settings': (context) => const SettingsScreen(),
        '/driver/marketplace': (context) => const DriverMarketplaceScreen(),
        '/driver/revenus': (context) => const DriverRevenusScreen(),
        '/driver/missions': (context) => const DriverMissionsScreen(),
        '/driver/scanner': (context) => const DriverScannerScreen(),
        '/driver/vehicule': (context) => const DriverVehiculeScreen(),
        '/driver/settings': (context) => const DriverSettingsScreen(),
        '/driver/localisation': (context) => const DriverLocalisationScreen(),
        '/parrainage': (context) => const ParrainageScreen(),
        '/contact': (context) => const ContactScreen(),
        '/support': (context) => const SupportScreen(),
        '/privacy': (context) => const PrivacyScreen(),
        '/terms': (context) => const TermsScreen(),
      },
    );
  }
}
