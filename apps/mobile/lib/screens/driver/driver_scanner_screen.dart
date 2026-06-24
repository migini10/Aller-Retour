import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class DriverScannerScreen extends StatefulWidget {
  const DriverScannerScreen({super.key});

  @override
  State<DriverScannerScreen> createState() => _DriverScannerScreenState();
}

class _DriverScannerScreenState extends State<DriverScannerScreen> {
  MobileScannerController cameraController = MobileScannerController(
    facing: CameraFacing.back,
  );
  bool isScanning = true;
  String scanResult = 'idle'; // 'idle', 'valid', 'invalid', 'already_used', 'scanning'
  Map<String, dynamic>? scanData;
  final TextEditingController _manualCodeController = TextEditingController();

  void _onDetect(BarcodeCapture capture) {
    if (!isScanning) return;
    
    final List<Barcode> barcodes = capture.barcodes;
    if (barcodes.isNotEmpty) {
      final String code = barcodes.first.rawValue ?? '---';
      _manualCodeController.text = code;
      _handleScanApi(code);
    }
  }

  Future<void> _handleScanApi(String code) async {
    if (code.trim().isEmpty) return;
    
    setState(() {
      isScanning = false;
      scanResult = 'scanning';
    });

    try {
      final nextApiUrl = dotenv.env['NEXT_API_URL'] ?? 'http://localhost:3000';
      final response = await http.post(
        Uri.parse('$nextApiUrl/api/tickets/scan'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'qrCodeToken': code.trim()}),
      );
      
      final data = jsonDecode(response.body);
      if (mounted) {
        setState(() {
          scanData = data;
          scanResult = data['status'] ?? 'invalid';
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          scanResult = 'invalid';
        });
      }
    }

    Future.delayed(const Duration(seconds: 4), () {
      if (mounted) {
        setState(() {
          scanResult = 'idle';
          isScanning = true;
          _manualCodeController.clear();
        });
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text('Scanner de Billets', style: TextStyle(fontWeight: FontWeight.bold)),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.only(
          left: 16.0,
          right: 16.0,
          top: 16.0,
          bottom: MediaQuery.of(context).padding.bottom + 80,
        ),
        child: Column(
          children: [
            // CAMERA CARD
            Container(
              width: double.infinity,
              decoration: BoxDecoration(
                color: Theme.of(context).cardColor,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: Theme.of(context).dividerColor),
              ),
              padding: const EdgeInsets.all(24),
              child: Column(
                children: [
                  // Viewfinder
                  Container(
                    height: 250,
                    width: 250,
                    decoration: BoxDecoration(
                      color: Colors.black,
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(color: Colors.orangeAccent.withValues(alpha: 0.5), width: 2),
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(22),
                      child: Stack(
                        children: [
                          MobileScanner(
                            controller: cameraController,
                            fit: BoxFit.contain,
                            onDetect: _onDetect,
                          ),
                          // Overlay faint camera icon if idle
                          Center(
                            child: Icon(Icons.camera_alt, size: 48, color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.1)),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),
                  Text('Placez le QR Code dans le cadre', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 24),
                  Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: _manualCodeController,
                          style: const TextStyle(color: Colors.white),
                          decoration: InputDecoration(
                            hintText: 'Numéro du billet (ex: AR-1234)',
                            hintStyle: const TextStyle(color: Colors.white54),
                            filled: true,
                            fillColor: const Color(0xFF222222),
                            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                          ),
                          onSubmitted: _handleScanApi,
                        ),
                      ),
                      const SizedBox(width: 12),
                      ElevatedButton(
                        onPressed: () => _handleScanApi(_manualCodeController.text),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.orangeAccent,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 16),
                        ),
                        child: const Text('Valider', style: TextStyle(fontWeight: FontWeight.bold)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () => _handleScanApi('AR-TEST-VALID'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF222222),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      side: const BorderSide(color: Color(0xFF333333)),
                    ),
                    child: const Text('Test', style: TextStyle(fontSize: 12)),
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 24),

            // RESULT CARD
            Container(
              width: double.infinity,
              constraints: const BoxConstraints(minHeight: 250),
              decoration: BoxDecoration(
                color: Theme.of(context).cardColor,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: Theme.of(context).dividerColor),
              ),
              padding: const EdgeInsets.all(24),
              child: _buildResultContent(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildResultContent() {
    if (scanResult == 'idle') {
      return Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.qr_code_scanner, size: 64, color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.2)),
          const SizedBox(height: 16),
          Text('En attente de scan...', style: TextStyle(color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.5), fontSize: 16, fontWeight: FontWeight.bold)),
        ],
      );
    } else if (scanResult == 'scanning') {
      return Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const CircularProgressIndicator(color: Colors.orangeAccent),
          const SizedBox(height: 16),
          Text('Vérification...', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 16, fontWeight: FontWeight.bold)),
        ],
      );
    } else if (scanResult == 'already_used') {
      return Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.orangeAccent.withValues(alpha: 0.2),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.warning_amber_rounded, color: Colors.orangeAccent, size: 48),
          ),
          const SizedBox(height: 16),
          Text('Billet Déjà Utilisé', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 24, fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          const Text('Embarquement déjà validé', style: TextStyle(color: Colors.orangeAccent, fontWeight: FontWeight.bold)),
          const SizedBox(height: 24),
          
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.orangeAccent.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.orangeAccent.withValues(alpha: 0.3)),
            ),
            child: Column(
              children: [
                Text(
                  scanData?['message'] ?? 'Ce billet a déjà été scanné précédemment.',
                  style: const TextStyle(color: Colors.orangeAccent, fontSize: 14),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 8),
                Text(
                  '${scanData?['passengerName'] ?? 'Passager'} - Siège ${scanData?['seatNumber'] ?? '-'}',
                  style: const TextStyle(color: Colors.orangeAccent, fontSize: 14, fontWeight: FontWeight.bold),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
        ],
      );
    } else if (scanResult == 'valid') {
      return Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.greenAccent.withValues(alpha: 0.2),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.check_circle, color: Colors.greenAccent, size: 48),
          ),
          const SizedBox(height: 16),
          Text('Billet Valide', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 24, fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          const Text('Embarquement autorisé', style: TextStyle(color: Colors.greenAccent, fontWeight: FontWeight.bold)),
          const SizedBox(height: 24),
          
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Theme.of(context).cardColor,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Theme.of(context).dividerColor),
            ),
            child: Column(
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(color: Colors.orangeAccent.withValues(alpha: 0.2), shape: BoxShape.circle),
                      child: const Icon(Icons.person, color: Colors.orangeAccent),
                    ),
                    const SizedBox(width: 12),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(scanData?['passengerName'] ?? 'Passager', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.bold, fontSize: 16)),
                        Text(scanData?['route'] ?? 'Trajet', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 12)),
                      ],
                    )
                  ],
                ),
                Padding(padding: const EdgeInsets.symmetric(vertical: 12), child: Divider(color: Theme.of(context).dividerColor, height: 1)),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    Column(
                      children: [
                        Text('Siège', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 12)),
                        SizedBox(height: 4),
                        Text('${scanData?['seatNumber'] ?? '-'}', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.bold, fontSize: 18)),
                      ],
                    ),
                    Column(
                      children: [
                        Text('Bagage', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 12)),
                        SizedBox(height: 4),
                        Text('Standard', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.bold, fontSize: 14)),
                      ],
                    ),
                  ],
                )
              ],
            ),
          ),
        ],
      );
    } else {
      return Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.redAccent.withValues(alpha: 0.2),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.cancel, color: Colors.redAccent, size: 48),
          ),
          const SizedBox(height: 16),
          Text('Billet Invalide', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 24, fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          const Text('Inconnu ou annulé', style: TextStyle(color: Colors.redAccent, fontWeight: FontWeight.bold)),
          const SizedBox(height: 24),
          
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.redAccent.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.redAccent.withValues(alpha: 0.3)),
            ),
            child: Text(
              scanData?['message'] ?? 'Ce billet est introuvable.',
              style: const TextStyle(color: Colors.redAccent, fontSize: 14),
              textAlign: TextAlign.center,
            ),
          ),
        ],
      );
    }
  }
}
