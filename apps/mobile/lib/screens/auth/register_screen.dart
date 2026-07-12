import 'package:aller_retour_mobile/core/constants/storage_keys.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import '../../services/api_client.dart';
import 'login_screen.dart';
import '../../core/utils/jwt_utils.dart';
import '../../main.dart'; // Pour appFlavor
import '../home_screen.dart'; // Pour synchroniser isDriverMode

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;
  bool _isLoading = false;
  String _accountType = buildFlavor == 'DRIVER' ? 'DRIVER' : 'PASSENGER';

  Future<void> _handleRegister() async {
    if (_nameController.text.isEmpty || _phoneController.text.isEmpty || _passwordController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Veuillez remplir tous les champs')),
      );
      return;
    }

    if (_passwordController.text.length != 6) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Le code PIN doit comporter exactement 6 chiffres.')),
      );
      return;
    }

    setState(() => _isLoading = true);

    try {
      final response = await ApiClient().post(
        '/v1/auth/register',
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
          'fullName': _nameController.text.trim(),
          'pin': _passwordController.text.trim(),
          'accountType': _accountType,
        },
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200 || response.statusCode == 201) {
        final token = data['token'];
        if (token == null) {
          throw ApiException(500, 'Token manquant dans la réponse');
        }

        final role = JwtUtils.decodeRole(token);
        
        // Isolation post-inscription
        if (buildFlavor == 'PASSENGER' && role != 'PASSENGER') {
          throw ApiException(403, 'Inscription réussie, mais accès refusé sur cette application (Réservé Passagers).');
        }
        if (buildFlavor == 'DRIVER' && role != 'DRIVER') {
          throw ApiException(403, 'Inscription réussie, mais accès refusé sur cette application (Réservé Chauffeurs).');
        }

        final prefs = await SharedPreferences.getInstance();
        await prefs.setBool('isLoggedIn', true);
        await prefs.setString(StorageKeys.authToken, token);
        await prefs.setString(StorageKeys.userName, _nameController.text);
        await prefs.setString(StorageKeys.userPhone, _phoneController.text);
        if (data['user'] != null && data['user']['role'] != null) {
          final userRole = data['user']['role'];
          await prefs.setString(StorageKeys.userRole, userRole);
          
          // SECURITY/BUGFIX P0: Synchroniser l'environnement immédiatement après l'inscription
          final bool realIsDriver = (userRole == 'DRIVER');
          await prefs.setBool('isDriverMode', realIsDriver);
          HomeScreen.isDriverMode = realIsDriver;
        }

        if (mounted) {
          Navigator.pushReplacementNamed(context, '/home');
        }
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(data['message'] ?? 'Erreur d\'inscription')),
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

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? const Color(0xFF0B0F19) : Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: isDark ? Colors.white : Colors.black87),
          onPressed: () => Navigator.pushReplacementNamed(context, '/login'),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 10),
              Text(
                'Créer un compte',
                style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: isDark ? Colors.white : Colors.black87),
              ),
              const SizedBox(height: 8),
              Text(
                'Rejoignez Allogoo pour vos trajets',
                style: TextStyle(fontSize: 16, color: isDark ? Colors.white54 : Colors.black54),
              ),
              const SizedBox(height: 40),

              if (buildFlavor == 'UNIFIED') ...[
                Row(
                  children: [
                    Expanded(
                      child: GestureDetector(
                        onTap: () => setState(() => _accountType = 'PASSENGER'),
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          decoration: BoxDecoration(
                            color: _accountType == 'PASSENGER' ? Colors.orange : (isDark ? Colors.grey[800] : Colors.grey[200]),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          alignment: Alignment.center,
                          child: Text(
                            'Je suis passager',
                            style: TextStyle(
                              color: _accountType == 'PASSENGER' ? Colors.white : (isDark ? Colors.white70 : Colors.black87),
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: GestureDetector(
                        onTap: () => setState(() => _accountType = 'DRIVER'),
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          decoration: BoxDecoration(
                            color: _accountType == 'DRIVER' ? Colors.orange : (isDark ? Colors.grey[800] : Colors.grey[200]),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          alignment: Alignment.center,
                          child: Text(
                            'Je suis chauffeur',
                            style: TextStyle(
                              color: _accountType == 'DRIVER' ? Colors.white : (isDark ? Colors.white70 : Colors.black87),
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

              // Name Field
              TextField(
                controller: _nameController,
                style: TextStyle(color: isDark ? Colors.white : Colors.black87),
                decoration: InputDecoration(
                  labelText: 'Nom complet',
                  prefixIcon: const Icon(Icons.person_outline, color: Colors.orange),
                  filled: true,
                  fillColor: isDark ? Colors.grey[900] : Colors.grey[100],
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
                ),
              ),
              const SizedBox(height: 16),

              // Phone Field
              TextField(
                controller: _phoneController,
                keyboardType: TextInputType.phone,
                style: TextStyle(color: isDark ? Colors.white : Colors.black87),
                decoration: InputDecoration(
                  labelText: 'Numéro de téléphone',
                  hintText: '+221 77 000 00 00',
                  hintStyle: TextStyle(color: isDark ? Colors.white54 : Colors.grey),
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
              
              const SizedBox(height: 40),

              // Register Button
              ElevatedButton(
                onPressed: _isLoading ? null : _handleRegister,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.orange.shade600,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  elevation: 0,
                ),
                child: _isLoading 
                  ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                  : const Text('S\'inscrire', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              ),

              const SizedBox(height: 24),
              Wrap(
                alignment: WrapAlignment.center,
                crossAxisAlignment: WrapCrossAlignment.center,
                children: [
                  Text('Vous avez déjà un compte ?', style: TextStyle(color: isDark ? Colors.white70 : Colors.black54)),
                  TextButton(
                    onPressed: () => Navigator.pushReplacementNamed(context, '/login'),
                    child: const Text('Se connecter', style: TextStyle(color: Colors.orange, fontWeight: FontWeight.bold)),
                  ),
                ],
              )
            ],
          ),
        ),
      ),
    );
  }
}
