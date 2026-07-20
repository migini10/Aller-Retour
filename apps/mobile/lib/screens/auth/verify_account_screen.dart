import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import '../../services/api_client.dart';
import '../../core/constants/storage_keys.dart';

class VerifyAccountScreen extends StatefulWidget {
  final String phone;
  const VerifyAccountScreen({super.key, required this.phone});

  @override
  State<VerifyAccountScreen> createState() => _VerifyAccountScreenState();
}

class _VerifyAccountScreenState extends State<VerifyAccountScreen> {
  final _otpController = TextEditingController();
  bool _isLoading = false;
  String _channel = 'EMAIL';

  @override
  void initState() {
    super.initState();
    // Peut-être envoyer l'OTP automatiquement au démarrage si le canal par défaut est sélectionné ?
    // Pour l'instant, on laisse l'utilisateur choisir et cliquer sur "Envoyer le code"
  }

  Future<void> _requestOtp() async {
    setState(() => _isLoading = true);
    try {
      final response = await ApiClient().post(
        '/v1/auth/request-verification',
        requireAuth: true, // Nécessite d'être connecté (JWT)
        body: {'channel': _channel},
      );
      
      final data = jsonDecode(response.body);
      if (response.statusCode == 200 || response.statusCode == 201) {
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(data['message'] ?? 'Code envoyé.')),
        );
      } else {
        throw ApiException(response.statusCode, data['message'] ?? 'Erreur inconnue');
      }
    } on ApiException catch (e) {
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erreur : ${e.message}')),
      );
    } catch (e) {
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erreur inattendue : $e')),
      );
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _verifyOtp() async {
    if (_otpController.text.length != 6) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Le code OTP doit comporter 6 caractères.')),
      );
      return;
    }

    setState(() => _isLoading = true);
    try {
      final response = await ApiClient().post(
        '/v1/auth/verify-otp',
        requireAuth: true,
        body: {'otp': _otpController.text},
      );
      
      final data = jsonDecode(response.body);
      if (response.statusCode == 200 || response.statusCode == 201) {
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Compte vérifié avec succès !')),
        );
        if (!mounted) return;
        Navigator.pushReplacementNamed(context, '/home');
      } else {
        throw ApiException(response.statusCode, data['message'] ?? 'Erreur de vérification');
      }
    } on ApiException catch (e) {
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erreur : ${e.message}')),
      );
    } catch (e) {
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erreur inattendue : $e')),
      );
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Vérification du compte'),
        centerTitle: true,
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text(
                'Veuillez vérifier votre compte',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              const Text(
                'Sélectionnez un canal pour recevoir votre code OTP et lien de vérification.',
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 32),
              SegmentedButton<String>(
                segments: const [
                  ButtonSegment(value: 'EMAIL', label: Text('E-mail')),
                  ButtonSegment(value: 'WHATSAPP', label: Text('WhatsApp')),
                ],
                selected: {_channel},
                onSelectionChanged: (Set<String> newSelection) {
                  setState(() {
                    _channel = newSelection.first;
                  });
                },
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: _isLoading ? null : _requestOtp,
                child: _isLoading 
                  ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2))
                  : const Text('Recevoir le code'),
              ),
              const SizedBox(height: 32),
              const Divider(),
              const SizedBox(height: 32),
              TextField(
                controller: _otpController,
                decoration: const InputDecoration(
                  labelText: 'Code OTP (6 chiffres)',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.security),
                ),
                keyboardType: TextInputType.number,
                maxLength: 6,
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: _isLoading ? null : _verifyOtp,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blueAccent,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
                child: _isLoading 
                  ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                  : const Text('Vérifier mon compte', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
