import 'package:flutter/material.dart';

class DriverScannerScreen extends StatelessWidget {
  const DriverScannerScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF020617),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text('Scanner Billet', style: TextStyle(fontWeight: FontWeight.bold)),
        centerTitle: true,
      ),
      body: const Center(
        child: Text('L\'interface de scan s\'affichera ici', style: TextStyle(color: Colors.white54)),
      ),
    );
  }
}
