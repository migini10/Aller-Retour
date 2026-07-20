import 'dart:io';
import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'client/client_dashboard_screen.dart';
import 'driver/driver_dashboard_screen.dart';
import '../widgets/app_drawer.dart';

class HomeScreen extends StatefulWidget {
  static bool isDriverMode = false;
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  bool isDriverMode = HomeScreen.isDriverMode;
  bool isDrawerOpen = false;

  @override
  void initState() {
    super.initState();
    isDriverMode = HomeScreen.isDriverMode;
    _loadMode();
  }

  Future<void> _loadMode() async {
    final prefs = await SharedPreferences.getInstance();
    if (mounted) {
      setState(() {
        isDriverMode = prefs.getBool('isDriverMode') ?? false;
        HomeScreen.isDriverMode = isDriverMode;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) {
        if (didPop) return;
        
        // Show exit confirmation dialog
        showDialog(
          context: context,
          builder: (context) => AlertDialog(
            backgroundColor: Theme.of(context).cardColor,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
            title: const Text('Quitter', style: TextStyle(fontWeight: FontWeight.bold)),
            content: Text('Voulez-vous vraiment quitter l\'application ?', style: TextStyle(color: Theme.of(context).colorScheme.onSurface)),
            actions: [
              TextButton(
                onPressed: () => Navigator.of(context).pop(),
                child: Text('Annuler', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant)),
              ),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFF97316),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
                onPressed: () {
                  
                  exit(0);
                },
                child: const Text('Quitter', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        );
      },
      child: Scaffold(
        backgroundColor: Theme.of(context).scaffoldBackgroundColor, // Slate 950
      body: Stack(
        children: [
          isDriverMode ? const DriverDashboardScreen() : const ClientDashboardScreen(),
          if (isDrawerOpen)
            Positioned.fill(
              child: BackdropFilter(
                filter: ImageFilter.blur(sigmaX: 5.0, sigmaY: 5.0),
                child: Container(color: Colors.transparent),
              ),
            ),
        ],
      ),
      onEndDrawerChanged: (isOpen) {
        setState(() {
          isDrawerOpen = isOpen;
        });
      },
      drawerScrimColor: Colors.black.withValues(alpha: 0.3), // Added darker scrim
      endDrawer: AppDrawer(
        isDriverMode: isDriverMode,
        onModeChanged: (newMode) async {
          final prefs = await SharedPreferences.getInstance();
          await prefs.setBool('isDriverMode', newMode);
          HomeScreen.isDriverMode = newMode;
          setState(() {
            isDriverMode = newMode;
          });
        },
      ),
    ),
    );
  }

}
