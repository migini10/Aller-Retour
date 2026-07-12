import 'dart:convert';
import 'package:flutter/material.dart';
import '../../services/api_client.dart';

class ForgotPasswordScreen extends StatefulWidget {
  const ForgotPasswordScreen({super.key});

  @override
  State<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends State<ForgotPasswordScreen> {
  int _step = 1;
  bool _isLoading = false;
  
  final _phoneController = TextEditingController();
  final _codeController = TextEditingController();
  final _newPasswordController = TextEditingController();
  
  bool _obscurePassword = true;

  Future<void> _requestOtp() async {
    final phone = _phoneController.text.trim();
    if (phone.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Veuillez entrer votre numéro')));
      return;
    }

    setState(() => _isLoading = true);
    try {
      final response = await ApiClient().post('/v1/auth/forgot-password', body: {'phone': phone}, requireAuth: false);
      if (response.statusCode == 200 || response.statusCode == 201) {
        setState(() => _step = 2);
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Code envoyé par SMS', style: TextStyle(color: Colors.white)), backgroundColor: Colors.green));
        }
      } else {
        final data = jsonDecode(response.body);
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(data['message'] ?? 'Erreur lors de l\'envoi du code'), backgroundColor: Colors.red));
        }
      }
    } on ApiException catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.message), backgroundColor: Colors.red));
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Impossible de contacter le serveur'), backgroundColor: Colors.red));
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _resetPassword() async {
    final phone = _phoneController.text.trim();
    final code = _codeController.text.trim();
    final newPin = _newPasswordController.text.trim();

    if (code.length != 6 || newPin.length != 6) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Le code et le PIN doivent faire 6 chiffres')));
      return;
    }

    setState(() => _isLoading = true);
    try {
      final response = await ApiClient().post('/v1/auth/reset-password', body: {
        'phone': phone,
        'code': code,
        'newPin': newPin,
      }, requireAuth: false);
      
      if (response.statusCode == 200 || response.statusCode == 201) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Mot de passe modifié avec succès', style: TextStyle(color: Colors.white)), backgroundColor: Colors.green));
          Navigator.pop(context);
        }
      } else {
        final data = jsonDecode(response.body);
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(data['message'] ?? 'Erreur de réinitialisation'), backgroundColor: Colors.red));
        }
      }
    } on ApiException catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.message), backgroundColor: Colors.red));
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Impossible de contacter le serveur'), backgroundColor: Colors.red));
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
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 20),
              Text(
                'Mot de passe oublié',
                style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: isDark ? Colors.white : Colors.black87),
              ),
              const SizedBox(height: 8),
              Text(
                _step == 1 
                  ? 'Entrez votre numéro de téléphone pour recevoir un code de réinitialisation.'
                  : 'Entrez le code reçu par SMS et votre nouveau mot de passe.',
                style: TextStyle(fontSize: 14, color: isDark ? Colors.white54 : Colors.black54),
              ),
              const SizedBox(height: 40),

              if (_step == 1) ...[
                TextField(
                  controller: _phoneController,
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
                const SizedBox(height: 32),
                ElevatedButton(
                  onPressed: _isLoading ? null : _requestOtp,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.orange.shade600,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                  child: _isLoading 
                    ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                    : const Text('Recevoir le code', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                ),
              ] else ...[
                TextField(
                  controller: _codeController,
                  keyboardType: TextInputType.number,
                  maxLength: 6,
                  style: TextStyle(color: isDark ? Colors.white : Colors.black87),
                  decoration: InputDecoration(
                    labelText: 'Code à 6 chiffres',
                    prefixIcon: const Icon(Icons.sms, color: Colors.orange),
                    filled: true,
                    fillColor: isDark ? Colors.grey[900] : Colors.grey[100],
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _newPasswordController,
                  keyboardType: TextInputType.number,
                  maxLength: 6,
                  obscureText: _obscurePassword,
                  style: TextStyle(color: isDark ? Colors.white : Colors.black87),
                  decoration: InputDecoration(
                    labelText: 'Nouveau PIN (6 chiffres)',
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
                const SizedBox(height: 32),
                ElevatedButton(
                  onPressed: _isLoading ? null : _resetPassword,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.orange.shade600,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                  child: _isLoading 
                    ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                    : const Text('Réinitialiser le mot de passe', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
