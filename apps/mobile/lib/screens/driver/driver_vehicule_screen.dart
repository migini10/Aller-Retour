import 'package:flutter/material.dart';

class DriverVehiculeScreen extends StatelessWidget {
  const DriverVehiculeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF020617),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text('Mon Véhicule', style: TextStyle(fontWeight: FontWeight.bold)),
        centerTitle: true,
      ),
      body: const Center(
        child: Text('Les informations du véhicule s\'afficheront ici', style: TextStyle(color: Colors.white54)),
      ),
    );
  }
}
