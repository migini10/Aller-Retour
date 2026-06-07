import 'package:flutter/material.dart';

class DriverMissionsScreen extends StatelessWidget {
  const DriverMissionsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF020617),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text('Missions & Trajets', style: TextStyle(fontWeight: FontWeight.bold)),
        centerTitle: true,
      ),
      body: const Center(
        child: Text('Vos missions s\'afficheront ici', style: TextStyle(color: Colors.white54)),
      ),
    );
  }
}
