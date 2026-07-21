import 'package:flutter/material.dart';
import '../../services/api_client.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:intl/intl.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:ui';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class DriverScannerScreen extends StatefulWidget {
  const DriverScannerScreen({super.key});

  @override
  State<DriverScannerScreen> createState() => _DriverScannerScreenState();
}

class _DriverScannerScreenState extends State<DriverScannerScreen> with SingleTickerProviderStateMixin {
  late final MobileScannerController cameraController;
  bool isScanning = true;
  String scanResult = 'idle'; // 'idle', 'valid', 'invalid', 'already_used', 'scanning', 'success'
  Map<String, dynamic>? scanData;
  final TextEditingController _manualCodeController = TextEditingController();

  late AnimationController _animationController;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    cameraController = MobileScannerController(
      facing: CameraFacing.back,
      formats: const [BarcodeFormat.qrCode],
      returnImage: false,
    );
    cameraController.start();

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
      final encodedCode = Uri.encodeComponent(code.trim());
      final response = await ApiClient().get('/v1/bookings/verify-qr/$encodedCode');
      
      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = jsonDecode(response.body);
        if (mounted) {
          setState(() {
            scanData = data;
            // Map API structure to UI expectations
            scanData!['passengerName'] = data['booking']?['user']?['fullName'];
            scanData!['seatNumber'] = data['booking']?['seatNumber'];
            scanData!['amountPaid'] = data['booking']?['price'];
            scanData!['publicReference'] = data['booking']?['publicReference'];
            scanData!['departureTime'] = data['booking']?['trip']?['departureTime'];
            scanData!['route'] = '${data['booking']?['trip']?['route']?['originStation']?['city'] ?? ''} - ${data['booking']?['trip']?['route']?['destinationStation']?['city'] ?? ''}';
            scanData!['passengersCount'] = 1; // single ticket
            
            scanResult = 'valid';
          });
        }
      }
    } on ApiException catch (e) {
      if (mounted) {
        setState(() {
          scanData = {'message': e.message};
          if (e.message.contains('déjà été scanné') || e.message.contains('BOARDED')) {
            scanResult = 'already_used';
          } else if (e.message.contains('invalide')) {
            scanResult = 'invalid';
          } else {
            scanResult = 'invalid';
          }
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
    if (_manualCodeController.text.trim().isEmpty) return;

    setState(() {
      scanResult = 'scanning';
    });

    try {
      final encodedCode = Uri.encodeComponent(_manualCodeController.text.trim());
      final response = await ApiClient().post('/v1/bookings/verify-qr/$encodedCode/board', body: {});
      
      if (response.statusCode == 200 || response.statusCode == 201) {
        if (mounted) {
          setState(() {
            scanResult = 'success';
          });
          
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
      }
    } on ApiException catch (e) {
      if (mounted) {
        setState(() {
          scanData = {'message': e.message};
          scanResult = 'invalid';
        });
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
    } catch (e) {
      if (mounted) {
        setState(() {
          scanResult = 'invalid';
        });
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
      body: Stack(
        children: [
          SingleChildScrollView(
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
                            errorBuilder: (context, error, child) {
                              return Center(
                                child: Padding(
                                  padding: const EdgeInsets.all(16.0),
                                  child: Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      const Icon(Icons.error_outline, color: Colors.red, size: 48),
                                      const SizedBox(height: 16),
                                      Text(
                                        'Erreur: ${error.errorCode.name}',
                                        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                                      ),
                                      const SizedBox(height: 8),
                                      Text(
                                        error.errorDetails?.message ?? 'Détails indisponibles',
                                        style: const TextStyle(color: Colors.white70, fontSize: 12),
                                        textAlign: TextAlign.center,
                                      ),
                                      const SizedBox(height: 16),
                                      ElevatedButton(
                                        onPressed: () => cameraController.start(),
                                        child: const Text('Réessayer'),
                                      )
                                    ],
                                  ),
                                ),
                              );
                            },
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
      if (scanResult == 'valid' || scanResult == 'expired')
        Positioned.fill(
          child: _buildValidModalOverlay(),
        ),
    ],
  ),
);
}

Widget _buildValidModalOverlay() {
  final String ticketId = scanData?['ticketId'] ?? '---';
  final String publicReference = scanData?['publicReference'] ?? '';
  final String ticketShort = ticketId == '---' ? '---' : (publicReference.isNotEmpty ? publicReference : 'VOY-${ticketId.split('-').first.toUpperCase()}');
  
  String dateFormatted = '---';
  if (scanData?['departureTime'] != null) {
    try {
      final DateTime dt = DateTime.parse(scanData!['departureTime']).toLocal();
      dateFormatted = DateFormat('dd/MM/yyyy à HH:mm').format(dt);
    } catch (e) {
      dateFormatted = scanData!['departureTime'];
    }
  }
  
  final String amount = scanData?['amountPaid']?.toString() ?? '0';
  final bool isExpired = scanResult == 'expired';

  final bool isDark = Theme.of(context).brightness == Brightness.dark;
  final Color cardBg = isDark ? const Color(0xFF141414) : Colors.white;
  final Color cardBorder = isDark ? const Color(0xFF2A2A2A) : const Color(0xFFE2E8F0);
  final Color gridBg = isDark ? const Color(0xFF0A0A0A) : const Color(0xFFF8FAFC);
  final Color primaryTextColor = isDark ? Colors.white : const Color(0xFF0F172A);
  final Color secondaryTextColor = isDark ? Colors.white54 : const Color(0xFF64748B);
  final Color dividerColor = isDark ? const Color(0xFF2A2A2A) : const Color(0xFFE2E8F0);
  final Color cancelBtnBg = isDark ? const Color(0xFF1A1A1A) : const Color(0xFFF1F5F9);
  final Color cancelBtnText = isDark ? Colors.white : const Color(0xFF0F172A);
  final Color cancelBtnBorder = isDark ? const Color(0xFF333333) : const Color(0xFFE2E8F0);
  final Color payTextColor = isDark ? Colors.greenAccent : const Color(0xFF10B981);

  return Container(
    color: Colors.black.withValues(alpha: 0.6),
    child: BackdropFilter(
      filter: ImageFilter.blur(sigmaX: 5.0, sigmaY: 5.0),
      child: Center(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Container(
              width: double.infinity,
              decoration: BoxDecoration(
                color: cardBg,
                borderRadius: BorderRadius.circular(32),
                border: Border.all(color: cardBorder),
                boxShadow: [
                  BoxShadow(
                    color: isExpired ? Colors.redAccent.withValues(alpha: 0.15) : Colors.greenAccent.withValues(alpha: 0.15),
                    blurRadius: 50,
                    spreadRadius: 0,
                  ),
                ],
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Header Modale
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 16),
                    decoration: BoxDecoration(
                      color: isExpired ? const Color(0xFFF43F5E) : const Color(0xFF10B981), // Rose 500 or Emerald 500
                      borderRadius: const BorderRadius.only(topLeft: Radius.circular(31), topRight: Radius.circular(31)),
                    ),
                    child: Column(
                      children: [
                        Container(
                          width: 64,
                          height: 64,
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.2),
                            shape: BoxShape.circle,
                            boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 4, offset: Offset(0, 2))],
                          ),
                          child: Icon(isExpired ? Icons.cancel : Icons.check_circle, color: Colors.white, size: 36),
                        ),
                        const SizedBox(height: 12),
                        Text(isExpired ? 'Billet Expiré' : 'Billet Valide', style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold, letterSpacing: -0.5)),
                        const SizedBox(height: 4),
                        Text(isExpired ? 'Trajet déjà passé' : 'Prêt pour l\'embarquement', style: const TextStyle(color: Colors.white70, fontSize: 14, fontWeight: FontWeight.w600)),
                      ],
                    ),
                  ),
                  
                  // Corps Modale
                  Padding(
                    padding: const EdgeInsets.all(24.0),
                    child: Column(
                      children: [
                        // Passager
                        Row(
                          children: [
                            Container(
                              width: 48,
                              height: 48,
                              decoration: BoxDecoration(
                                color: Colors.orangeAccent.withValues(alpha: 0.1),
                                shape: BoxShape.circle,
                                border: Border.all(color: Colors.orangeAccent.withValues(alpha: 0.2)),
                              ),
                              child: const Icon(Icons.person, color: Colors.orangeAccent, size: 24),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text('Passager', style: TextStyle(color: secondaryTextColor, fontSize: 14)),
                                  Text(scanData?['passengerName'] ?? 'Client', style: TextStyle(color: primaryTextColor, fontWeight: FontWeight.bold, fontSize: 20, letterSpacing: -0.5)),
                                ],
                              ),
                            )
                          ],
                        ),
                        const SizedBox(height: 24),
                        Divider(color: dividerColor, height: 1),
                        const SizedBox(height: 24),

                        // Grid N° Billet & Date
                        Row(
                          children: [
                            Expanded(
                              child: Container(
                                padding: const EdgeInsets.all(16),
                                decoration: BoxDecoration(color: gridBg, borderRadius: BorderRadius.circular(20), border: Border.all(color: cardBorder)),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(children: [const Icon(Icons.numbers, size: 16, color: Colors.orangeAccent), const SizedBox(width: 6), Text('N° Billet', style: TextStyle(color: secondaryTextColor, fontSize: 12))]),
                                    const SizedBox(height: 8),
                                    FittedBox(fit: BoxFit.scaleDown, child: Text(ticketShort, style: TextStyle(color: primaryTextColor, fontWeight: FontWeight.w700, fontSize: 16, fontFamily: 'monospace'))),
                                  ],
                                ),
                              ),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Container(
                                padding: const EdgeInsets.all(16),
                                decoration: BoxDecoration(color: gridBg, borderRadius: BorderRadius.circular(20), border: Border.all(color: cardBorder)),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(children: [const Icon(Icons.calendar_month, size: 16, color: Colors.orangeAccent), const SizedBox(width: 6), Text('Date & Heure', style: TextStyle(color: secondaryTextColor, fontSize: 12))]),
                                    const SizedBox(height: 8),
                                    FittedBox(fit: BoxFit.scaleDown, child: Text(dateFormatted, style: TextStyle(color: primaryTextColor, fontWeight: FontWeight.w700, fontSize: 14))),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),

                        // Grid Trajet / Passagers / Payé
                        Container(
                          padding: const EdgeInsets.all(20),
                          decoration: BoxDecoration(color: gridBg, borderRadius: BorderRadius.circular(24), border: Border.all(color: cardBorder)),
                          child: Column(
                            children: [
                              Row(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Icon(Icons.location_on, color: Colors.orangeAccent, size: 24),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text('Trajet', style: TextStyle(color: secondaryTextColor, fontSize: 12)),
                                        const SizedBox(height: 2),
                                        Text(scanData?['route'] ?? '---', style: TextStyle(color: primaryTextColor, fontWeight: FontWeight.w700, fontSize: 16)),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 20),
                              Divider(color: dividerColor, height: 1),
                              const SizedBox(height: 20),
                              Row(
                                children: [
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Row(children: [const Icon(Icons.people, size: 16, color: Colors.orangeAccent), const SizedBox(width: 6), Text('Passagers', style: TextStyle(color: secondaryTextColor, fontSize: 12))]),
                                        const SizedBox(height: 6),
                                        Text('${scanData?['passengersCount'] ?? 1} personne(s)', style: TextStyle(color: primaryTextColor, fontWeight: FontWeight.w700, fontSize: 15)),
                                      ],
                                    ),
                                  ),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Row(children: [const Icon(Icons.payment, size: 16, color: Colors.orangeAccent), const SizedBox(width: 6), Text('Payé', style: TextStyle(color: secondaryTextColor, fontSize: 12))]),
                                        const SizedBox(height: 6),
                                        FittedBox(fit: BoxFit.scaleDown, alignment: Alignment.centerLeft, child: Text('$amount FCFA', style: TextStyle(color: payTextColor, fontWeight: FontWeight.w800, fontSize: 20, letterSpacing: -0.5))),
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
                  
                  // Pied de Modale
                  Padding(
                    padding: const EdgeInsets.only(left: 24, right: 24, bottom: 24),
                    child: Row(
                      children: [
                        Expanded(
                          child: ElevatedButton(
                            onPressed: () {
                              setState(() {
                                scanResult = 'idle';
                                isScanning = true;
                                _manualCodeController.clear();
                              });
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: cancelBtnBg,
                              foregroundColor: cancelBtnText,
                              elevation: 0,
                              padding: const EdgeInsets.symmetric(vertical: 20),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16), side: BorderSide(color: cancelBtnBorder)),
                            ),
                            child: const Text('Annuler', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          flex: 2,
                          child: ElevatedButton(
                            onPressed: _handleBoardingApi,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: isExpired ? const Color(0xFFF43F5E) : Colors.greenAccent,
                              foregroundColor: isExpired ? Colors.white : Colors.black,
                              elevation: 10,
                              shadowColor: (isExpired ? const Color(0xFFF43F5E) : Colors.greenAccent).withValues(alpha: 0.3),
                              padding: const EdgeInsets.symmetric(vertical: 20),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                            ),
                            child: FittedBox(fit: BoxFit.scaleDown, child: Text(isExpired ? 'Réactiver et Embarquer' : 'Valider l\'embarquement', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16))),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
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
            child: const CircularProgressIndicator(color: Colors.greenAccent),
          ),
          const SizedBox(height: 16),
          Text('Lecture du billet...', style: TextStyle(color: Theme.of(context).colorScheme.onSurface, fontSize: 16, fontWeight: FontWeight.bold)),
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
          const Text('Billet invalide ou déjà utilisé', style: TextStyle(color: Colors.redAccent, fontWeight: FontWeight.bold)),
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
