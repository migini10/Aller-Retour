import 'package:flutter/material.dart';
import '../../services/api_client.dart';
import 'dart:convert';

class DriverVehiculeScreen extends StatefulWidget {
  const DriverVehiculeScreen({super.key});

  @override
  State<DriverVehiculeScreen> createState() => _DriverVehiculeScreenState();
}

class _DriverVehiculeScreenState extends State<DriverVehiculeScreen> {
  bool _isLoading = true;
  List<dynamic> _vehicles = [];
  bool _isOwner = false;
  String _error = '';

  @override
  void initState() {
    super.initState();
    _fetchData();
  }

  Future<void> _fetchData() async {
    setState(() { _isLoading = true; _error = ''; });
    try {
      final userRes = await ApiClient().get('/v1/auth/me');
      final userData = jsonDecode(userRes.body)['user'];
      _isOwner = userData['driverProfile']?['type'] == 'OWNER';

      final vehiclesRes = await ApiClient().get('/v1/drivers/me/vehicles');
      final vehiclesData = jsonDecode(vehiclesRes.body);
      _vehicles = vehiclesData is List ? vehiclesData : [];
    } catch (e) {
      _error = 'Impossible de charger les données: ${e.toString()}';
    } finally {
      if (mounted) setState(() { _isLoading = false; });
    }
  }

  void _showAddVehicleDialog() {
    final plateController = TextEditingController();
    String type = 'TAXI_7_PLACES';
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Soumettre un véhicule'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(controller: plateController, decoration: const InputDecoration(labelText: 'Plaque (ex: AA-123-BB)')),
            DropdownButtonFormField<String>(
              value: type,
              items: const [
                DropdownMenuItem(value: 'TAXI_7_PLACES', child: Text('Taxi 7 Places')),
                DropdownMenuItem(value: 'MINIBUS_15', child: Text('Minibus 15 Places')),
                DropdownMenuItem(value: 'MINIBUS_30', child: Text('Minibus 30 Places')),
                DropdownMenuItem(value: 'BUS_50', child: Text('Bus 50 Places')),
              ],
              onChanged: (val) { if (val != null) type = val; },
              decoration: const InputDecoration(labelText: 'Type de véhicule'),
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Annuler')),
          ElevatedButton(
            onPressed: () async {
              Navigator.pop(ctx);
              try {
                await ApiClient().post('/v1/drivers/me/vehicles', body: {
                  'plateNumber': plateController.text.trim(),
                  'type': type,
                  'capacity': type == 'TAXI_7_PLACES' ? 7 : (type == 'MINIBUS_15' ? 15 : (type == 'MINIBUS_30' ? 30 : 50)),
                });
                _fetchData();
              } catch (e) {
                if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Erreur: ${e.toString()}')));
              }
            },
            child: const Text('Soumettre'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text('Mon Véhicule', style: TextStyle(fontWeight: FontWeight.bold)),
        centerTitle: true,
      ),
      body: _isLoading 
        ? const Center(child: CircularProgressIndicator())
        : _error.isNotEmpty 
          ? Center(child: Text(_error, style: const TextStyle(color: Colors.red)))
          : _vehicles.isEmpty
            ? Center(
                child: Padding(
                  padding: const EdgeInsets.all(24.0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.directions_car, size: 64, color: Colors.grey),
                      const SizedBox(height: 16),
                      const Text(
                        "Aucun véhicule n'est encore associé à votre compte. Vous pouvez soumettre un véhicule pour validation.",
                        textAlign: TextAlign.center,
                        style: TextStyle(fontSize: 16),
                      ),
                      const SizedBox(height: 24),
                      if (_isOwner)
                        ElevatedButton(
                          onPressed: _showAddVehicleDialog,
                          child: const Text('Soumettre un véhicule'),
                        ),
                    ],
                  ),
                ),
              )
            : ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: _vehicles.length,
                itemBuilder: (context, index) {
                  final v = _vehicles[index];
                  String statusText = '';
                  Color statusColor = Colors.grey;
                  if (v['status'] == 'PENDING_REVIEW') {
                    statusText = "Véhicule en attente de validation par l'administration.";
                    statusColor = Colors.orange;
                  } else if (v['status'] == 'REJECTED') {
                    statusText = "Véhicule rejeté";
                    statusColor = Colors.red;
                  } else if (v['status'] == 'APPROVED' || v['status'] == 'ACTIVE') {
                    statusText = "Approuvé";
                    statusColor = Colors.green;
                  } else {
                    statusText = v['status'] ?? 'Inconnu';
                  }

                  return Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(v['plateNumber'] ?? '', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                              Expanded(
                                child: Text(
                                  statusText, 
                                  style: TextStyle(color: statusColor, fontSize: 12, fontWeight: FontWeight.bold),
                                  textAlign: TextAlign.right,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Text('Type: ${v['type']}'),
                          Text('Capacité: ${v['capacity']} places'),
                          if (v['brand'] != null) Text('Marque: ${v['brand']}'),
                          if (v['model'] != null) Text('Modèle: ${v['model']}'),
                        ],
                      ),
                    ),
                  );
                },
              ),
    );
  }
}
