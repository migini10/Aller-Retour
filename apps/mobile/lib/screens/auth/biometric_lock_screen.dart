import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'dart:math' as math;
import 'package:local_auth/local_auth.dart';
import '../home_screen.dart';

class BiometricLockScreen extends StatefulWidget {
  const BiometricLockScreen({super.key});

  @override
  State<BiometricLockScreen> createState() => _BiometricLockScreenState();
}

class _BiometricLockScreenState extends State<BiometricLockScreen> with SingleTickerProviderStateMixin {
  final LocalAuthentication auth = LocalAuthentication();
  bool _isAuthenticating = false;
  String _message = 'Code PIN ou Biométrie';
  String _pin = '';
  bool _error = false;
  late AnimationController _shakeController;

  final String _correctPin = '1234'; // Default PIN for demonstration

  @override
  void initState() {
    super.initState();
    _shakeController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 300),
    );
    // Start authentication automatically after a tiny delay
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _authenticate();
    });
  }

  @override
  void dispose() {
    _shakeController.dispose();
    super.dispose();
  }

  Future<void> _authenticate() async {
    bool authenticated = false;
    try {
      setState(() {
        _isAuthenticating = true;
        _message = 'Vérification biométrique...';
      });

      final bool canAuthenticateWithBiometrics = await auth.canCheckBiometrics;
      final bool canAuthenticate = canAuthenticateWithBiometrics || await auth.isDeviceSupported();

      if (!canAuthenticate) {
        if (mounted) {
          setState(() {
            _message = 'Biométrie non disponible. Utilisez le code PIN.';
            _isAuthenticating = false;
          });
        }
        return;
      }

      authenticated = await auth.authenticate(
        localizedReason: 'Veuillez vous authentifier pour accéder à Allogoo',
      );
    } catch (e) {
      debugPrint("Error authenticating: $e");
      if (mounted) {
        setState(() {
          _message = 'Erreur biométrique. Utilisez le PIN.';
          _isAuthenticating = false;
        });
      }
      return;
    }

    if (!mounted) return;

    if (authenticated) {
      Navigator.pushReplacementNamed(context, '/home');
    } else {
      setState(() {
        _message = 'Biométrie échouée, utilisez le code PIN';
        _isAuthenticating = false;
      });
    }
  }

  void _handleNumberPress(String number) {
    if (_pin.length < 4) {
      setState(() {
        _pin += number;
        _error = false;
        _message = 'Code PIN ou Biométrie';
      });

      if (_pin.length == 4) {
        _verifyPin();
      }
    }
  }

  void _handleBackspace() {
    if (_pin.isNotEmpty) {
      setState(() {
        _pin = _pin.substring(0, _pin.length - 1);
        _error = false;
      });
    }
  }

  void _verifyPin() {
    if (_pin == _correctPin) {
      Future.delayed(const Duration(milliseconds: 300), () {
        if (mounted) Navigator.pushReplacementNamed(context, '/home');
      });
    } else {
      setState(() {
        _error = true;
        _message = 'Code PIN incorrect';
      });
      _shakeController.forward(from: 0.0);
      Future.delayed(const Duration(milliseconds: 500), () {
        if (mounted) {
          setState(() {
            _pin = '';
          });
        }
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? const Color(0xFF0B0F19) : Colors.white,
      body: SafeArea(
        child: LayoutBuilder(
          builder: (context, constraints) {
            return SingleChildScrollView(
              child: ConstrainedBox(
                constraints: BoxConstraints(minHeight: constraints.maxHeight),
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      // Header Section
                      Column(
                        children: [
                          const SizedBox(height: 20),
                          Container(
                            padding: const EdgeInsets.all(20),
                            decoration: BoxDecoration(
                              color: Colors.orange.withValues(alpha: 0.1),
                              shape: BoxShape.circle,
                              border: Border.all(color: Colors.orange.withValues(alpha: 0.3), width: 2),
                            ),
                            child: const Icon(Icons.directions_car, size: 50, color: Colors.orange),
                          ),
                          const SizedBox(height: 16),
                          RichText(
                            text: TextSpan(
                              style: const TextStyle(
                                fontWeight: FontWeight.w900, 
                                fontSize: 28,
                                letterSpacing: -1,
                                fontFamily: 'Roboto',
                              ),
                              children: [
                                TextSpan(text: 'Aller-', style: TextStyle(color: isDark ? Colors.white : Colors.black87)),
                                TextSpan(text: 'Retour', style: TextStyle(color: Colors.deepOrange.shade400)),
                              ],
                            ),
                          ),
                          const SizedBox(height: 8),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(Icons.lock_outline, size: 16, color: isDark ? Colors.white54 : Colors.black54),
                              const SizedBox(width: 8),
                              Text(
                                'Espace Sécurisé',
                                style: TextStyle(
                                  color: isDark ? Colors.white54 : Colors.black54,
                                  fontSize: 14,
                                  fontWeight: FontWeight.w500,
                                  letterSpacing: 1.5,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),

                      // PIN Indicators & Message
                      Column(
                        children: [
                          AnimatedBuilder(
                            animation: _shakeController,
                            builder: (context, child) {
                              final dx = 10 * _shakeController.value * math.sin(_shakeController.value * 4 * math.pi);
                              return Transform.translate(
                                offset: Offset(dx, 0),
                                child: child,
                              );
                            },
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: List.generate(4, (index) {
                                bool isFilled = index < _pin.length;
                                return Container(
                                  margin: const EdgeInsets.symmetric(horizontal: 10),
                                  width: 16,
                                  height: 16,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    color: isFilled 
                                      ? (_error ? Colors.redAccent : Colors.orange)
                                      : (isDark ? Colors.grey[800] : Colors.grey[300]),
                                    boxShadow: isFilled ? [
                                      BoxShadow(
                                        color: (_error ? Colors.redAccent : Colors.orange).withValues(alpha: 0.5),
                                        blurRadius: 10,
                                      )
                                    ] : null,
                                  ),
                                );
                              }),
                            ),
                          ),
                          const SizedBox(height: 24),
                          Text(
                            _message,
                            style: TextStyle(
                              color: _error 
                                ? Colors.redAccent 
                                : (_isAuthenticating ? Colors.blueAccent : (isDark ? Colors.white54 : Colors.black54)),
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),

                      // Numpad & Biometric
                      Column(
                        children: [
                          Container(
                            constraints: const BoxConstraints(maxWidth: 280),
                            child: GridView.count(
                              crossAxisCount: 3,
                              shrinkWrap: true,
                              physics: const NeverScrollableScrollPhysics(),
                              childAspectRatio: 1.2,
                              mainAxisSpacing: 16,
                              crossAxisSpacing: 16,
                              children: [
                                for (var i = 1; i <= 9; i++) _buildNumButton(i.toString(), isDark),
                                // Bottom row: Biometric, 0, Backspace
                                _buildBiometricButton(isDark),
                                _buildNumButton('0', isDark),
                                _buildBackspaceButton(isDark),
                              ],
                            ),
                          ),
                          const SizedBox(height: 16),
                          TextButton(
                            onPressed: () => Navigator.pushReplacementNamed(context, '/home'),
                            child: const Text('Bypass (Dev)', style: TextStyle(color: Colors.grey, fontSize: 12)),
                          )
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            );
          }
        ),
      ),
    );
  }

  Widget _buildNumButton(String number, bool isDark) {
    return InkWell(
      onTap: () => _handleNumberPress(number),
      borderRadius: BorderRadius.circular(40),
      child: Container(
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: isDark ? Colors.grey[900] : Colors.white,
          border: Border.all(color: isDark ? Colors.grey[800]! : Colors.grey[200]!),
        ),
        child: Center(
          child: Text(
            number,
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: isDark ? Colors.white : Colors.black87,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildBiometricButton(bool isDark) {
    return GestureDetector(
      onTap: _isAuthenticating ? null : _authenticate,
      behavior: HitTestBehavior.opaque,
      child: Container(
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: _isAuthenticating 
            ? Colors.blueAccent.withValues(alpha: 0.1)
            : (isDark ? Colors.grey[800] : Colors.grey[100]),
          border: Border.all(color: _isAuthenticating ? Colors.blueAccent : Colors.transparent),
        ),
        child: Center(
          child: Icon(
            Icons.fingerprint,
            size: 32,
            color: _isAuthenticating 
              ? Colors.blueAccent 
              : (isDark ? Colors.orangeAccent : Colors.orange),
          ),
        ),
      ),
    );
  }

  Widget _buildBackspaceButton(bool isDark) {
    return InkWell(
      onTap: _handleBackspace,
      borderRadius: BorderRadius.circular(40),
      child: Container(
        decoration: const BoxDecoration(
          shape: BoxShape.circle,
          color: Colors.transparent,
        ),
        child: Center(
          child: Icon(
            Icons.backspace_outlined,
            size: 28,
            color: isDark ? Colors.white54 : Colors.black54,
          ),
        ),
      ),
    );
  }
}
