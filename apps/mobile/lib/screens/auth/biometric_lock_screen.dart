import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:local_auth/local_auth.dart';
import '../home_screen.dart';

class BiometricLockScreen extends StatefulWidget {
  const BiometricLockScreen({super.key});

  @override
  State<BiometricLockScreen> createState() => _BiometricLockScreenState();
}

class _BiometricLockScreenState extends State<BiometricLockScreen> {
  final LocalAuthentication auth = LocalAuthentication();
  bool _isAuthenticating = false;
  String _message = 'Appuyez pour déverrouiller';

  @override
  void initState() {
    super.initState();
    // Start authentication automatically after a tiny delay
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _authenticate();
    });
  }

  Future<void> _authenticate() async {
    bool authenticated = false;
    try {
      setState(() {
        _isAuthenticating = true;
        _message = 'Vérification...';
      });

      authenticated = await auth.authenticate(
        localizedReason: 'Veuillez vous authentifier pour accéder à Aller-Retour',
        options: const AuthenticationOptions(
          stickyAuth: true,
          biometricOnly: true,
        ),
      );
    } on PlatformException catch (e) {
      debugPrint("Error authenticating: \$e");
      setState(() {
        _message = 'Erreur biométrique ou non configurée';
        _isAuthenticating = false;
      });
      // Fallback: If no biometrics exist, we might let them pass or require PIN.
      // For this prototype, if it fails because it's not enrolled, we just let them pass
      // or we can show a button to bypass. Let's show a bypass for development.
      return;
    }

    if (!mounted) return;

    if (authenticated) {
      Navigator.pushReplacementNamed(context, '/home');
    } else {
      setState(() {
        _message = 'Authentification échouée, réessayez';
        _isAuthenticating = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? const Color(0xFF0B0F19) : Colors.white,
      body: SafeArea(
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Logo Hero
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: Colors.orange.withValues(alpha: 0.1),
                  shape: BoxShape.circle,
                  border: Border.all(color: Colors.orange.withValues(alpha: 0.3), width: 2),
                ),
                child: const Icon(Icons.directions_car, size: 80, color: Colors.orange),
              ),
              const SizedBox(height: 32),
              
              // App Name
              RichText(
                text: TextSpan(
                  style: const TextStyle(
                    fontWeight: FontWeight.w900, 
                    fontSize: 36,
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
              Text(
                'Espace Sécurisé',
                style: TextStyle(
                  color: isDark ? Colors.white54 : Colors.black54,
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                  letterSpacing: 2,
                ),
              ),
              
              const SizedBox(height: 80),

              // Biometric Icon / Button
              GestureDetector(
                onTap: _isAuthenticating ? null : _authenticate,
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 300),
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: _isAuthenticating 
                        ? Colors.blueAccent.withValues(alpha: 0.1)
                        : (isDark ? Colors.grey[900] : Colors.grey[100]),
                    shape: BoxShape.circle,
                    boxShadow: [
                      if (!_isAuthenticating)
                        BoxShadow(
                          color: isDark ? Colors.black54 : Colors.grey[300]!,
                          blurRadius: 15,
                          offset: const Offset(0, 5),
                        )
                    ],
                    border: Border.all(
                      color: _isAuthenticating ? Colors.blueAccent : Colors.transparent,
                      width: 2,
                    ),
                  ),
                  child: Icon(
                    Icons.fingerprint,
                    size: 64,
                    color: _isAuthenticating 
                        ? Colors.blueAccent 
                        : (isDark ? Colors.white70 : Colors.black87),
                  ),
                ),
              ),
              const SizedBox(height: 24),

              Text(
                _message,
                style: TextStyle(
                  color: _isAuthenticating ? Colors.blueAccent : (isDark ? Colors.white54 : Colors.black54),
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),

              // DEV BYPASS BUTTON (useful for emulators without biometrics setup)
              const SizedBox(height: 60),
              TextButton(
                onPressed: () {
                  Navigator.pushReplacementNamed(context, '/home');
                },
                child: const Text(
                  'Bypass (Mode Dev)',
                  style: TextStyle(color: Colors.grey, decoration: TextDecoration.underline),
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}
