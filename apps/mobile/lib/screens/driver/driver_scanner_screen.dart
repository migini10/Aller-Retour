import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:intl/intl.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class DriverScannerScreen extends StatefulWidget {
  const DriverScannerScreen({super.key});

  @override
  State<DriverScannerScreen> createState() => _DriverScannerScreenState();
}

class _DriverScannerScreenState extends State<DriverScannerScreen> with SingleTickerProviderStateMixin {
  MobileScannerController cameraController = MobileScannerController(
    facing: CameraFacing.back,
  );
  bool isScanning = true;
  String scanResult = 'idle'; // 'idle', 'valid', 'invalid', 'already_used', 'scanning', 'success'
  Map<String, dynamic>? scanData;
  final TextEditingController _manualCodeController = TextEditingController();

  late AnimationController _animationController;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    )..repeat(reverse: true);
    _animation = Tween<double>(begin: 0.0, end: 240.0).animate(_animationController);
  }

  @override
  void dispose() {
    _animationController.dispose();
    _manualCodeController.dispose();
    cameraController.dispose();
    super.dispose();
  }

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
        body: jsonEncode({'qrCodeToken': code.trim(), 'action': 'info'}),
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

    if (scanResult != 'valid') {
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
  }

  Future<void> _handleBoardingApi() async {
    setState(() {
      scanResult = 'scanning';
    });

    try {
      final nextApiUrl = dotenv.env['NEXT_API_URL'] ?? 'http://localhost:3000';
      final response = await http.post(
        Uri.parse('$nextApiUrl/api/tickets/scan'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'qrCodeToken': _manualCodeController.text.trim(), 'action': 'board'}),
      );
      
      final data = jsonDecode(response.body);
      if (mounted) {
        setState(() {
          scanData = data;
          scanResult = data['status'] ?? 'invalid'; // will be 'success'
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          scanResult = 'invalid';
        });
      }
    }

    Future.delayed(const Duration(seconds: 3), () {
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
                            fit: BoxFit.cover,
                            onDetect: _onDetect,
                          ),
                          AnimatedBuilder(
                            animation: _animation,
                            builder: (context, child) {
                              return Positioned(
                                top: _animation.value,
                                left: 0,
                                right: 0,
                                child: Container(
                                  height: 2,
                                  decoration: BoxDecoration(
                                    color: Colors.orangeAccent,
                                    boxShadow: [
                                      BoxShadow(
                                        color: Colors.orangeAccent.withValues(alpha: 0.8),
                                        blurRadius: 10,
                                        spreadRadius: 2,
                                      ),
                                    ],
                                  ),
                                ),
                              );
                            },
                          ),
                          // Overlay faint camera icon if idle
                          Center(
                            child: Icon(Icons.qr_code_scanner, size: 48, color: Colors.white.withValues(alpha: 0.2)),
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
      final String token = scanData?['qrCodeToken'] ?? '---';
      final String tokenShort = token.length > 8 ? token.substring(0, 8).toUpperCase() : token.toUpperCase();
      
      String dateFormatted = '---';
      if (scanData?['departureTime'] != null) {
        try {
          final DateTime dt = DateTime.parse(scanData!['departureTime']).toLocal();
          dateFormatted = DateFormat('dd MMM, HH:mm', 'fr_FR').format(dt);
        } catch (e) {
          dateFormatted = scanData!['departureTime'];
        }
      }
      
      final String amount = scanData?['amountPaid']?.toString() ?? '0';

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
          const Text('Prêt pour l\'embarquement', style: TextStyle(color: Colors.greenAccent, fontWeight: FontWeight.bold)),
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
                        Text('Passager', style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant, fontSize: 12)),
                        Text(scanData?['passengerName'] ?? 'Client', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.bold, fontSize: 16)),
                      ],
                    )
                  ],
                ),
                Padding(padding: const EdgeInsets.symmetric(vertical: 12), child: Divider(color: Theme.of(context).dividerColor, height: 1)),
                Row(
                  children: [
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(color: const Color(0xFF111111), borderRadius: BorderRadius.circular(12), border: Border.all(color: const Color(0xFF222222))),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Row(children: [Icon(Icons.numbers, size: 14, color: Colors.orangeAccent), SizedBox(width: 4), Text('N° Billet', style: TextStyle(color: Colors.white54, fontSize: 12))]),
                            const SizedBox(height: 4),
                            Text(tokenShort, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(color: const Color(0xFF111111), borderRadius: BorderRadius.circular(12), border: Border.all(color: const Color(0xFF222222))),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Row(children: [Icon(Icons.calendar_month, size: 14, color: Colors.orangeAccent), SizedBox(width: 4), Text('Date & Heure', style: TextStyle(color: Colors.white54, fontSize: 12))]),
                            const SizedBox(height: 4),
                            Text(dateFormatted, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(color: const Color(0xFF111111), borderRadius: BorderRadius.circular(12), border: Border.all(color: const Color(0xFF222222))),
                  child: Column(
                    children: [
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Icon(Icons.location_on, color: Colors.orangeAccent, size: 20),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text('Trajet', style: TextStyle(color: Colors.white54, fontSize: 12)),
                                Text(scanData?['route'] ?? '---', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                              ],
                            ),
                          ),
                        ],
                      ),
                      Padding(padding: const EdgeInsets.symmetric(vertical: 12), child: Divider(color: Theme.of(context).dividerColor, height: 1)),
                      Row(
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Row(children: [Icon(Icons.people, size: 14, color: Colors.orangeAccent), SizedBox(width: 4), Text('Passagers', style: TextStyle(color: Colors.white54, fontSize: 12))]),
                                const SizedBox(height: 4),
                                Text('${scanData?['passengersCount'] ?? 1} personne(s)', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                              ],
                            ),
                          ),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Row(children: [Icon(Icons.payment, size: 14, color: Colors.orangeAccent), SizedBox(width: 4), Text('Payé', style: TextStyle(color: Colors.white54, fontSize: 12))]),
                                const SizedBox(height: 4),
                                Text('$amount FCFA', style: const TextStyle(color: Colors.greenAccent, fontWeight: FontWeight.bold, fontSize: 16)),
                              ],
                            ),
                          ),
                        ],
                      )
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: () {
                    setState(() {
                      scanResult = 'idle';
                      isScanning = true;
                      _manualCodeController.clear();
                    });
                  },
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    side: BorderSide(color: Theme.of(context).dividerColor),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                  child: Text('Annuler', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontWeight: FontWeight.bold)),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                flex: 2,
                child: ElevatedButton(
                  onPressed: _handleBoardingApi,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.greenAccent,
                    foregroundColor: Colors.black,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                  child: const Text('Valider l\'embarquement', style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        ],
      );
    } else if (scanResult == 'success') {
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
          Text('Embarquement Réussi', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 24, fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          Text(scanData?['message'] ?? 'Le passager est à bord.', style: const TextStyle(color: Colors.greenAccent, fontWeight: FontWeight.bold)),
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
