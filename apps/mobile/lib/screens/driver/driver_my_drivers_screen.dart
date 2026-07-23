import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../core/constants/storage_keys.dart';
import '../../services/api_client.dart';

class DriverMyDriversScreen extends StatefulWidget {
  const DriverMyDriversScreen({super.key});

  @override
  State<DriverMyDriversScreen> createState() => _DriverMyDriversScreenState();
}

class _DriverMyDriversScreenState extends State<DriverMyDriversScreen> {
  bool _isLoading = true;
  String? _error;
  List<dynamic> _drivers = [];
  bool _isOwner = false;

  @override
  void initState() {
    super.initState();
    _checkAccessAndFetch();
  }

  Future<void> _checkAccessAndFetch() async {
    final prefs = await SharedPreferences.getInstance();
    final driverType = prefs.getString(StorageKeys.driverType);
    final role = prefs.getString(StorageKeys.userRole);

    if (role != 'DRIVER' || driverType != 'OWNER') {
      setState(() {
        _error = "403 - Accès refusé. Vous n'avez pas l'autorisation d'accéder à cette page.";
        _isLoading = false;
        _isOwner = false;
      });
      return;
    }

    setState(() {
      _isOwner = true;
    });

    _fetchDrivers();
  }

  Future<void> _fetchDrivers() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final response = await ApiClient().get('/v1/drivers/me/assigned-drivers');
      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        setState(() {
          _drivers = data;
          _isLoading = false;
        });
      } else {
        setState(() {
          _error = 'Erreur serveur lors du chargement des chauffeurs.';
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        _error = 'Erreur réseau : Impossible de contacter le serveur.';
        _isLoading = false;
      });
    }
  }

  void _showAddDriverModal() {
    final formKey = GlobalKey<FormState>();
    final firstNameController = TextEditingController();
    final lastNameController = TextEditingController();
    final phoneController = TextEditingController();
    bool isSubmitting = false;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setStateModal) {
          return Padding(
            padding: EdgeInsets.only(bottom: MediaQuery.of(ctx).viewInsets.bottom),
            child: Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Theme.of(context).scaffoldBackgroundColor,
                borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
              ),
              child: Form(
                key: formKey,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Ajouter un chauffeur assigné', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Theme.of(context).colorScheme.onSurface)),
                    const SizedBox(height: 16),
                    TextFormField(
                      controller: firstNameController,
                      decoration: InputDecoration(
                        labelText: 'Prénom',
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      validator: (val) => val == null || val.isEmpty ? 'Champ requis' : null,
                    ),
                    const SizedBox(height: 12),
                    TextFormField(
                      controller: lastNameController,
                      decoration: InputDecoration(
                        labelText: 'Nom',
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      validator: (val) => val == null || val.isEmpty ? 'Champ requis' : null,
                    ),
                    const SizedBox(height: 12),
                    TextFormField(
                      controller: phoneController,
                      keyboardType: TextInputType.phone,
                      decoration: InputDecoration(
                        labelText: 'Téléphone',
                        hintText: '+22177...',
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      validator: (val) => val == null || val.isEmpty ? 'Champ requis' : null,
                    ),
                    const SizedBox(height: 24),
                    SizedBox(
                      width: double.infinity,
                      height: 50,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.deepPurple,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        onPressed: isSubmitting ? null : () async {
                          if (formKey.currentState!.validate()) {
                            setStateModal(() => isSubmitting = true);
                            try {
                              String cleanPhone = phoneController.text.trim().replaceAll(RegExp(r'\s+'), '');
                              if (!cleanPhone.startsWith('+221') && !cleanPhone.startsWith('221') && !cleanPhone.startsWith('00221')) {
                                cleanPhone = '+221$cleanPhone';
                              } else if (cleanPhone.startsWith('221')) {
                                cleanPhone = '+$cleanPhone';
                              } else if (cleanPhone.startsWith('00221')) {
                                cleanPhone = cleanPhone.replaceFirst('00221', '+221');
                              }
                              
                              // Generate a random 6-digit password
                              final tempPassword = (100000 + (DateTime.now().millisecondsSinceEpoch % 900000)).toString();

                              final reqBody = {
                                'fullName': '${firstNameController.text.trim()} ${lastNameController.text.trim()}',
                                'phone': cleanPhone,
                                'temporaryPassword': tempPassword,
                              };
                              final res = await ApiClient().post('/v1/drivers/me/assigned', body: reqBody);
                              
                              if (!mounted) return;
                              
                              if (res.statusCode == 201 || res.statusCode == 200) {
                                final data = jsonDecode(res.body);
                                Navigator.pop(ctx);
                                _showSuccessDialog(data['driver'], data['temporaryPassword']);
                                _fetchDrivers();
                              } else {
                                final data = jsonDecode(res.body);
                                String errorMsg = 'Erreur lors de la création';
                                if (data['message'] != null) {
                                  if (data['message'] is List) {
                                    errorMsg = (data['message'] as List).join(', ');
                                  } else {
                                    errorMsg = data['message'].toString();
                                  }
                                }
                                ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(errorMsg), backgroundColor: Colors.red));
                                setStateModal(() => isSubmitting = false);
                              }
                            } catch (e) {
                              if (!mounted) return;
                              ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Erreur réseau'), backgroundColor: Colors.red));
                              setStateModal(() => isSubmitting = false);
                            }
                          }
                        },
                        child: isSubmitting 
                          ? const CircularProgressIndicator(color: Colors.white)
                          : const Text('Créer le chauffeur', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        }
      ),
    );
  }

  void _showSuccessDialog(dynamic driver, String temporaryPassword) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Text('Chauffeur créé avec succès'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.check_circle, color: Colors.green, size: 64),
            const SizedBox(height: 16),
            const Text('Veuillez communiquer ce mot de passe temporaire au chauffeur. Il ne sera affiché qu\'une seule fois.', textAlign: TextAlign.center),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.orange.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.orange.withValues(alpha: 0.3)),
              ),
              child: SelectableText(
                temporaryPassword,
                style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, letterSpacing: 2, color: Colors.orange),
                textAlign: TextAlign.center,
              ),
            ),
            const SizedBox(height: 16),
            const Text(
              'Le chauffeur devra changer son mot de passe à la première connexion.',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 12, color: Colors.grey, fontStyle: FontStyle.italic),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('J\'ai copié le mot de passe'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (!_isOwner && _error != null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Mes chauffeurs')),
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.block, color: Colors.red, size: 64),
                const SizedBox(height: 16),
                Text(_error!, textAlign: TextAlign.center, style: const TextStyle(fontSize: 16, color: Colors.red)),
              ],
            ),
          ),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Mes chauffeurs', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          IconButton(icon: const Icon(Icons.refresh), onPressed: _fetchDrivers),
        ],
      ),
      body: _isLoading 
        ? const Center(child: CircularProgressIndicator())
        : _error != null
          ? Center(child: Text(_error!, style: const TextStyle(color: Colors.red)))
          : _drivers.isEmpty
            ? Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.group_off, size: 64, color: Colors.grey.withValues(alpha: 0.5)),
                    const SizedBox(height: 16),
                    const Text('Aucun chauffeur assigné.', style: TextStyle(color: Colors.grey, fontSize: 16)),
                  ],
                ),
              )
            : RefreshIndicator(
                onRefresh: _fetchDrivers,
                child: ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: _drivers.length,
                  itemBuilder: (ctx, i) {
                    final d = _drivers[i];
                    final name = '${d['firstName'] ?? ''} ${d['lastName'] ?? ''}'.trim();
                    final phone = d['phone'] ?? 'Pas de téléphone';
                    final status = d['status'] == 'ACTIVE' ? 'ACTIF' : 'INACTIF';
                    
                    return Card(
                      margin: const EdgeInsets.only(bottom: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      child: ListTile(
                        contentPadding: const EdgeInsets.all(16),
                        leading: CircleAvatar(
                          backgroundColor: Colors.deepPurple.withValues(alpha: 0.2),
                          child: const Icon(Icons.person, color: Colors.deepPurple),
                        ),
                        title: Text(name, style: const TextStyle(fontWeight: FontWeight.bold)),
                        subtitle: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const SizedBox(height: 4),
                            Text(phone),
                            const SizedBox(height: 4),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                              decoration: BoxDecoration(
                                color: status == 'ACTIF' ? Colors.green.withValues(alpha: 0.1) : Colors.red.withValues(alpha: 0.1),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(status, style: TextStyle(fontSize: 10, color: status == 'ACTIF' ? Colors.green : Colors.red, fontWeight: FontWeight.bold)),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _showAddDriverModal,
        icon: const Icon(Icons.add),
        label: const Text('Nouveau Chauffeur'),
        backgroundColor: Colors.deepPurple,
        foregroundColor: Colors.white,
      ),
    );
  }
}
