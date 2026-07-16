import 'package:flutter/material.dart';
import '../../services/api_client.dart';
import 'dart:convert';
import 'vehicle_submission_screen.dart';

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

  Future<void> _navigateToSubmission([Map<String, dynamic>? vehicle]) async {
    final result = await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => VehicleSubmissionScreen(existingVehicle: vehicle),
      ),
    );
    if (result == true) {
      _fetchData();
    }
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
        actions: [
          if (_isOwner)
            IconButton(
              icon: const Icon(Icons.add),
              onPressed: () => _navigateToSubmission(),
            ),
        ],
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
                          onPressed: () => _navigateToSubmission(),
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
                  String appStatus = v['approvalStatus'] ?? v['status'] ?? '';
                  String certStatus = v['certificationStatus'] ?? 'NOT_CERTIFIED';
                  String statusText = '';
                  Color statusColor = Colors.grey;
                  
                  if (appStatus == 'PENDING_REVIEW') {
                    statusText = "Approbation: En attente";
                    statusColor = Colors.orange;
                  } else if (appStatus == 'REJECTED') {
                    statusText = "Approbation: Rejeté";
                    statusColor = Colors.red;
                  } else if (appStatus == 'APPROVED' || appStatus == 'ACTIVE') {
                    statusText = "Approbation: Approuvé";
                    statusColor = Colors.green;
                  } else {
                    statusText = appStatus;
                  }

                  String certText = '';
                  Color certColor = Colors.grey;
                  if (certStatus == 'CERTIFIED') {
                    certText = 'Véhicule Certifié';
                    certColor = Colors.blue;
                  } else if (certStatus == 'REVOKED') {
                    certText = 'Certification Révoquée';
                    certColor = Colors.red;
                  } else {
                    certText = 'Non certifié';
                  }

                  return GestureDetector(
                    onTap: () {
                      if (_isOwner && certStatus != 'CERTIFIED') {
                        _navigateToSubmission(v);
                      } else if (certStatus == 'CERTIFIED') {
                        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Véhicule certifié. Modification non autorisée. Veuillez contacter le support.')));
                      }
                    },
                    child: Card(
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
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.end,
                                  children: [
                                    Text(
                                      statusText, 
                                      style: TextStyle(color: statusColor, fontSize: 12, fontWeight: FontWeight.bold),
                                      textAlign: TextAlign.right,
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      certText,
                                      style: TextStyle(color: certColor, fontSize: 12, fontWeight: FontWeight.bold),
                                      textAlign: TextAlign.right,
                                    ),
                                  ],
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
                    ),
                  );
                },
              ),
    );
  }
}
