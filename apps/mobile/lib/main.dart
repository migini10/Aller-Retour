import 'package:flutter/material.dart';
import 'screens/home_screen.dart';
import 'services/offline_db.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await OfflineDatabase.instance.init();
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
      home: const HomeScreen(),
    );
  }
}
