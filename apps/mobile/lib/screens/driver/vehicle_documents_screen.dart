import 'package:flutter/material.dart';
import '../../services/api_client.dart';
import 'dart:convert';
import 'dart:io';

class VehicleDocumentsScreen extends StatefulWidget {
  final String vehicleId;
  const VehicleDocumentsScreen({super.key, required this.vehicleId});

  @override
  State<VehicleDocumentsScreen> createState() => _VehicleDocumentsScreenState();
}

class _VehicleDocumentsScreenState extends State<VehicleDocumentsScreen> {
  bool _isLoading = true;
  List<dynamic> _documents = [];
  String _error = '';

  @override
  void initState() {
    super.initState();
    _fetchDocuments();
  }

  Future<void> _fetchDocuments() async {
    setState(() { _isLoading = true; _error = ''; });
    try {
      final res = await ApiClient().get('/v1/drivers/me/vehicles/${widget.vehicleId}/documents');
      _documents = jsonDecode(res.body);
    } catch (e) {
      _error = 'Erreur de chargement: ${e.toString()}';
    } finally {
      if (mounted) setState(() { _isLoading = false; });
    }
  }

  Future<void> _uploadDocument(String type) async {
    // Dans un vrai device on ouvrirait FilePicker ou ImagePicker
    // Ici pour la logique de test, on simule l'appel API ou on montre un message.
    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Sélecteur de fichier (Mock)')));
    
    // Simuler le succès d'un upload
    // try {
    //   await ApiClient().postMultipart(
    //     '/v1/drivers/me/vehicles/${widget.vehicleId}/documents',
    //     {'type': type},
    //     [fichier]
    //   );
    //   _fetchDocuments();
    //   ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Document envoyé pour validation.')));
    // } catch (e) { ... }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Papiers du véhicule')),
      body: _isLoading 
        ? const Center(child: CircularProgressIndicator())
        : _error.isNotEmpty
          ? Center(child: Text(_error, style: const TextStyle(color: Colors.red)))
          : ListView(
              padding: const EdgeInsets.all(16),
              children: [
                _buildDocItem('REGISTRATION_CARD', 'Carte Grise'),
                _buildDocItem('INSURANCE', 'Assurance'),
                _buildDocItem('TECHNICAL_INSPECTION', 'Visite Technique'),
              ],
            )
    );
  }

  Widget _buildDocItem(String type, String label) {
    final docs = _documents.where((d) => d['type'] == type).toList();
    docs.sort((a, b) => (b['createdAt'] ?? '').compareTo(a['createdAt'] ?? ''));
    final currentDoc = docs.isNotEmpty ? docs.first : null;
    
    String status = currentDoc?['status'] ?? 'MANQUANT';
    Color color = Colors.grey;
    if (status == 'APPROVED') {
      color = Colors.green;
    } else if (status == 'PENDING_REVIEW') {
      color = Colors.orange;
    } else if (status == 'REJECTED') {
      color = Colors.red;
    }

    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Row(
              children: [
                const Text('Statut: ', style: TextStyle(color: Colors.grey)),
                Text(status, style: TextStyle(color: color, fontWeight: FontWeight.bold)),
              ],
            ),
            if (status == 'REJECTED' && currentDoc?['rejectionReason'] != null)
              Padding(
                padding: const EdgeInsets.only(top: 8),
                child: Text('Motif: ${currentDoc['rejectionReason']}', style: const TextStyle(color: Colors.red)),
              ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () => _uploadDocument(type),
              child: const Text('Ajouter / Remplacer'),
            )
          ],
        ),
      ),
    );
  }
}
