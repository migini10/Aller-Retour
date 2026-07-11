import 'package:aller_retour_mobile/core/constants/storage_keys.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter/services.dart';
import 'package:flutter/foundation.dart';
import 'register_screen.dart';
import '../../services/api_client.dart';
import '../../core/utils/jwt_utils.dart';
import '../../main.dart'; // Pour buildFlavor
import '../home_screen.dart'; // Pour réinitialiser isDriverMode

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;
  bool _isLoading = false;
  bool _rememberMe = false;
  String _expectedRole = 'PASSENGER';

  @override
  void initState() {
    super.initState();
    _loadStoredData();
  }

  Future<void> _loadStoredData() async {
    final prefs = await SharedPreferences.getInstance();
    
    // Check for session errors (e.g., from main.dart buildFlavor isolation)
    final sessionError = prefs.getString('session_error');
    if (sessionError != null && sessionError.isNotEmpty) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(sessionError), backgroundColor: Colors.red),
        );
      });
      await prefs.remove('session_error');
    }

    // Load remember me
    setState(() {
      _rememberMe = prefs.getBool(StorageKeys.rememberMe) ?? false;
      if (_rememberMe) {
        _phoneController.text = prefs.getString(StorageKeys.lastLoginIdentifier) ?? '';
      }
    });
  }

  Future<void> _handleLogin() async {
    if (_phoneController.text.isEmpty || _passwordController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Veuillez remplir tous les champs')),
      );
      return;
    }

    setState(() => _isLoading = true);

    try {
      final response = await ApiClient().post(
        '/v1/auth/login-mobile',
        requireAuth: false,
        body: {
          'phone': (() {
            String clean = _phoneController.text.trim().replaceAll(RegExp(r'\s+'), '');
            if (!clean.startsWith('+221') && !clean.startsWith('221') && !clean.startsWith('00221')) {
              return '+221$clean';
            } else if (clean.startsWith('221')) {
              return '+$clean';
            } else if (clean.startsWith('00221')) {
              return clean.replaceFirst('00221', '+221');
            }
            return clean;
          })(),
          'pin': _passwordController.text.trim()
        },
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200 || response.statusCode == 201) {
        final token = data['token'];
        if (token == null) {
          throw ApiException(500, 'Token manquant dans la réponse');
        }

        final role = JwtUtils.decodeRole(token);
        
        String effectiveFlavor = buildFlavor;
        if (buildFlavor == 'UNIFIED') {
          effectiveFlavor = _expectedRole;
        }

        // Isolation par Application
        if (effectiveFlavor == 'PASSENGER' && role != 'PASSENGER') {
          throw ApiException(403, 'Accès refusé : Cette application est réservée aux passagers.');
        }
        if (effectiveFlavor == 'DRIVER' && role != 'DRIVER') {
          throw ApiException(403, 'Accès refusé : Cette application est réservée aux chauffeurs.');
        }

        // Finish autofill successfully
        TextInput.finishAutofillContext();

        final prefs = await SharedPreferences.getInstance();
        await prefs.setBool('isLoggedIn', true);
        await prefs.setString(StorageKeys.authToken, token);

        if (_rememberMe) {
          await prefs.setBool(StorageKeys.rememberMe, true);
          await prefs.setString(StorageKeys.lastLoginIdentifier, _phoneController.text);
        } else {
          await prefs.remove(StorageKeys.rememberMe);
          await prefs.remove(StorageKeys.lastLoginIdentifier);
        }

        if (data['user'] != null) {
          if (data['user']['fullName'] != null) await prefs.setString(StorageKeys.userName, data['user']['fullName']);
          if (data['user']['role'] != null) {
            final userRole = data['user']['role'];
            await prefs.setString(StorageKeys.userRole, userRole);
            
            // SECURITY/BUGFIX P0: Toujours écraser l'ancien isDriverMode par le rôle API RÉEL.
            final bool realIsDriver = (userRole == 'DRIVER');
            await prefs.setBool('isDriverMode', realIsDriver);
            HomeScreen.isDriverMode = realIsDriver;
          }
          if (data['user']['phone'] != null) await prefs.setString(StorageKeys.userPhone, data['user']['phone']);
        }

        if (mounted) {
          Navigator.pushReplacementNamed(context, '/home');
        }
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(data['message'] ?? 'Erreur de connexion')),
          );
        }
      }
    } on ApiException catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(e.message), backgroundColor: Colors.red),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Impossible de contacter le serveur')),
      );
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _showTestAccounts() {
    showModalBottomSheet(
      context: context,
      builder: (context) {
        return SafeArea(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const ListTile(title: Text('Comptes de test', style: TextStyle(fontWeight: FontWeight.bold))),
              ListTile(
                title: const Text('Passager'),
                onTap: () {
                  _phoneController.text = dotenv.env['TEST_PASSENGER_PHONE'] ?? '';
                  Navigator.pop(context);
                },
              ),
              ListTile(
                title: const Text('Chauffeur Owner'),
                onTap: () {
                  _phoneController.text = dotenv.env['TEST_DRIVER_OWNER_PHONE'] ?? '';
                  Navigator.pop(context);
                },
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? const Color(0xFF0B0F19) : Colors.white,
      appBar: (buildFlavor == 'UNIFIED' || kDebugMode) ? AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.bug_report, color: Colors.orange),
            onPressed: _showTestAccounts,
          )
        ],
      ) : null,
      body: SafeArea(
        child: AutofillGroup(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                if (buildFlavor == 'UNIFIED' || kDebugMode) const SizedBox(height: 10) else const SizedBox(height: 60),
                Center(
                  child: Container(
                    width: 120,
                    height: 80,
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.1),
                          blurRadius: 10,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Image.asset(
                      'assets/images/logo_allogoo.png',
                      fit: BoxFit.contain,
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                RichText(
                  textAlign: TextAlign.center,
                  text: TextSpan(
                    style: TextStyle(
                      fontSize: 28, 
                      fontWeight: FontWeight.bold, 
                      color: isDark ? Colors.white : Colors.black87
                    ),
                    children: [
                      const TextSpan(text: 'Bienvenue sur '),
                      TextSpan(
                        text: 'Allogoo', 
                        style: TextStyle(color: Colors.orange.shade600, fontWeight: FontWeight.w900)
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Connectez-vous pour accéder à votre espace sécurisé',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 14, 
                    color: isDark ? Colors.white54 : Colors.black54
                  ),
                ),
                const SizedBox(height: 36),
  
                if (buildFlavor == 'UNIFIED') ...[
                  Row(
                    children: [
                      Expanded(
                        child: GestureDetector(
                          onTap: () => setState(() => _expectedRole = 'PASSENGER'),
                          child: Container(
                            padding: const EdgeInsets.symmetric(vertical: 12),
                            decoration: BoxDecoration(
                              color: _expectedRole == 'PASSENGER' ? Colors.orange : (isDark ? Colors.grey[800] : Colors.grey[200]),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            alignment: Alignment.center,
                            child: Text(
                              'Connexion Passager',
                              style: TextStyle(
                                color: _expectedRole == 'PASSENGER' ? Colors.white : (isDark ? Colors.white70 : Colors.black87),
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: GestureDetector(
                          onTap: () => setState(() => _expectedRole = 'DRIVER'),
                          child: Container(
                            padding: const EdgeInsets.symmetric(vertical: 12),
                            decoration: BoxDecoration(
                              color: _expectedRole == 'DRIVER' ? Colors.orange : (isDark ? Colors.grey[800] : Colors.grey[200]),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            alignment: Alignment.center,
                            child: Text(
                              'Connexion Chauffeur',
                              style: TextStyle(
                                color: _expectedRole == 'DRIVER' ? Colors.white : (isDark ? Colors.white70 : Colors.black87),
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                ],

                // Phone Field
                TextField(
                  controller: _phoneController,
                  autofillHints: const [AutofillHints.telephoneNumber],
                  keyboardType: TextInputType.phone,
                  style: TextStyle(color: isDark ? Colors.white : Colors.black87),
                  decoration: InputDecoration(
                    labelText: 'Numéro de téléphone',
                    hintText: '+221 77 000 00 00',
                    hintStyle: TextStyle(color: isDark ? Colors.white24 : Colors.grey[400]),
                    prefixIcon: const Icon(Icons.phone_android, color: Colors.orange),
                    filled: true,
                    fillColor: isDark ? Colors.grey[900] : Colors.grey[100],
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
                  ),
                ),
                const SizedBox(height: 16),
  
                // Password Field
                TextField(
                  controller: _passwordController,
                  autofillHints: const [AutofillHints.password],
                  obscureText: _obscurePassword,
                  style: TextStyle(color: isDark ? Colors.white : Colors.black87),
                  decoration: InputDecoration(
                    labelText: 'Mot de passe',
                    prefixIcon: const Icon(Icons.lock_outline, color: Colors.orange),
                    suffixIcon: IconButton(
                      icon: Icon(_obscurePassword ? Icons.visibility_off : Icons.visibility, color: Colors.grey),
                      onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                    ),
                    filled: true,
                    fillColor: isDark ? Colors.grey[900] : Colors.grey[100],
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
                  ),
                ),
                
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Checkbox(
                          value: _rememberMe,
                          onChanged: (val) {
                            setState(() => _rememberMe = val ?? false);
                          },
                          activeColor: Colors.orange,
                        ),
                        Text('Mémoriser identifiant', style: TextStyle(color: isDark ? Colors.white70 : Colors.black87, fontSize: 13)),
                      ],
                    ),
                    TextButton(
                      onPressed: () {}, // TODO: Forgot password
                      child: const Text('Mot de passe oublié ?', style: TextStyle(color: Colors.orange, fontSize: 13)),
                    ),
                  ],
                ),
                const SizedBox(height: 24),
  
                // Login Button
                ElevatedButton(
                  onPressed: _isLoading ? null : _handleLogin,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.orange.shade600,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    elevation: 0,
                  ),
                  child: _isLoading 
                    ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                    : const Text('Se connecter', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                ),
  
                const SizedBox(height: 24),
                Wrap(
                  alignment: WrapAlignment.center,
                  crossAxisAlignment: WrapCrossAlignment.center,
                  children: [
                    Text('Nouveau sur Allogoo ?', style: TextStyle(color: isDark ? Colors.white70 : Colors.black54)),
                    TextButton(
                      onPressed: () => Navigator.pushReplacementNamed(context, '/register'),
                      child: const Text('Créer un compte', style: TextStyle(color: Colors.orange, fontWeight: FontWeight.bold)),
                    ),
                  ],
                )
              ],
            ),
          ),
        ),
      ),
    );
  }
}
